const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick a member',
    arguments: {
        required: ['Member'],
        optional: ['Reason']
    },
    permission: 'Kick Members',
    async execute(bot, message, args){
        const { User } = bot;
        const { member } = message;
        var user = User(args.shift(),message.guild)[0];
        var reason = args.join(" ");
        if(reason.length < 1) reason = `Kicked by: ${member.user.tag}`;
        if(!user) throw new Error("Invalid User");
        user = message.guild.member(user);
        if((member.id !== member.guild.ownerID) && user.roles.highest.position >= member.roles.highest.position) throw new Error("You cannot kick that member!");
        if(!user.kickable) throw new Error(`I cannot kick that member!`);
        user.kick(reason).then(() => {
            message.channel.send(`Kicked: ${user.user.tag}`);
        }).catch(e => {
            throw e;
        });
    }
};
