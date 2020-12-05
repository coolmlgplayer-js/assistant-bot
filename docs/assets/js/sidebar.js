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
