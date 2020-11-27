const { MessageEmbed } = require("discord.js");
module.exports = {
    name: 'ping',
    description: "Simple ping command",
    async execute(bot, message, args) {
        var datime = new Date(message.createdTimestamp)
        message.reply("Pinging...").then(m => {
            datime = Math.floor(new Date(m.createdTimestamp) - datime);
            const embed = new MessageEmbed({
                    color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
                    thumbnail: {
                        url: bot.user.displayAvatarURL({
                            dynamic: true
                        })
                    }
                })
                .addField("**Ping**", datime + " ms")
                .addField("**API Ping**", Math.floor(bot.ws.ping) + " ms");
            m.edit(message.author.toString() + ", Pong!", embed);
        });
    }
};