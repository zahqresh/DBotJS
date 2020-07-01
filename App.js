const Discord = require('discord.js');
const client = new Discord.Client();
client.once('ready', () => {
	console.log('Ready!');
});
var ID = '676624147589365801'
client.on('message', message => {
   if (message.content === '.') {

/*
let ids = [];
let usernames = [];

	 client.users.cache.map(user=>{
		 ids.push(user.id);
		 usernames.push(user.username);
	 });

	 console.log(ids);
	 console.log(usernames);
	 */

/*

//Desc Get nickname by id
	 console.log(message.guild.members.cache.get('676624147589365801').nickname);

//Get roles by id
console.log(message.guild.members.cache.get('676624147589365801')._roles);

*/

//Get _role name with id
console.log(message.guild.roles.cache.get('727396380842131526').name);

}

});



client.login('NzI3MzczMDU2MzcyMzc1NTgz.Xvq9sQ.dWQjOukYk7SKP6RfTJO0Gwq8hg0');
