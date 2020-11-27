const urban = require("urban-dictionary");
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'urban',
    definition: 'Define a word/phrase with Urban Dictionary',
    arguments: {
        required: ['Word']
    },
    async execute(bot, message, args){
        var word = args.join(" ");
        var result = await urban.term(word).catch(e => {
            throw e;
        });
        result = result.entries[0];
        if(!result) throw new Error("No definition found");
        if(result.definition > 2048) result.definition = result.definition.slice(0,2045) + "...";
        if(result.example > 1024) result.example = result.example.slice(0,1021) + "...";
        const embed = new MessageEmbed({
            color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
            title: result.word,
            url: result.permalink,
            description: result.definition,
            footer: {
                text: `👍: ${result.thumbs_up} | 👎: ${result.thumbs_down}`
            }
        })
        .addField("Example", result.example || "No example");
        message.reply(embed);
    }
}