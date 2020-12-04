const { MessageEmbed } = require('discord.js');

var periods = {
    year: 12 * 30 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000
};
  
  function formatTime(timeCreated) {
    var diff = Date.now() - timeCreated;
    if (diff > periods.year) {
        return Math.floor(diff / periods.year) + " year" + (Math.floor(diff / periods.year) > 1 ? 's' : '') + " ago";
    } else if (diff > periods.month) {
      return Math.floor(diff / periods.month) + " month" + (Math.floor(diff / periods.month) > 1 ? 's' : '') + " ago";
    } else if (diff > periods.week) {
        return Math.floor(diff / periods.week) + " weeks" + (Math.floor(diff / periods.week) > 1 ? 's' : '') + " ago";
    } else if (diff > periods.day) {
        return Math.floor(diff / periods.day) + " day" + (Math.floor(diff / periods.day) > 1 ? 's' : '') + " ago";
    } else if (diff > periods.hour) {
        return Math.floor(diff / periods.hour) + " hour" + (Math.floor(diff / periods.hour) > 1 ? 's' : '') + " ago";
    } else if (diff > periods.minute) {
        return Math.floor(diff / periods.minute) + " minute" + (Math.floor(diff / periods.minute) > 1 ? 's' : '') + " ago";
    }
    return "Just now";
};

module.exports = {
    name: 'info',
    description: 'Get info about a user or yourself',
    aliases: ['userinfo','whois'],
    arguments: {
        optional: ['User']
    },
    async execute(bot, message, args){
        const { User, UserFromID } = bot;
        var user = message.author;
        if(args.length > 0){
            user = User(args.join(' '),message.guild)[0];
            if(!user) user = await UserFromID(args.join(' '));
            if(!user) throw new Error('Invalid User!');
        };
        const flagsArr = [];
        const flags = (await user.fetchFlags()).toArray();
        flags.forEach(function(flag){
            flag = flag.replace("HOUSE_BRAVERY","HypeSquad Bravery").replace("HOUSE_BRILLIANCE","HypeSquad Brilliance").replace("HOUSE_BALANCE","HypeSquad Balance");
            flagsArr.push(flag);
        });
        if(flagsArr.length < 1) flagsArr.push('None');
        const embed = new MessageEmbed({
            color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
            author: {
                name: user.tag,
                icon_url: user.displayAvatarURL({dynamic: true, format: 'png'})
            },
            thumbnail: {
                url: user.displayAvatarURL({dynamic: true, format: 'png'})
            },
            footer: {
                text: `ID | ${user.id}`
            }
        })
        .addField('**Registered**', formatTime(user.createdTimestamp), true);
        if(message.guild.member(user)) embed.addField('**Joined**',formatTime(message.guild.member(user).joinedTimestamp));
        embed.addField('**Flags**',flagsArr.join('\n'));
        
        return message.reply(embed);

    }
};