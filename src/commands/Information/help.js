const { MessageEmbed } = require("discord.js");
const { prefix } = process.env;
module.exports = {
    name: 'help',
    description: 'The help command :p',
    arguments: {
        optional: ['Category/Command']
    },
    async execute(bot, message, args){
        if(args.length > 0){
            var category = args.join(" ");
            category = bot.categories.find(c => c.toLowerCase() === category.toLowerCase());
            var command = bot.commands.get(args.join(" ")) || bot.commands.find(c => c.aliases && c.aliases.includes(args.join(" ")));
            if(command && command.guild && command.guild != message.guild.id) command = undefined;
            if(command){
                const embed = new MessageEmbed({
                    title: `**${command.name}**`,
                    color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
                    description: command.description || 'No description available',
                });
                embed.addField("**Category**",command.type);
                if(command.aliases) embed.addField("**Aliases**", command.aliases.join(", "));
                if(command.ownerOnly) command.permission = "Bot Owner";
                if(command.permission) embed.addField("**Permission**",command.permission);
                if(command.cooldown) embed.addField("**Cooldown**",command.cooldown);
                if(command.arguments){
                    if(command.arguments.required) embed.addField("**Required Arguments**","`" + command.arguments.required.join("`, `") + "`")
                    if(command.arguments.optional) embed.addField("**Optional Arguments**","`" + command.arguments.optional.join("`, `") + "`")
                };
                return message.reply(embed);
            };
            if(typeof category != "string" && !command) throw new Error(`Invalid Category/Command! For a list of categories run \`${prefix}help\``);
            const commands = bot.commands.filter(function(cmd){
              if(cmd.guild && cmd.guild !== message.guild.id){
              
              }else{
            	if(cmd.type === category) return cmd;
            	};
            });
            if(commands.array().length < 1) throw new Error(`There are no commands under the \`${category}\` category!`);
            const list = [];
            commands.map(cmd => {
                list.push(cmd.name);
            });
            const embed = new MessageEmbed({
                color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
                title: `List of ${category} commands`,
                description: list.join("\n"),
                footer: {
                    text: `For more info about a command run ${prefix}help <Command>`
                }
            });
            message.reply(embed);
        }else{
            const commands = bot.commands;
            const embed = new MessageEmbed({
                color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
                title: 'Help',
                footer: {
                    text: `Use ${prefix}help <Category> for more information`
                }
            });
            const categories = [];
            bot.categories = bot.categories.sort(function(c1,c2){
                return commands.filter(c => c.type === c2).array().length - commands.filter(c => c.type === c1).array().length;
            });
            bot.categories.forEach(function(category){
                const length = commands.filter(function(c){
                	if(c.guild && c.guild !== message.guild.id){
                	
                	}else{
                	if(c.type === category) return c;
                	};
                }).array().length;
                categories.push(`\`${category}\` [**${length}**]`);
            });
            embed.setDescription(categories.join("\n\n"));
            message.reply(embed);
        }
    }
};
