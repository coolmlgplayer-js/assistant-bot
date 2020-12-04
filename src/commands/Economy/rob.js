const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const currency = process.env.currency || 'KoolKoins';
const defaultAmount = process.env.defaultAmount || 2500;

module.exports = {
    name: 'rob',
    description: 'Rob someone :o',
    cooldown: '2m',
    arguments: {
        required: ['Member']
    },
    async execute(bot, message, args){
        const { member, guild } = message;
        const target = bot.User(args.join(' '),guild)[0];
        if(!target || target.bot || target.id === member.id) throw new Error('Invalid User (You can\'t rob bots or yourself!');
        if(!db.has(`${member.id}.economy.bank`)) db.set(`${member.id}.economy.bank`,defaultAmount);
        if(!db.has(`${member.id}.economy.wallet`)) db.set(`${member.id}.economy.wallet`,0);
        if(!db.has(`${target.id}.economy.bank`)) db.set(`${target.id}.economy.bank`,defaultAmount);
        if(!db.has(`${target.id}.economy.wallet`)) db.set(`${target.id}.economy.wallet`,0);
        const selfWallet = db.get(`${member.id}.economy.wallet`);
        const targetWallet = db.get(`${target.id}.economy.wallet`);
        if(selfWallet < 500) throw new Error(`You must have atleast **500** ${currency} in your **wallet** to rob someone!`);
        if(targetWallet < 1) throw new Error(`${target.tag} has no ${currency} in their wallet!`);
        const success = Math.floor(Math.random() * 2);
        var minToRob = 50;
        var maxToRob = 500;
        if(targetWallet < 500) maxToRob = targetWallet;
        if(targetWallet < 50) minToRob = targetWallet;
        const amount = Math.floor(Math.random() * (maxToRob - minToRob + 1)) + minToRob;
        if(!success){
            db.add(`${target.id}.economy.wallet`,amount);
            db.subtract(`${member.id}.economy.wallet`,amount);
            return message.reply(`You tried robbing **${target.tag}**, but they caught you and stole **${amount}** ${currency} from you!`);
        }else{
            db.subtract(`${target.id}.economy.wallet`,amount);
            db.add(`${member.id}.economy.wallet`,amount);
            return message.reply(`You successfully stole **${amount}** ${currency} from **${target.tag}**`);
        }
    }
};