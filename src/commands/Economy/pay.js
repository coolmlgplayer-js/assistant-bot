const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const currency = process.env.currency || 'KoolKoins';
const defaultAmount = process.env.defaultAmount || 2500;
const maxBank = process.env.maxBank || 5000;

module.exports = {
    name: 'pay',
    description: `Pay a user some ${currency} from your wallet`,
    cooldown: '1m',
    arguments: {
        required: ['User','Amount']
    },
    async execute(bot, message, args){
        const { member, guild } = message;
        var amount = args.pop();
        const target = bot.User(args.join(' '),guild)[0];
        if(!target || target.bot || target.id === member.id) throw new Error('Invalid User (You can\'t pay bots or yourself!)');
        if(isNaN(amount) || parseInt(amount) < 1 || amount.includes('.')) throw new Error('Invalid amount!');
        amount = parseInt(amount);
        if(!db.has(`${member.id}.economy.bank`)) db.set(`${member.id}.economy.bank`,defaultAmount);
        if(!db.has(`${member.id}.economy.wallet`)) db.set(`${member.id}.economy.wallet`,0);
        if(!db.has(`${target.id}.economy.bank`)) db.set(`${target.id}.economy.bank`,defaultAmount);
        if(!db.has(`${target.id}.economy.wallet`)) db.set(`${target.id}.economy.wallet`,0);
        const selfWallet = db.get(`${member.id}.economy.wallet`);
        if(selfWallet < amount) throw new Error(`You do not have enough ${currency}!`);
        db.subtract(`${member.id}.economy.wallet`,amount);
        db.add(`${target.id}.economy.wallet`,amount);
        return message.reply(`Successfully paid **${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}** ${currency} to **${target.tag}**`)        
    }
};