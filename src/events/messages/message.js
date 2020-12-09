const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const parse = require("parse-duration");
var { prefix, owners } = process.env;
owners = JSON.parse(owners);

module.exports = async (bot, message) => {
	if(message.webhookID || message.author.bot || !message.member) return;
    if(!message.content.startsWith(prefix)) return;
    if(db.get(`${message.author.id}.Bot_Blacklisted`)) return;
    var args = message.content.slice(prefix.length).split(" ");
    const cmd = args.shift().toLowerCase();
    const command = bot.commands.get(cmd) || bot.commands.find(c => c.aliases && c.aliases.includes(cmd));
    if(!command) return;
    const { member } = message;
    if(command.cooldown){
        var isOnCooldown = db.get(`${member.id}.cooldown.${command.name}`);
            if(isOnCooldown && Date.now() >= isOnCooldown){
                isOnCooldown = false;
                db.delete(`${member.id}.cooldown.${command.name}`);
            };
            if(isOnCooldown){
                var totalSeconds = ((isOnCooldown  - Date.now()) / 1000);
                var days = Math.floor(totalSeconds / 86400);
                totalSeconds %= 86400;
                var hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                var minutes = Math.floor(totalSeconds / 60);
                var seconds = Math.round(totalSeconds % 60);
                var timeLeft = `${days} day(s), ${hours} hour(s), ${minutes} minute(s) and ${seconds} second(s)`;
                return message.reply(`You can use that command again in: \`${timeLeft}\``);
            };
    };
    if(command.type === "NSFW" && !message.channel.nsfw) return message.reply("NSFW commands can only be ran in NSFW channels!");
    if(command.guild && message.guild.id !== command.guild) return;
    if((command.ownerOnly || command.type == "Owner") && !owners.includes(message.member.id)) return message.reply(new MessageEmbed({
        color: "ff5555",
        title: "This command is for my owners only!"
    }));
    if(command.permission){
        var hasPerm = bot.hasPermission(message.member,command.permission);
        if(hasPerm !== true) return message.reply(hasPerm);
    };
    if(command.arguments && command.arguments.required && args.length < command.arguments.required.length){
        const embed = new MessageEmbed({
            color: "ff5555",
            title: "Missing Argument(s)"
        });
        const missingArgs = [];
        command.arguments.required.forEach(function(argument, idx){
            if(!args[idx]) missingArgs.push(`\`${argument}\``);
        });
        embed.setDescription(`Missing the argument(s): ${missingArgs.join(', ')}`);

        return message.reply(embed);
    };
    try{
        command.execute(bot, message, args).then(() => {
            if(command.cooldown) db.set(`${member.id}.cooldown.${command.name}`,Date.now() + parse(command.cooldown));
        }).catch(e => {
            return message.reply(new MessageEmbed({
                color: "ff5555",
                title: "Error",
                description: e.message
            })).catch();
        })
    }catch (e){
        return message.reply(new MessageEmbed({
            color: "ff5555",
            title: "Error",
            description: e.message
        })).catch();
    };
};