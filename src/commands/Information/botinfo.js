const { version, name, author, license } = require("../../../package.json");
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'botinfo',
	description: 'Get information about me',
	async execute(bot, message, args){
		const embed = new MessageEmbed({
			color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
			title: name
		})
		.setThumbnail(bot.user.displayAvatarURL())
		.addField("**Version**",version)
		.addField("**Library**","discord.js v12")
		.addField("**Creator**",author)
		.addField("**License**",license)
		.addField("**Servers**",bot.guilds.cache.array().length);
		message.reply(embed);
	}
};