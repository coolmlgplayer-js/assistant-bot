const { version, name, author, contributors, license } = require("../../../package.json");
const { MessageEmbed } = require('discord.js');

var contributorsArr = [];
contributors.forEach(function(contributor){
    contributorsArr.push(`[${contributor.name}](${contributor.url})`);
});

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
                .addField("**Contributors**",contributorsArr.join("\n"))
		.addField("**License**",license)
		.addField("**Servers**",bot.guilds.cache.array().length);
		message.reply(embed);
	}
};
