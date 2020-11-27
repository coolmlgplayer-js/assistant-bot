const fs = require("fs");
const db = require("quick.db");
function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
};

module.exports = bot => {
var commandDirs = getDirectories("./src/commands");
for(var commandDir of commandDirs){
bot.categories.push(commandDir);
const commandFiles = fs.readdirSync(`./src/commands/${commandDir}`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`../commands/${commandDir}/${file}`);
	command.type = commandDir;
	bot.commands.set(command.name, command);
};
};
};