const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const currency = process.env.currency || 'KoolKoins';
const defaultAmount = process.env.defaultAmount || 2500;
const maxBank = process.env.maxBank || 5000;


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
        if(!db.has(`${user.id}.economy.bank`)) db.set(`${user.id}.economy.bank`,defaultAmount);
        const walletBalance = (db.get(`${user.id}.economy.wallet`) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const bankBalance = (db.get(`${user.id}.economy.bank`)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const bankMax = (db.get(`${user.id}.economy.maxBank`) || maxBank).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
