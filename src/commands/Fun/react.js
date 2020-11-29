module.exports = {
    name: 'react',
    description: 'Add a reaction to a message',
    arguments: {
        required: ['Reaction'],
        optional: ['Message ID']
    },
    async execute(bot, message, args){
        var reaction = args.shift();
        var msgID = message.id;
        if(args[0]) msgID = args.join(" ");
        const m = await message.channel.messages.fetch(msgID).catch(() => {
            throw new Error("Invalid Message ID!");
        });
        try{
            m.react(bot.emojis.cache.some(e => e.id === reaction || e.name === reaction || e.toString() === reaction) ? bot.emojis.cache.find(e => e.id === reaction || e.name === reaction || e.toString() === reaction) : reaction);
        }catch(e){
            throw e;
        };
    }
};