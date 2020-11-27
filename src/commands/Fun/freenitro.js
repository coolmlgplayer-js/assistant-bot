const { MessageEmbed } = require("discord.js");
//Link generator
function randomNitro() {
var length = 16;
var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return "https://discord.gift/" + result;
};

module.exports = {
	name: 'freenitro',
	description: 'Generate a Nitro link',
	async execute(bot, message, args){
        const url = randomNitro();
        //Create the embed base
		const embed = new MessageEmbed({
			color: "ff99ff",
			title: "Nitro Links",
			footer: {
				text: "Nitro Generator | 0.05% chance of working"
			}
        });
        //Add URLs to the embed
		const arr = [];
		for(var i = 0; i < 20; i++){
			arr.push(randomNitro());
		};
		embed.title+= ` (**${arr.length}**)`;
        embed.setDescription(arr.join("\n"));
        //Send the embed to the user
		return message.author.send(embed).then( () => {
			message.reply("Check DMs");
		}).catch( () => {
			message.reply("I couldn't DM you!");
		});
	}
};