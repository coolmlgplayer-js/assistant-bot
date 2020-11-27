const { inspect } = require("util");
const Discord = require("discord.js");
const fs = require("fs");
const db = require("quick.db");
var { prefix, owners } = process.env;
owners = JSON.parse(owners);
const axios = require("axios");
const Embed = Discord.MessageEmbed;
module.exports = {
    name: 'eval',
    aliases: ['e','evaluate'],
    arguments: {
        required: ['JavaScript']
    },
    description: 'Execute some code',
    ownerOnly: true,
    async execute(bot, message, args){
        var m = message;
        var msg = m;
        var self = m.member;
        if(!self) self = m.author;
        var { guild, channel } = m;
        async function send(i,o){
            return message.channel.send(i,o);
        };
        var { channels, roles, members } = guild;
        var { User, UserFromID, commands } = bot;
        const code = args.slice(0).join(" ");
        try {
		    return Promise.resolve(eval("(async () => {" + code + "})()")).then((e)=>{

            }).catch((e) => {
			    const embed = new Discord.MessageEmbed()
				    .setTitle("Error")
				    .setColor("ff5555")
				    .setDescription(e)
			    return message.reply(embed);
	    	});
	        } catch (e) {
		        const embed = new Discord.MessageEmbed()
			        .setTitle("Error")
			        .setColor("ff5555")
			        .setDescription(e)
		    return message.reply(embed);
	        };
    }
};