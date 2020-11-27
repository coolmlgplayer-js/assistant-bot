module.exports = {
    name: 'say',
    description: 'Make me say something',
    arguments: {
        required: ['Text']
    },
    async execute(bot, message, args) {
        //define the text to be sent
        var text = args.join(" ");
        //Counter role pings
        message.guild.roles.cache.map(r => {
            text = text.split(r.toString()).join(`@${r.name}`)
        });
        //Send the message and disable @here and @everyone pings
      message.channel.send(`${text}\n\n\`(Repeated After: \`${message.author.toString()}\`)\``,{
            disableMentions: 'everyone'
        });
    }
};