const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'invite',
	description: 'Generate an invite for the bot',
	async execute(bot, message, args){
		const m = await message.channel.send("Generating invite...");
		const invite = await bot.generateInvite({
			permissions: 8
		});
		m.edit("Invite Generated",new MessageEmbed({
			color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
			title: "Bot Invite",
			url: invite,
		}).setFooter(bot.user.username,bot.user.displayAvatarURL()));
	}
};