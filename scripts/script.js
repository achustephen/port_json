import {debounce} from './utils.js';
const convertBtn = document.getElementById("convert-btn");
const clearBtn = document.getElementById("clear-btn");
const searchBtn = document.getElementById("search-btn");
const output = document.getElementById("output");
const searchInput=document.getElementById("searchInput");

// NODE CREATION
function createNode(node) {
  const element = document.createElement("div");
  element.setAttribute("data-name", node.name.toLowerCase());

  if (node.type === "folder"){
    element.classList.add("folder");

    const header=document.createElement("div");
    header.classList.add("folder-header");
    header.textContent = "📁" + node.name;
    header.setAttribute("data-name", node.name.toLowerCase());
     element.appendChild(header);

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
  }
  return element;
}

// TREE GENERATION
let data;

function generateTree(){
  const input = document.getElementById("jsonInput").value;
  output.innerHTML = "";

  try{
  data = JSON.parse(input);
  const tree = createNode(data);
  output.appendChild(tree);
  }catch(e){
    alert("Invalid JSON!");
  }
}
convertBtn.addEventListener("click",generateTree);

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

// FUNCTION TO CLEAR EXAMPLE
function clearEg() {
  textarea.value = "";
  output.innerHTML= "";
}
clearBtn.addEventListener("click",clearEg);

// REAL-TIME SEARCH
function handleSearch() {
  const query = searchInput.value.toLowerCase();
  const nodes=document.querySelectorAll("#output [data-name]");

  nodes.forEach(node => {
    const name=node.getAttribute("data-name").toLowerCase();

    if(!query ){
      node.style.display="";
      return;
    }
    if(name.includes(query)){
      node.style.display="";
      let parent = node.parentElement;
      while (parent && parent.id !== "output") {
        parent.style.display = "";
        parent=parent.parentElement;
      }
    } 
    else {
      node.style.display = "none";
    }
  });
}
// EVENTS
const debounced = debounce(handleSearch, 250);
searchInput.addEventListener("keydown", debounced);
searchBtn.addEventListener("click",handleSearch);
