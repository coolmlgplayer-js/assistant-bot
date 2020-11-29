const parse = require("parse-duration");

module.exports = {
    name: 'slowmode',
    aliases: ['sm'],
    arguments: {
        required: ['Time']
    },
    permission: 'Manage Channels',
    async execute(bot, message, args){
        const { channel, member } = message;
        var time = args.join(" ");
        time = parse(time);
        if(!time) throw new Error("Invalid time supplied");
        time = time / 1000;
        channel.setRateLimitPerUser(time, `Slowmode command ran by: ${member.user.tag}`).then(() => {
            message.channel.send(`Slowmode set to ${args.join(" ")}`);
        }).catch(e => {
            throw e;
        })
    }
};