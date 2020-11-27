module.exports = (bot, msg) => {
	if(msg.author.bot || msg.webhookID) return;
	if(!msg.guild) return;
	bot.snipemsg[`${msg.channel.id}_${msg.author.id}`] = msg;
	bot.snipemsg[msg.channel.id] = msg;
};