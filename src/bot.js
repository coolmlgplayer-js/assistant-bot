const { Client, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs');
const bot = new Client();
var { token, owners, prefix } = process.env;
owners = JSON.parse(owners);
bot.commands = new Collection();
bot.shop = new Collection();
bot.categories = [];
bot.snipemsg = {};

bot.UserFromID = async function(i){
	var toReturn = undefined;
	try{
	toReturn = await bot.users.fetch(i).catch();
	}catch{
	toReturn = undefined;
	};
	return toReturn;
};
bot.User = function(i,guild){
    if(i.startsWith("<@") && i.endsWith(">")){
        i = i.slice(2,-1);
        if(i.startsWith("!")) i = i.slice(1);
    };
    var arr = [];
    i = i.toLowerCase();
    arr = bot.users.cache.filter(u => (u.id === i || u.tag.toLowerCase().startsWith(i)) && guild.member(u)).array();
    if(i === "all") arr = bot.users.cache.filter(u => guild.member(u)).array();
    if(i === "bots") arr = bot.users.cache.filter(u => u.bot && guild.member(u)).array();
    if(i === "humans") arr = bot.users.cache.filter(u => !u.bot && guild.member(u)).array();
    return arr;
};


bot.hasPermission = function(member,permission){
	if(member.id === member.guild.ownerID) return true;
	var bitPerm = "no";
        try{
            bitPerm = member.hasPermission((typeof permission === "string") ? permission.split(" ").join("_").toUpperCase() : permission);
        }catch{
            bitPerm = "no";
        };
        if(bitPerm !== "no" && !bitPerm) return new MessageEmbed({
            color: "ff5555",
            title: "Missing Permission",
            description: `You are missing the \`${permission}\` permission!`
        });
        if(!member.hasPermission('MANAGE_GUILD') && !member.roles.cache.some(r => r.name === permission)) return new MessageEmbed({
            color: "ff5555",
            title: "Missing Role",
            description: `You are missing the \`${permission}\` role!`
        });
        return true;
};

fs.readdirSync('./src/handlers').forEach(x => require(`./handlers/${x}`)(bot));

bot.login(token);
