const db = require('quick.db');

module.exports = {
    name: 'Role',
    async execute(bot, message, args){
        const input = args.join(' ');
        const { guild } = message;
        const role = guild.roles.cache.filter(r => r.toString() !== '@everyone').find(r => r.name.toLowerCase() === input.toLowerCase() || r.id === input || r.toString() === input);
        if(!role) throw new Error('Invalid Role!');
        db.set(`${guild.id}.role`,role.id);
        return message.reply(`Set the verified role to \`@${role.name}\``);
    }
}