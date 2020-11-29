const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unlock',
    description: 'Unlock current channel',
    permission: 'Manage Channels',
    async execute(bot, message, args) {
        const { channel,member } = message;
        var embed = new MessageEmbed({
            title: "Channel Unlocked 🔓 ",
            color: "99ff99",
            description: `${channel.toString()} has been unlocked by ${member.toString()}`
        });

        channel.updateOverwrite(channel.guild.roles.everyone, {
            SEND_MESSAGES: null
        }).then(() => {
            channel.send(embed);
        }).catch(() => {
            message.reply("I couldn't do that");
        });
    }
};