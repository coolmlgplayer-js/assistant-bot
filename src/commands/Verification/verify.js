const { MessageEmbed, MessageAttachment } = require("discord.js");
const db = require("quick.db");
const gm = require("gm");
const fs = require("fs");
const { prefix } = process.env;
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function sendCaptcha(member,message) {
    let diffLevel = db.get(`${member.guild.id}.difficulty`) || 1;
    let channelId = db.get(`${member.guild.id}.channel`);
    if(channelId && typeof channelId !== "string") channelId = channelId.id;
    const captchaKey = makeid(5);
    const randomColor = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    var captcha = gm(150, 50, randomColor)
    captcha.font("./src/fonts/charlotte.ttf")
    captcha.fontSize(36)
    captcha.fill(invertColor(randomColor))
    captcha.drawText(0, 0, captchaKey, 'Center')
    captcha.swirl(randomInteger(10,10 + (diffLevel * 5)));
    for (let i = 0; i < (2 + diffLevel); i++) {
        captcha.stroke('#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'), 1)
        captcha.fill('#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'))
        captcha.drawLine(Math.floor(Math.random() * 150), Math.floor(Math.random() * 50), Math.floor(Math.random() * 150), Math.floor(Math.random() * 50))
    }
    for (let i = 0; i < 200; i++) {
        captcha.fill('#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'))
        captcha.drawPoint(Math.floor(Math.random() * 150), Math.floor(Math.random() * 50))
    }
    captcha.write(`./src/temp/${member.guild.id}_${member.id}_captcha.png`, function(err) {
        if (err === undefined) {
            const captchaAttachment = new MessageAttachment(`./src/temp/${member.guild.id}_${member.id}_captcha.png`)
            const captchaEmbed = new MessageEmbed()
                .setTitle("Captcha Verification")
                .setImage(`attachment://${member.guild.id}_${member.id}_captcha.png`)
                .setFooter(`You have 2 minutes to complete the captcha`)
                .setColor('99ff99')
                .setTimestamp()
            member.user.send({files: [captchaAttachment], embed: captchaEmbed}).catch((err) => {
                message.reply("I couldn't DM you. Please enable DMs!");
            }).then((msg) => { 
            	  message.reply("Check DMs!");
                let attempts = 3;
                fs.unlinkSync(`./src/temp/${member.guild.id}_${member.id}_captcha.png`);
                const collector = msg.channel.createMessageCollector(m => {
                    return m.author.id == member.id}, { time: 120000, max: attempts});

                collector.on("collect", async m => {
                    attempts--;
                    if (m.content !== captchaKey && attempts !== 0) {
                        member.user.send(`**Attempt failed**. You have ${attempts} attempts left.`)
                    }
                    else if (m.content !== captchaKey && attempts === 0) {
                        member.user.send(`**Captcha failed**. Get a new captcha by typing \`${prefix}verify\` in <#${channelId}>;`)
                    }
                    else
                    {
                        collector.stop();
                        let roleId = db.get(`${member.guild.id}.role`);
                        if(roleId && roleId.id) roleId = roleId.id;
                        if (!member.roles.cache.has(roleId)) { 
                            member.roles.add(roleId);
                        }
                        
                        let welcomeDescription = db.get(`${member.guild.id}.description`) || `Welcome to **${member.guild.name}**!`

                        const successVerified = new MessageEmbed()
                            .setAuthor(`Verification Successful!`)
                            .setDescription(welcomeDescription)
                            .setFooter(`Verification`)
                            .setTimestamp()
                        
                        member.user.send(successVerified)
                    }
                }); 

                collector.on("end", (_, reason) => {
                    if(["time"].includes(reason.toLowerCase())) return member.user.send(`Time to complete captcha has expired! Type \`${prefix}verify\` in the verify channel to retry.`)
                });
            })
        }
        else
        {
            member.user.send("An unknown error has occured. Contact the bot owner for help if possible");
            console.error(err);
        }
    });
}

module.exports = {
    name: 'verify',
    description: 'Verify using a captcha',
    async execute(bot, message, args){
        const guildData = db.get(message.guild.id);
        if(!guildData || !guildData.role || !guildData.channel) throw new Error(`**${message.guild.name}** is not setup! Run ${prefix}vconfig to set it up.`);
        const { member } = message;
        let roleId = db.get(`${member.guild.id}.role`);
        if(roleId) roleId = roleId.id || roleId;
        if(roleId && member.roles.cache.has(roleId)) throw new Error("You are already verified!");
        sendCaptcha(member,message);
    }
};