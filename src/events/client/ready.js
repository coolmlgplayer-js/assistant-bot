const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const { prefix } = process.env;

module.exports = bot => {
bot.user.setActivity(`${prefix}help`,{type: 'LISTENING'});
    console.log(`Hi, ${bot.user.tag}`);
    var restart_thing = db.get("restart_thing");
    if(restart_thing){
        const channel = bot.channels.cache.get(restart_thing.channel);
        channel.messages.fetch(restart_thing.msg).then(m => {
            m.edit(new MessageEmbed({
                color: "99ff99",
                title: "System",
                description: "Successfully restarted!"
            })).catch();
            db.delete("restart_thing");
        }).catch(() => {
            db.delete("restart_thing");
        });
    };
    bot.guilds.cache.map(guild => {
        guild.members.fetch().catch(() => {
            console.log(`${guild.name}: Error fetching members!`);	
        });
    });
};