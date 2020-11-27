const { MessageEmbed } = require("discord.js");
const { prefix } = process.env;
module.exports = {
    name: 'help',
    description: 'The help command :p',
    arguments: {
        optional: ['Category']
    },
    async execute(bot, message, args){
        if(args.length > 0){
            var category = args.join(" ");
            category = bot.categories.find(c => c.toLowerCase() === category.toLowerCase())
            if(typeof category != "string") throw new Error(`Invalid Category! For a list of categories run \`${prefix}help\``);
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
                    text: `For more info about a command run ${prefix}info <Command>`
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