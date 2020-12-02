const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
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
        const walletBalance = (db.get(`${user.id}.economy.wallet`) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const bankBalance = (db.get(`${user.id}.economy.bank`) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const bankMax = (db.get(`${user.id}.economy.maxBank`) || 5000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const embed = new MessageEmbed({
            color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
            author: {
                name: user.tag,
                icon_url: user.displayAvatarURL({dynamic: true, format: 'png'})
            },
            title: `${currency} Balance`,
            description: `**Wallet**: ${walletBalance}\n**Bank**: ${bankBalance}/${bankMax}`
        });
        return message.reply(embed);
    }
};