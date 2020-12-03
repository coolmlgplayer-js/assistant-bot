const db = require('quick.db');
const fs = require('fs');
const { MessageEmbed, Collection } = require('discord.js');
const currency = process.env.currency || 'KoolKoins';
const defaultAmount = process.env.defaultAmount || 2500;
const parse = require("parse-duration");

const jobs = new Collection();
function addJob(name, minEarn, maxEarn, output, timeOut){
    jobs.set(name, {
        name: name,
        minEarn: minEarn,
        maxEarn: maxEarn,
        timeOut: timeOut ? timeOut : '1s',
        output: output.split('{currency}').join(currency)
    });
};

const files = fs.readdirSync(`${__dirname}/jobs`).filter(x => x.endsWith('.js'));
for(var job of files){
    job = require(`./jobs/${job}`);
    addJob(job.name,job.minEarn,job.maxEarn,job.output,job.timeOut);
};

module.exports = {
    name: 'work',
    arguments: {
        optional: ['Job']
    },
    description: `Work for some ${currency}`,
    async execute(bot, message, args){
        if(args.length > 0){
            const job = jobs.get(args.join(' '));
            const { member } = message;
            if(!job) throw new Error('Invalid Job!');
            if(!db.has(`${member.id}.economy.wallet`)) db.set(`${member.id}.economy.wallet`,defaultAmount);
            if(!db.has(`${member.id}.economy.bank`)) db.set(`${member.id}.economy.bank`,0);
            var hasAlreadyWorked = db.get(`${member.id}.economy.${job.name}`);
            if(hasAlreadyWorked && Date.now() >= hasAlreadyWorked){
                hasAlreadyWorked = false;
                db.delete(`${member.id}.economy.${job.name}`);
            };
            if(hasAlreadyWorked){
                var totalSeconds = ((hasAlreadyWorked  - Date.now()) / 1000);
                var days = Math.floor(totalSeconds / 86400);
                totalSeconds %= 86400;
                var hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                var minutes = Math.floor(totalSeconds / 60);
                var seconds = Math.round(totalSeconds % 60);
                var timeLeft = `${days} day(s), ${hours} hour(s), ${minutes} minute(s) and ${seconds} second(s)`;
                return message.reply(`You can work that job again in: \`${timeLeft}\``);
            }
            const earned = Math.floor(Math.random() * (job.maxEarn - job.minEarn + 1)) + job.minEarn;
            db.add(`${member.id}.economy.wallet`,earned);
            db.set(`${member.id}.economy.${job.name}`,Date.now() + parse(job.timeOut));
            return message.reply(job.output.split('{coins}').join(earned.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')));
        }else{
            const arr = [];
            jobs.map(job => arr.push(job.name));
            const embed = new MessageEmbed({
                color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor,
                title: `**List of Jobs** (**${jobs.size}**)`,
                description: arr.join('\n')
            });
            return message.reply(embed);
        }
    }
};