const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'avatar',
    aliases: ['av'],
    description: 'Get a users avatar',
	arguments: {
		optional: ['User']
	},
	async execute(bot, message, args){
		const { User, UserFromID } = bot;
    var id= args.slice(0).join(' ');
    if (message.mentions.members.first()){
    id=message.mentions.members.first().id;
    };
    if(!id.length || id.length < 1) id = message.author.id; 
    var user = User(id,message.guild)[0];

    
    if(!user) user = await UserFromID(id);
    
if(user == undefined) throw new Error("Invalid User");
    var avatarURL = user.displayAvatarURL({dynamic: true,format: "png",size: 256});
    const embed = new MessageEmbed()
    .setAuthor(user.tag,avatarURL)
    .setTitle("Avatar")
    .setColor(message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor)
    .setImage(avatarURL);
    message.channel.send(embed);
}
};