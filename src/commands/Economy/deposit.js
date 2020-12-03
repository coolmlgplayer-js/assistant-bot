const db = require('quick.db');
const currency = process.env.currency || 'KoolKoins';
const defaultAmount = process.env.defaultAmount || 2500;
const maxBank = process.env.maxBank || 5000;

module.exports = {
    name: 'deposit',
    aliases: ['dep'],
    description: `Deposit some ${currency} into your bank`,
    arguments: {
        required: ['Amount']
    },
    async execute(bot, message, args){
        const { member } = message;
        var amount = args.join(' ').split(',').join('');
        if((isNaN(amount) || amount.includes('.') || parseInt(amount) < 0) && amount !== 'all') throw new Error('Invalid amount!');
        if(amount !== 'all') amount = parseInt(amount);
        if(!db.has(`${member.id}.economy.wallet`)) db.set(`${member.id}.economy.wallet`,defaultAmount);
        if(!db.has(`${member.id}.economy.bank`)) db.set(`${member.id}.economy.bank`,0);
        const walletBalance = db.get(`${member.id}.economy.wallet`);
        const bankBalance = db.get(`${member.id}.economy.bank`);
        const bankMax = db.get(`${member.id}.economy.maxBank`) || maxBank;
        amount = (amount == 'all') ? walletBalance : amount;
        if(walletBalance < amount) throw new Error(`You do not have enough ${currency} in your wallet!`);
        if(bankBalance === bankMax) throw new Error('Your bank is full!');
        const maxToPutIn = bankMax - bankBalance;
        if(amount > maxToPutIn) amount = maxToPutIn;
        db.subtract(`${member.id}.economy.wallet`,amount);
        db.add(`${member.id}.economy.bank`,amount);
        return message.reply(`Deposited **${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}** ${currency} into your bank!`);
    }
};