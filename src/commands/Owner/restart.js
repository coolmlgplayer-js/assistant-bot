const { MessageEmbed } = require('discord.js');
const db = require("quick.db");

module.exports = {
    name: 'restart',
    description: 'restart the bot',
    ownerOnly: true,
    async execute(bot, message, args){
        var m = await message.reply(new MessageEmbed({
            color: "ff9900",
            title: "System",
            description: "Restarting..."
        })).catch();
        var id = m.id || undefined;
        db.set('restart_thing',{
            channel: message.channel.id,
            msg: id
        });
        process.exit(1);
    }
};