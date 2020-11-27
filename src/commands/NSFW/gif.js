const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'gif',
	description: 'Get a gif image',
	async execute(bot, message, args){
		const m = await message.reply("Finding an image...");
		const res = await axios.get(`https://nekobot.xyz/api/image?type=p${this.name}`);
		const url = res.data.message;
		const embed = new MessageEmbed({
			color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
			title: this.name
		})
		.setImage(url);
		m.edit("Image found!",embed);
	}
};