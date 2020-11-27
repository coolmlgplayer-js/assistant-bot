const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'uptime',
    description: 'Get the bot\'s uptime',
    async execute(bot, message, args){
        var totalSeconds = (bot.uptime / 1000);
        var days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        var hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = Math.round(totalSeconds % 60);
        var uptime = `${days} day(s), ${hours} hour(s), ${minutes} minute(s) and ${seconds} second(s)`;
        const embed = new MessageEmbed()
            .setColor(message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor)
            .setTitle('Bot Uptime'.bold())
            .setDescription(uptime)
		    .setFooter( message.author.tag + " | " + message.author.id, message.author.displayAvatarURL({dynamic: true,format: "png"}))
            .setTimestamp();
        return message.reply(embed);
    }
}