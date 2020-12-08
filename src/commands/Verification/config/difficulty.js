const db = require('quick.db');

module.exports = {
    name: 'Difficulty',
    async execute(bot, message, args){
        const input = args.join(' ');
        const { guild } = message;
        if(isNaN(input) || Number(input) < 1 || Number(input) > 3) throw new Error('Invalid Number! Difficulty level must be between 1 and 3.');
        const diff = Number(input);
        db.set(`${guild.id}.difficulty`,diff);
        return message.reply(`Set the captcha difficulty to: **${diff}**`);
    }
}