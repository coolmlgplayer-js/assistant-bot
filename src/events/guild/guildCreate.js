module.exports = (bot, guild) => {
	guild.members.fetch().catch(() => {
		console.log(`${guild.name}: Error fetching members!`);	
	});
};
