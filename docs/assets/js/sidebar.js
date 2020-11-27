function newpage(title,link) { 
  const text = document.createElement("a"); 
  text.href = link
  text.innerHTML = title

  const currentDiv = document.getElementById("documents"); 
  currentDiv.after(text,); 
}

newpage("Installing","install.html")