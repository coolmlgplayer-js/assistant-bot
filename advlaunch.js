////////////////////////////////////
////   Assistant Bot Updater    ////
////   By: Front        V1.0    ////
////   MLG helped with the hard shit
////////////////////////////////////

console.log("Update Checker:   Checking for updates.")

////    Variables    ////
const repo = "https://github.com/coolmlgplayer-js/assistant-bot/archive/main.zip"
const updateurl = "https://raw.githubusercontent.com/coolmlgplayer-js/assistant-bot/main/api/latest.txt"
/////////////////////////


////    Required Packages    ////
const request = require('request');
const unzipper = require('unzipper');
const path = require("path");
const fs = require('fs')
const { version } = require('./src/information/version.json');
const readline = require('readline');
/////////////////////////////////

////    Setup Readline    ////
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
/////////////////////////////////

////    Start Bot Function    ////
function startbot() {
    require('dotenv').config();
    require("./src/bot");
}
//////////////////////////////////

////    Recursive Folder Shits    ////
function writeFileSyncRecursive(filename, content, charset) {
  const folders = filename.split(path.sep).slice(0, -1)
  if (folders.length) {
    // create folder path if it doesn't exist
    folders.reduce((last, folder) => {
      const folderPath = last ? last + path.sep + folder : folder
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
      }
      return folderPath
    })
  }
  fs.writeFileSync(filename, content, charset)
}
//////////////////////////////////////



////    Get Latest Version    ////
request(updateurl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
    const cloudversion = body;
    console.log(`Update Checker:   Running: ${version} - Latest: ${cloudversion}`)
    ////    See if shit needs to be updated    ////
    if (Number(version) < Number(cloudversion)) {
        ////    Update Required    ////
        console.log("Update Checker:   An update is available.")
        console.log("Update Checker:   Warning:   If you proceed, any changes to default commands will be overwritten.")
        rl.question('Update Checker:   Would you like to update? [y/N] ', async (answer) => {
            if (answer.toLowerCase() == "y") {
                ////    Update Confirmed    ////
                
                //  Download Repo  //
                console.log("Update Checker:   Downloading Update.")
                var output = "temp.zip";
                request({url: repo, encoding: null}, function(err, resp, body) {
                    if(err) throw err;
                    fs.writeFile(output, body, function(err) {
                        console.log("Update Checker:   Update Downloaded.");

                        //  Extract Repo  //
                        console.log("Update Checker:   Extracting Update.")
                       var stream = fs.createReadStream('temp.zip')
                            .pipe(unzipper.Extract({ path: './temp' }));
													stream.on("close", () => {	
                        console.log("Update Checker:   Update Extracted.")




                        //  Apply Updates  //
                        console.log("Update Checker:   Applying Update.")

                        const getAllFiles = function(dirPath, arrayOfFiles) {
                            files = fs.readdirSync(dirPath)
                            arrayOfFiles = arrayOfFiles || []
                            files.forEach(function(file) {
                              if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
                              } else {
                                let thing = path.join(dirPath, "/", file);
                                arrayOfFiles.push(thing)
                              }
                            })
                            return arrayOfFiles
                          }

                        //  Apply Updates  //
                        var files = getAllFiles("./temp");
                        var checked = 0;
                        files.forEach(function(file){
												checked++;
                        var fileName = file.slice(24);
                        if(fileName == ".env.example" || fileName.startsWith("docs"))
                        writeFileSyncRecursive(`./${fileName}`,fs.readFileSync(file,{encoding:'utf8'}));
												});
												var interval = setInterval(() => {
													if(checked < files.length) return;
													clearInterval(interval)
												
                        //  When Updates Applied...  //
                       
                        console.log("Update Checker:   Updates Applied.")
                        console.log("Update Checker:   Cleaning Up Files.");
                        //  Cleanup Temp Folder  //
                        fs.rmdir('./temp', { recursive: true }, (err) => {
                            if (err) {
                                res.send(err);
                                throw err;
                            } else {
                                //  If Everything Is Peachy  //
                                fs.unlink("./temp.zip",(err) => {
                                    if(err) console.log("failed to remove temp.zip");
                                });
                                console.log("Update Checker:   Cleanup Complete.");
                                console.log("Update Checker:   Starting bot.");
                                //Start Bot
                                startbot();
                            }
                        })






						},500);
						});
                    });
					});

                



            } else {
                ////    Update Denied    ////
                console.log("Update Checker:   Update denied.")
                console.log("Update Checker:   Starting bot.")
                //Start Bot
                startbot()
            }
        })
    } else if (Number(version) > Number(cloudversion)) {
        ////    Dev / No Update    ////
        console.log("Update Checker:   You're running a development version! Good luck!")
    } else if (Number(version) == Number(cloudversion)) {
        ////    Latest    ////
        console.log("Update Checker:   You're running the latest version!")
        console.log("Update Checker:   Starting bot.")
        //Start Bot
        startbot()
    } else {
        ////    Welp. Something's fucked.    ////
        console.log("Update Checker:   Failed to check for updates.")
        console.log("Update Checker:   Attempting to start bot.")
        //Start Bot
        startbot()
    }
    ////    Log If Shit Breaks    ////
    } else {
      console.log(error)
    }
})