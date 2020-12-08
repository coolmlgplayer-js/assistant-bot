const db = require('quick.db');

module.exports = {
    name: 'Channel',
    async execute(bot, message, args){
        const input = args.join(' ');
        const { guild } = message;
        const channel = guild.channels.cache.find(c => c.name.toLowerCase() === input.toLowerCase() || c.id === input || c.toString() === input);
        if(!channel) throw new Error('Invalid Channel!');
        db.set(`${guild.id}.channel`,channel.id);
        return message.reply(`Set the verify channel to ${channel.toString()}`);
    }
}