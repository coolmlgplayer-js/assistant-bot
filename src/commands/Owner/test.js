module.exports = {
	name: 'test',
	description: 'test command',
	ownerOnly: true,
	async execute(bot, message, args){
		message.reply("Hi");
	}
};