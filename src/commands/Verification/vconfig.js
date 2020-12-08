const { MessageEmbed, Collection } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const { prefix } = process.env;
const subCommands = new Collection();

const files = fs.readdirSync(`${__dirname}/config`);
for(const file of files){
    const cmd = require(`./config/${file}`);
    subCommands.set(cmd.name,cmd);
}

module.exports = {
    name: 'vconfig',
    description: 'Configure captcha verification',
    permission: 'Administrator',
    arguments: {
        optional: ['Setting', 'Value']
    },
    async execute(bot, message, args){
        const { guild } = message;
        if(args.length < 1){
            const embed = new MessageEmbed({
                color: guild.me.roles.color ? guild.me.roles.color.hexColor : guild.me.roles.highest.hexColor,
                title: '**Verification Configuration**',
                footer: {
                	text: `${prefix}vconfig <Setting> <Value>`
                }
            });
            subCommands.map(subCmd => {
                var value = db.get(`${guild.id}.${subCmd.name.toLowerCase()}`) || 'None';
                if(subCmd.name.toLowerCase() === 'channel' && value !== 'None') value = `<#${value}>`;
                if(subCmd.name.toLowerCase() === 'role' && value !== 'None') value = `<@&${value}>`;
                embed.addField(`**${subCmd.name}**`,value);
            });
            return message.reply(embed);
        }else if(args.length < 2){
            throw new Error('Please supply a value!');
        }else{
            const subCmd = subCommands.find(c => c.name.toLowerCase() === args[0].toLowerCase());
            if(!subCmd) throw new Error(`No setting called \`${args[0]}\` found!`);
            return subCmd.execute(bot, message, args.slice(1));
        }
    }
}
