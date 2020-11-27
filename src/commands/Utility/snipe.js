const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'snipe',
	description: 'Get the latest deleted message in the channel or a members latest one in the channel',
	arguments: {
		optional: ['Member']
	},
	async execute(bot, message, args){
	const { snipemsg, User } = bot;
		let m = message.member;
        
        let id= args[0] || "latest";
        if (message.mentions.members.first()){
        id=message.mentions.members.first().id;
        };
        
        let usr = User(id,message.guild)[0];
        
        if(!usr && id!=="" && id!=="latest") return message.reply("invalid user");
        if(id!=="" && id!=="latest"){
        id = usr.id
        };
        if (id !== "latest" && id !==""){
        if (!snipemsg[message.channel.id + id]){
        return message.reply("No Message Found");
        };
        };
        let messag = snipemsg[message.channel.id + id];
        if(!id || id == "latest"){
        messag = snipemsg[message.channel.id];
        };
        if(!messag){
        return message.reply("No Message Found");
        };
        let attachments = "";
        let num = 1;
        messag.attachments.map((a)=>{
        attachments = attachments + "[" + a.name +"](" + a.proxyURL + ")" +"\n";
        num = num + 1
        });
        if (attachments==""){
        attachments="None";
        };
        let content = messag.content;
        if(!messag.content || messag.content == ""){
        content = "**No Message**";
        };
        let avatarURL = messag.author.displayAvatarURL({dynamic: true,format: "png"});
        const embed = new MessageEmbed()
        .setColor(messag.member.roles.color ? messag.member.roles.color.hexColor : messag.member.roles.highest.hexColor)
        .setTitle(messag.member.displayName.bold() + " (" + messag.author.tag.bold() + ")")
        .setThumbnail(avatarURL)
        .setDescription("**Message**: " + content + "\n**Attachments**: "+ attachments)
        .addField("Message ID: ",messag.id)
        .setFooter("Author: " + messag.author.id)
        .setTimestamp(messag.createdAt)
        return message.reply(embed);
	}
};