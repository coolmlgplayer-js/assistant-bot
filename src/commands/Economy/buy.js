const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const currency = process.env.currency || 'KoolKoins';
const defaultAmount = process.env.defaultAmount || 2500;

module.exports = {
    name: 'buy',
    aliases: ['purchase'],
    description: `Buy an item from the shop with ${currency}`,
    arguments: {
        required: ['Item'],
        optional: ['Quantity']
    },
    async execute(bot, message, args){
        if(args.length < 2) args.push('1');
        const item = bot.shop.get(args.shift());
        if(!item) throw new Error('Invalid item!');
        var price = item.price;
        var maxQuantity = 0;
        if(item.maxQuantity) maxQuantity = item.maxQuantity;
        var quantity = args.join(' ');
        if(isNaN(quantity) || quantity.includes('.') || parseInt(quantity) < 0) throw new Error('Invalid quantity!');
        quantity = parseInt(quantity);
        price = price * quantity;
        const { member } = message;
        if(!db.has(`${member.id}.economy.bank`)) db.set(`${member.id}.economy.bank`,defaultAmount);
        if(!db.has(`${member.id}.economy.wallet`)) db.set(`${member.id}.economy.wallet`,0);
        const walletBalance = db.get(`${member.id}.economy.wallet`);
        const bankBalance = db.get(`${member.id}.economy.bank`);
        const playerItems = db.get(`${member.id}.economy.items`) || [];
        if(maxQuantity > 0){
            if(playerItems.filter(x => x.name === item.name).length >= maxQuantity) throw new Error(`You already have ${maxQuantity} of the item: ${item.name}!`);
            if(quantity > maxQuantity || playerItems.filter(x => x.name === item.name).length + quantity > maxQuantity) throw new Error(`You can only have ${maxQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} of this item!`);
        }
        if(price > walletBalance) throw new Error(`You do not have enough ${currency} in your wallet!`);
        db.subtract(`${member.id}.economy.wallet`,price);
        if(!db.has(`${member.id}.economy.items`)) db.set(`${member.id}.economy.items`,[]);
        for(var i = 0;i < quantity; i++){
            db.push(`${member.id}.economy.items`,{
                name: item.name
            });
        };
        return message.reply(`Successfully bought ${quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} of the item: ${item.name}`);
    }
}