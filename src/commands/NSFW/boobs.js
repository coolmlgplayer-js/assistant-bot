const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'boobs',
	description: 'Get a boobs image',
	async execute(bot, message, args){
		const m = await message.reply("Finding an image...");
		const res = await axios.get(`https://nekobot.xyz/api/image?type=${this.name}`);
		const url = res.data.message;
		const embed = new MessageEmbed({
			color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
			title: this.name
		})
		.setImage(url);
		m.edit("Image found!",embed);
	}
};