const fs = require("fs");
function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
};

module.exports = (bot) => {
    const load = dirs => {    
        const events = fs.readdirSync(`./src/events/${dirs}/`).filter(d => d.endsWith('.js'));
        for (let file of events) {
            const evt = require(`../events/${dirs}/${file}`);
            let eName = file.split('.')[0];
            bot.on(eName, evt.bind(null, bot));
          };
        };
        for(const dir of getDirectories('./src/events')){
        	load(dir);
        };
}
