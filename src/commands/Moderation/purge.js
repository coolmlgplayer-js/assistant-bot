const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'purge',
    description: 'Purge some messages',
    arguments: {
        required: ['Number']
    },
    permission: 'Manage Messages',
    async execute(bot, m, args){
        let e = args.join(" ");
        if(isNaN(e) || parseInt(e) < 1) throw new Error("Invalid number provided!");
        e = parseInt(e);
        if (e > 100) throw new Error("Cannot purge more than 100 messages at a time");
        m.delete();
        
        setTimeout(async ()=>{
        let msgs = await m.channel.messages.fetch({
        limit: e
        });
        m.channel.bulkDelete(msgs).then((msgs)=>{
        
        const embed = new MessageEmbed()
        .setColor("00ff99")
        .setTitle("Success")
        .setDescription(m.author.toString() + " successfully purged " + e + " messages.");
        return m.channel.send(embed).then((msg)=>{
        setTimeout(()=>{
        msg.delete().catch();
        },4000);
        });
        
        }).catch((e)=>{
        throw e;
        });
        },500); 
    }
};