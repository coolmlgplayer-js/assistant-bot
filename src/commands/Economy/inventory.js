const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const currency = process.env.currency || 'KoolKoins';

module.exports = {
    name: 'inventory',
    description: 'Show your inventory',
    async execute(bot, message, args){
        const { member } = message;
        const items = db.get(`${member.id}.economy.items`) || [];
        if(items.length < 1) throw new Error('You have no items!');
        const itemsList = {};
        items.forEach(function(item){
            if(itemsList[item.name]) return itemsList[item.name]++;
            itemsList[item.name] = 1;
        });
        var strArr = [];
        for(const itemName in itemsList){
            const amount = itemsList[itemName];
            strArr.push(`${itemName}: ${amount}`);
        }
        const embed = new MessageEmbed({
            color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
            title: 'Your inventory',
            description: strArr.join('\n')
        });
        return message.reply(embed);
    }
};