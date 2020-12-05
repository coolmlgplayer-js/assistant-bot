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
        return Math.floor(diff / periods.week) + " week" + (Math.floor(diff / periods.week) > 1 ? 's' : '') + " ago";
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
  name: 'serverinfo',
  aliases: ['sinfo'],
  description: 'Get information about the server',
  async execute(bot, message, args){
   const { name, ownerID, createdTimestamp, id, memberCount, premiumTier, premiumSubscriptionCount, roles, channels, me } = message.guild;
    const embed = new MessageEmbed({
      color: me.roles.color ? me.roles.color.hexColor : me.roles.highest.hexColor,
      title: `**${name}**`,
      thumbnail: {
        url: message.guild.iconURL({dynamic: true, format: 'png'})
      },
      footer: {
        text: `ID | ${id}` 
      }
    })
    .addField('**Created**', formatTime(createdTimestamp))
    .addField('**Owner**',(await bot.UserFromID(ownerID)).toString())
    .addField('**Member Count**',memberCount)
    .addField('**Boosts**',`${premiumSubscriptionCount} (Tier ${premiumTier})`)
    .addField('**Number of roles**', roles.cache.size - 1) //Take one off because of @everyone
    .addField('**Channels**',`Category Channels: ${channels.cache.filter(c => c.type ==='category').size}\nText Channels: ${channels.cache.filter(c => c.type ==='text' || c.type === 'news').size}\nVoice Channels: ${channels.cache.filter(c => c.type ==='voice').size}`);
    return message.reply(embed);
  }
};