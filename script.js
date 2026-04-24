const output = document.getElementById("output");
let files=[];   
function createNode(node) {
  const element = document.createElement("div");

  if (node.type === "folder"){
    element.classList.add("folder");
    const header=document.createElement("div");
    header.classList.add("folder-header");
    header.textContent = "📁" + node.name;
     element.appendChild(header);
    // let head=header.textContent;
    // files.push(head);
      const childrenContainer = document.createElement("div");
      childrenContainer.classList.add("children","hidden");
      if (node.children) {
      node.children.forEach(child => {
        childrenContainer.appendChild(createNode(child));
      });
    }
    element.appendChild(childrenContainer);
    
    header.addEventListener("click", () =>{
      childrenContainer.classList.toggle("hidden");
      if(childrenContainer.classList.contains("hidden")){
        header.textContent = "\u2193" + "📁" + node.name;
      }
      else{
        header.textContent = "\u2191" + "📁" + node.name;
      }
    });
  } 
  else {
    element.classList.add("file");
    element.textContent = "📄" + node.name;
    // let elem=element.textContent;
    // files.push(elem);
  }
  return element;
}
function generateTree(){
  const input = document.getElementById("jsonInput").value;
  output.innerHTML = "";
  try{
  const data = JSON.parse(input);
  const tree = createNode(data);
  output.appendChild(tree);
  }catch(e){
    alert("Invalid JSON!");
  }
}
const egJson=`{
  "name": "Portfolio",
  "type": "folder",
  "children": [
     {
      "name": "index.html",
      "type": "file"
    },
    {
      "name": "script.js",
      "type": "file"
    },
    {
      "name": "style",
      "type": "folder",
      "children": [
        {
          "name": "styles.css",
          "type": "file"
        }
      ]
    }
  ]
}`;
const textarea = document.getElementById("jsonInput");
textarea.value = egJson;
function clearEg() {
  textarea.value = "";
  output.innerHTML= "";
}
function debounce(){
  let timer;
  document.getElementById("searchInput").addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(searchItem, 300);
});}

function searchItem(){
  const search=document.getElementById("searchInput").value.toLowerCase();
  const result=document.getElementById("result");
  result.innerHTML= "";
  const ul=document.createElement("ul");
  files.forEach(file => {
    if(file.toLowerCase().includes(search))
    {
      const li=document.createElement("li");
      li.textContent=file;
      console.log(li);
      ul.appendChild(li);
    }
  });
}
