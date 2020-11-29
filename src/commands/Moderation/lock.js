const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'lock',
    description: 'Lock current channel',
    arguments: {
        optional: ['Reason']
    },
    permission: 'Manage Channels',
    async execute(bot, message, args) {
        var reason = args.join(" ");
        if (!args[0]) reason = "None Provided";
        const { channel,member } = message;
        const embed = new MessageEmbed({
            title: "Channel Locked 🔒 ",
            color: "ff5555",
            description: `${channel.toString()} has been locked by ${member.toString()} for the reason: **${reason}**`
        });
        channel.updateOverwrite(channel.guild.roles.everyone, {
            SEND_MESSAGES: false
        }).then(() => {
            channel.send(embed);
        }).catch(() => {
            message.reply("I couldn't do that");
        });
    }
};