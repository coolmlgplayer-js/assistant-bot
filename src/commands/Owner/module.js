///////////////////////////////////////////
////   Assistant Bot Module Manager    ////
////   By: Front                       ////
///////////////////////////////////////////

////    Commands    ////

//module install [module name] [github-username]/[repo-name] [branch-name]

////////////////////////

////    Requires / Imports ////
const discord = require("discord.js");
const request = require("request");
const fs = require("fs");
const unzipper = require("unzipper")
const { prefix } = process.env
///////////////////////////////

////    Restart Function    ////
function restart() {
    process.exit(1);
}

////    Embed Function    ////
function embed(title,description,message){
    return new discord.MessageEmbed({color: message.guild.me.roles.color ? message.guild.me.roles.color.hexColor : message.guild.me.roles.highest.hexColor, title: title, description: description})
}
//////////////////////////////

module.exports = {
    name: 'module',
    description: 'Manage 3rd party command repositories',
    ownerOnly: true,
    async execute(bot, message, args){
        ////    Get Subcommand    ////


        ////////    Install    ////////
        if (args[0].toLowerCase() == "install") {
            //  Check Args //
            if (args.length > 4) {message.channel.send(embed("Module Manager","Too many arguments",message)); return;}
            if (args.length < 4) {message.channel.send(embed("Module Manager","Not enough arguments",message)); return;}
            const repourl = `https://github.com/${args[2]}/archive/${args[3]}.zip`
            const modulename = args[1]
            message.channel.send(embed("Module Manager",`Attempting to install **${modulename}**\n${repourl}`,message))



            var output = "temp.zip";
                    request({
                        url: repourl,
                        encoding: null
                    }, function(err, resp, body) {
                        if (err) throw err;
                        fs.writeFile(output, body, function(err) {
                            console.log(`Module Handler:    Downloaded ${modulename}`);

                            //  Extract Repo  //
                            var stream = fs.createReadStream('temp.zip')
                                .pipe(unzipper.Extract({
                                    path: './src/unloaded/'
                                }));
                            stream.on("close", () => {
                                console.log(`Module Handler:    Extracted ${modulename}`);

                                fs.rename(`./src/unloaded/${args[2].split("/")[1]}-${args[3]}`, `./src/unloaded/${modulename}`, function(err) {
                                    if (err) {
                                      console.log(err)
                                      message.channel.send(embed(`Module Manager`,`Error Installing ${modulename}\n${repourl}\n${err}`,message));
                                    } else {
                                        console.log(`Module Handler:    Renamed ${modulename}`);
                                        message.channel.send(new discord.MessageEmbed({color: '#99ff99', title: `Module Manager`, description: `Successfully Installed **${modulename}**\nTo load this module, run **${prefix}module load ${modulename}**\n${repourl}`}));
                                        
                                    }
                                  })
                            })
                        })
                    });
    ////////    End Install    ////////







    ////////    Load    ////////
    } else if (args[0].toLowerCase() == "load") {
        //  Check Args //
        if (args.length > 2) {message.channel.send(embed("Module Manager","Too many arguments",message)); return;}
        if (args.length < 2) {message.channel.send(embed("Module Manager","Not enough arguments",message)); return;}
        //  Load  //
        const modulename = args[1]
        message.channel.send(embed("Module Manager",`Attempting to load **${modulename}**`,message))
        try {
            if (fs.existsSync(`./src/unloaded/${modulename}`)) {
                //  If Module Exists  //
                fs.rename(`./src/unloaded/${modulename}`, `./src/commands/${modulename}`, function(err) {
                    if (err) {
                      console.log(err)
                      message.channel.send(embed(`Module Manager`,`Error Loading ${modulename}\n${err}`,message));
                    } else {
                        console.log(`Module Handler:    Loaded ${modulename}`);
                        message.channel.send(new discord.MessageEmbed({color: '#99ff99', title: `Module Manager`, description: `Successfully Loaded **${modulename}**`})).then(restart());
                        
                    }
                  })

            } else {
                confirmed.edit(new discord.MessageEmbed({color: '#ff5555', title: `Module Manager`, description: `Error Loading **${modulename}**\nModule doesn't exist or is already loaded`}));
            }
            } catch(err) {
                message.channel.send(embed(`Module Manager`,`Error Loading ${modulename}\n${err}`,message));
        }
    ////////    End Load    ////////







    ////////    List    ////////
    } else if (args[0].toLowerCase() == "list") {
        const getDirectories = source =>
        fs.readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)

            message.channel.send(embed("Module Manager",`**Loaded:**\n${getDirectories('./src/commands')}\n\n**Unloaded:**\n${getDirectories('./src/unloaded')}`,message));
    ////////    End List    ////////




    ////////    Unload    ////////
    } else if (args[0].toLowerCase() == "unload") {
        //  Check Args //
        if (args.length > 2) {message.channel.send(embed("Module Manager","Too many arguments",message)); return;}
        if (args.length < 2) {message.channel.send(embed("Module Manager","Not enough arguments",message)); return;}
        //  Load  //
        const modulename = args[1]
        message.channel.send(embed("Module Manager",`Attempting to unload **${modulename}**`,message))
        
        if (modulename != "Owner") {
            try {
                if (fs.existsSync(`./src/commands/${modulename}`)) {
                    //  If Module Exists  //
                    fs.rename(`./src/commands/${modulename}`, `./src/unloaded/${modulename}`, function(err) {
                        if (err) {
                        console.log(err)
                        message.channel.send(embed(`Module Manager`,`Error Unloading ${modulename}\n${err}`,message));
                        } else {
                            message.channel.send(new discord.MessageEmbed({color: '#99ff99', title: `Module Manager`, description: `Successfully Unloaded **${modulename}**`}));
                            console.log(`Module Handler:    Unloaded ${modulename}`);
                            restart();
                            
                        }
                    })

                } else {
                    message.channel.send(new discord.MessageEmbed({color: '#ff5555', title: `Module Manager`, description: `Error Unloading **${modulename}**\nModule doesn't exist or isn't loaded`}));
                }
                } catch(err) {
                    message.channel.send(embed(`Module Manager`,`Error Unloading ${modulename}\n${err}`,message));
            }
        } else {
            message.channel.send(embed(`Module Manager`,`Error Unloading ${modulename}\nThe Owner module cannot be unloaded.`,message));
        }
    ////////    End Unload    ////////






















        } else if (args[0].toLowerCase() == "remove") {
            //  Check Args //
            if (args.length > 2) {message.channel.send(embed("Module Installer","Too many arguments",message)); return;}
            if (args.length < 2) {message.channel.send(embed("Module Installer","Not enough arguments",message)); return;}
            //  Uninstall  //
            message.channel.send(embed("Module Manager","If you wish to remove an installed module, remove the folder via FTP or SSH.",message))
        }
    }
};