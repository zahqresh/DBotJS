const Discord = require("discord.js");
const client = new Discord.Client({ ws: { intents: Discord.Intents.ALL } });
const mongoose = require("mongoose");
const db = require("./Schema/db");
var sizeof = require("object-sizeof");
const { token, prefix } = require("./config/keys");
const express = require("express");
const app = express();
const routes = require("./routes");
var counter = 0;
//routes setup
app.use("/", routes);

//Connect databse
mongoose.connect(
  "mongodb://localhost:27017/dbot",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("DB HAS BEEN CONNECTED...");
  }
);

client.on("message", (msg) => {
  if (msg.content == `${prefix}updateUsers`) {
    msg.guild.members.fetch().then((member) => {
      member.forEach((e) => {
        db.exists({ username: e.user.username }, (err, bool) => {
          //keep track of users and increase counter
          counter++;
          if (bool == true) {
            //means user exists then update
            //update in db
            db.findOneAndUpdate(
              { username: e.user.username },
              {
                username: e.user.username,
                nickname: e.nickname,
                roles: msg.guild.member(e.user)._roles,
                avatar: e.user.displayAvatarURL(),
              }
            ).then((doc) => {
              console.log(doc, " user updated!");
            });
          }
          //if user does not exists
          if (bool == false) {
            db({
              username: e.user.username,
              nickname: e.nickname,
              roles: msg.guild.member(e.user)._roles,
              avatar: e.user.displayAvatarURL(),
            })
              .save()
              .then((doc) => {
                console.log(doc, " user saved");
              });
          }
          //if error
          if (err) {
            console.log(err);
            msg.channel.send("An error occured");
          }
        });
      });
    }).then(()=>{
      msg.channel.send(` Updating users...`)
    })
  }
});

//get ready the bot
client.once("ready", () => {
  console.log("Bot Is Ready!");
});

//start the bot
client.login(token);

//start the server
app.listen(3000, () => {
  console.log("SERVER IS UP!");
});
