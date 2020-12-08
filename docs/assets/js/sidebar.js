function newpage(title,link) { 
  const text = document.createElement("a"); 
  text.href = link;

  text.innerHTML = title

  const currentDiv = document.getElementById("documents"); 
  currentDiv.after(text,); 
}
newpage("Discord Server","https://discord.gg/RWn6Z9aVGj")
newpage("Creating Commands","creatingcommands")
newpage("Installing","install")
newpage("Invite","https://discord.com/api/oauth2/authorize?client_id=772445792182992946&permissions=27670&scope=bot");
