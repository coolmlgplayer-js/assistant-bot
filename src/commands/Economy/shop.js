const { MessageEmbed } = require('discord.js');
const currency = process.env.currency || 'KoolKoins';
const { prefix } = process.env;

module.exports = {
    name: 'shop',
    description: `The shop where you spend your ${currency}`,
    arguments: {
        optional: ['Item']
    },
    async execute(bot, message, args){
        const shop = bot.shop;
        if(args.length > 0){
            const item = bot.shop.get(args.join(' '));
            if(!item) throw new Error('Invalid item!');
            const embed = new MessageEmbed({
                title: item.name,
                color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor
            })
            .addField('**Price**',item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            if(item.maxQuantity) embed.addField('**Max Quantity**',item.maxQuantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g));
            return message.reply(embed);
        }else{
            const items = [];
            bot.shop.map(item => items.push(item.name));
            const embed = new MessageEmbed({
                title: 'Shop',
                color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
                description: items.join('\n'),
                footer: {
                    text: `For more info about an item run ${prefix}shop <Item>`
                }
            });
            return message.reply(embed);
        };
    }
};