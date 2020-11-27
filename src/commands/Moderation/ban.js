const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban a member',
    arguments: {
        required: ['User'],
        optional: ['Reason']
    },
    permission: 'Ban Members',
    async execute(bot, message, args){
        const { User } = bot;
        const { member } = message;
        var user = User(args.shift(),message.guild)[0];
        var reason = args.join(" ");
        if(reason.length < 1) reason = `Banned by: ${member.user.tag}`;
        if(!user) throw new Error("Invalid User");
        user = message.guild.member(user);
        if(user.roles.highest.position >= member.roles.highest.position) throw new Error("You cannot ban that member!");
        if(!user.bannable) throw new Error(`I cannot ban that member!`);
        user.ban({reason: reason}).then(() => {
            message.channel.send(`Banned: ${user.user.tag}`);
        }).catch(e => {
            throw e;
        });
    }
};