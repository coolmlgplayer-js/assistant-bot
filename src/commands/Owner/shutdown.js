const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'shutdown',
    description: 'Shutdown the bot',
    ownerOnly: true,
    async execute(bot, message, args){
        await message.reply(new MessageEmbed({
            color: "ff5555",
            title: "System",
            description: "Shutting down..."
        })).catch();
        process.exit();
    }
};