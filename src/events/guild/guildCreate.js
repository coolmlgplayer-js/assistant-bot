module.exports = (bot, guild) => {
	console.log(`New Guild: ${guild.name}`);
	guild.members.fetch().then(members => {
		console.log(`${guild.name}: Fetched ${members.size} members!`);
	}).catch(() => {
		console.log(`${guild.name}: Error fetching members!`);	
	});
};
