const { MessageEmbed } = require("discord.js");
const { prefix } = process.env;
const { execute } = require("./help");

module.exports = {
    name: 'info',
    arguments: {
        required: ['Command']
    },
    description: 'Get information about a command',
    async execute(bot, message, args){
        const input = args.join(" ");
        const command = bot.commands.get(input) || bot.commands.find(c => c.aliases && c.aliases.includes(input));
        if(!command || command.guild && message.guild.id !== command.guild) throw new Error("Invalid Command!");
        const embed = new MessageEmbed({
            color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
            title: command.name,
            description: command.description || "No description for given command"
        });
        embed.addField("**Category**",command.type);
        if(command.aliases) embed.addField("**Aliases**", command.aliases.join(", "));
        if(command.ownerOnly) command.permission = "Bot Owner";
        if(command.permission) embed.addField("**Permission**",command.permission);
        if(command.arguments){
            if(command.arguments.required) embed.addField("**Required Arguments**","`" + command.arguments.required.join("`, `") + "`")
            if(command.arguments.optional) embed.addField("**Optional Arguments**","`" + command.arguments.optional.join("`, `") + "`")
        };
        message.reply(embed);
    }
};