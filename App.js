const Discord = require("discord.js");
const client = new Discord.Client();
const mongoose = require("mongoose");
const db = require("./Schema/db");
var sizeof = require("object-sizeof");
const { token, prefix } = require("./config/keys");
//Connect databse
mongoose.connect(
  "mongodb://localhost:27017/dbot",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("DB connected!");
  }
);

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  if (message.content === `${prefix}sync`) {
    let ids = [];
    let usernames = [];
    let roles = [];
    let role_id = [];
    let nickname = [];
    let obj = [];
    var data;
    client.users.cache.map((user) => {
      ids.push(user.id); //get id of one user
      usernames.push(user.username); //get username of one user
      role_id.push(message.guild.members.cache.get(user.id)._roles); //get roles with id of one user
      nickname.push(message.guild.members.cache.get(user.id).nickname); //get nickname of one user
    });

    //Algo to save roles nickname and username in one obj.
    for (var j = 0; j < ids.length; j++) {
      obj.push([usernames[j], nickname[j], role_id[j]]);
    }
    //Save username nickname roles in database
    for (let i = 0; i < obj.length; i++) {
      //check if users are already there then return else save
      let doc;
      db.find({ nickname: obj[i][1] }).then((data) => {
        if (sizeof(data) == 0) {
          //save users to db
          new db({
            username: obj[i][0],
            nickname: obj[i][1],
            roles: obj[i][2],
          })
            .save()
            .then((data) => {
              console.log(data);
            })
            .catch((error) => {
              throw error;
              message.channel.send(error);
            });
        } else {
          console.log("User already exists");
        }
      });
    }
    message.channel.send("User synchronized!");
  }
});

//Updating roles
client.on("message", (message) => {
  if (message.content === `${prefix}syncroles`) {
    let role_id = [];
    let usernames = [];
    let obj = [];
    client.users.cache.map((user) => {
      usernames.push(user.username); //get username of one user
      role_id.push(message.guild.members.cache.get(user.id)._roles); //get roles with id of one user
    });

    //Algo to save roles and username in one obj.
    for (var j = 0; j < role_id.length; j++) {
      obj.push([usernames[j], role_id[j]]);
    }

    for (let i = 0; i < obj.length; i++) {
      //Find user by username and update the roles
      db.findOneAndUpdate(
        {
          username: usernames[i], // search by username
        },
        {
          roles: role_id[i], // Update roles
        },
        {
          new: true, // return updated doc
          runValidators: true, // validate before update
        }
      )
        .then((doc) => {
          console.log("Roles updated!");
        })
        .catch((err) => {
          console.error(err);
          message.channel.send(err);
        });
    }
    message.channel.send("Roles Updated!");
  }
  
});

client.login(token);
