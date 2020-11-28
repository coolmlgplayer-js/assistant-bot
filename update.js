const axios = require("axios");
const readline = require('readline');
const fs = require("fs");
const path = require("path");

const getAllFiles = function(dirPath, arrayOfFiles) {
if(dirPath.includes("node_modules/") || dirPath.includes(".npm/") || dirPath.includes(".cache/") || dirPath.includes(".config/")) return arrayOfFiles;
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

var result = getAllFiles("./");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUpdate(){
    const updated = [];
    var available = true;
  rl.question('Would you like to update? Y/N ', async (answer) => {
    answer = answer.toLowerCase() || answer;
    if(answer !== "n" && answer !=="y") return promptUpdate(true);
    if(answer == "n"){
        console.log("Update Denied.");
        return process.exit();
    };
    var checked = 0;
    var checkTotal = setInterval(() => {
	if(checked === result.length){
	    console.log("Done!");
	    if(updated.length > 0) console.log(`Updated files:\n${updated.join("\n")}`);
	    process.exit();
	};
    },500);
    console.log("Updating...");
    result.forEach(async function(path,idx){
        let interval = setInterval(async () => {
            if(!available) return;
	    available = false;
	    let res;
	    try{
            res = await axios.get(`https://raw.githubusercontent.com/coolmlgplayer-js/assistant-bot/main/${path}`).catch();
	    }catch{
		checked++;
		available = true;
		clearInterval(interval);
                return;
	    }
            if(!res.data || typeof res.data !== "string" || res.data === "404: Not Found"){
		checked++;                
		available = true;
		clearInterval(interval);
                return;
            };
            var current = fs.readFileSync("./" + path,{encoding:'utf8'});
            if(current == res.data){
		console.log(`${path} is up to date!`);
		checked++;
                available = true;
		clearInterval(interval);
                return;
            };
            console.log(`Updating ${path}...`);
            fs.writeFileSync(`${path}`,res.data);
            console.log(`${path} has been updated!`);
	    updated.push(path);
	    checked++;
            available = true;
	    clearInterval(interval);
        },500);
    });
  });
};

promptUpdate();
