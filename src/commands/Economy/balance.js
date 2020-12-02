const db = require('quick.db');
const currency = process.env.currency || 'KoolKoins';

module.exports  = {
    name: 'balance',
    aliases: ['bal'],
    description: `Get your's or someone else's ${currency} balance`,
    arguments: {
        optional: ['User']
    },
    async execute(bot, message, args){
        const { User } = bot;
        var user = message.author;
        if(args.length > 0) user = User(args.join(' '),message.guild)[0];
        if(!user) throw new Error('User not found!');
        if(user.bot) throw new Error('That user is a bot!');
        const balance = (db.get(`${user.id}.balance`) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return message.reply((user == message.author ? 'You have ' : `**${user.tag}** has `) + `**${balance}** ${currency}`);
    }
};