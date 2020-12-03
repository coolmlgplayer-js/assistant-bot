const fs = require("fs");


module.exports = bot => {
    const files = fs.readdirSync('./src/shop');
    for (const file of files){
        const item = require(`../shop/${file}`);
        bot.shop.set(item.name, item);
    };
};