import {debounce,updateJSON} from './utils.js';
import {type,time,egJson} from './constants.js';

//HTML ELEMENTS
const convertBtn=document.getElementById("convert-btn");
const clearBtn=document.getElementById("clear-btn");
const output=document.getElementById("output");
const searchInput=document.getElementById("searchInput");

// NODE CREATION
function createNode(node,mode="normal"){
  const element=document.createElement("div");

    // MENU CREATION
  function createMenu(node){
    const menu=document.createElement("ul");
    menu.classList.add("menu");
    menu.innerHTML = `
      <li><button class="menu-btns add-file">New File</button></li>
      <li><button class="menu-btns add-folder">New Folder</button></li>
      <li><button class="menu-btns rename">Rename</button></li> `;
      // <li><button class="menu-btns delete">Delete</button></li> `;

    // RENAME EVENT LISTENER
    menu.querySelector(".rename").addEventListener("click",()=>{
    menu.style.display="none";
    node.isNew=true;
    output.innerHTML="";
    output.appendChild(createNode(data,"search"));
    });

    // EVENT LISTENER FOR ADDING FILE
    menu.querySelector(".add-file").addEventListener("click",()=>{
      menu.style.display="none"; 
      addNew(node,"file"); 
    });

    // EVENT LISTENER FOR ADDING FOLDER
    menu.querySelector(".add-folder").addEventListener("click",()=>{
      menu.style.display="none";
      addNew(node,"folder"); 
    });
    return menu;
  }

    // FUNCTION TO ADD NEW FILE OR FOLDER
  function addNew(node, type){
    if (node.type!=="folder") return;
    if (!node.children){
      node.children=[];
    }
    const newNode={
      name:type==="file" ? "New File" : "New Folder",
      type:type,
      isNew:true
    };
    if(type==="folder"){
      newNode.children=[];
    }
    node.children.push(newNode);
    updateJSON(data);
    output.innerHTML= "";
    output.appendChild(createNode(data,"search"));
  }

  //CREATES UI FOR FOLDER OR FILE
  if(node.type===type.folder){
    element.classList.add("folder");
    const header=document.createElement("div");
    header.classList.add("folder-header");
    const label=document.createElement("span");
    label.classList.add("label");
    label.textContent="📁 " + node.name;
    if(node.isNew){
    const input=document.createElement("input");
    input.classList.add("name-input");
    input.value=node.name;
    header.appendChild(input);
    input.focus();
    input.addEventListener("blur",()=>{
      node.name=input.value.trim();
      node.isNew=false;
      updateJSON(data);
      output.innerHTML="";
      output.appendChild(createNode(data,"search"));
    });
    input.addEventListener("keydown",(e)=>{
      if(e.key==="Enter"){
        input.blur();
      }
    });
  }
    if(!node.isNew){
    header.appendChild(label);
    }
    const menu=createMenu(node);
    element.appendChild(menu);
    element.appendChild(header);
    const children=document.createElement("div");
    children.classList.add("children");
    if(mode==="normal"){
      children.classList.add("hidden");
    }
    if(node.children){
      node.children.forEach(child => {
        children.appendChild(createNode(child,mode));
      });
    }
    element.appendChild(children);
    header.addEventListener("click",(e) => {
      if(e.target.closest(".menu-btns")) return;
      children.classList.toggle("hidden");
    });
  } 
  else{
    element.classList.add("file");
    const label=document.createElement("span");
    label.classList.add("label");
    label.textContent="📄 " +node.name;
    if(node.isNew){
    const input=document.createElement("input");
    input.classList.add("name-input");
    input.value=node.name;
    element.appendChild(input);
    input.focus();
    input.addEventListener("blur",()=>{
      node.name=input.value.trim() || node.name;
      node.isNew=false;
      updateJSON(data);
      output.innerHTML="";
      output.appendChild(createNode(data,"search"));
    });
    input.addEventListener("keydown",(e)=>{
      if(e.key==="Enter"){
        input.blur();
      }
    });
  }
    if(!node.isNew){
    element.appendChild(label);
    }
    const menu=createMenu(node);
    element.appendChild(menu);
  }
  return element;
}

// RIGHT CLICK
document.addEventListener("contextmenu", (e) => {
  const item=e.target.closest(".folder, .file");
  if (!item) return;
  e.preventDefault();
  document.querySelectorAll(".menu").forEach(menu => {
    menu.style.display = "none";
  });
  const btns=item.querySelector(".menu");
  if (!btns) return;
  btns.style.display="flex";
  btns.style.position="absolute";
  btns.style.top=(e.clientY + 5) + "px";
  btns.style.left=(e.clientX + 5) + "px";
});

// CLICK TO HIDE MENU
document.addEventListener("click",() => {
  document.querySelectorAll(".menu").forEach(menu => {
    menu.style.display = "none";
  });
});

// SEARCH FILTERING
function filterTree(node,text){
  const match=node.name.toLowerCase().includes(text);
  if (node.type===type.file) {
    return match?node:null;
  }
  let children= [];
  if (node.children) {
    for(let child of node.children){
      const result=filterTree(child,text);
      if (result) children.push(result);
    }
  }
  if (match) return node;
  if (children.length>0) {
    return {
      name:node.name,
      type:node.type,
      children:children
    };
  }
  return null;
}

// TREE GENERATION
let data;
function generateTree() {
  const input=document.getElementById("jsonInput").value;
  output.innerHTML= "";
  try {
    data=JSON.parse(input);
    output.appendChild(createNode(data));
  } catch{
    alert("Invalid JSON!");
  }
}
convertBtn.addEventListener("click",generateTree);

// DEFAULT JSON
const textarea=document.getElementById("jsonInput");
textarea.value=egJson; 

// CLEAR JSON AND UI
clearBtn.addEventListener("click", () => {
  textarea.value= "";
  output.innerHTML= "";
  data=null;
});

// SEARCH HANDLING
function handleSearch() {
  if (!data) return;
  const query=searchInput.value.toLowerCase();
  output.innerHTML= "";
  if (!query) {
    output.appendChild(createNode(data));
    return;
  }
  const filtered=filterTree(data, query.trim());
  if (filtered){
    output.appendChild(createNode(filtered,"search"));
  }
}
searchInput.addEventListener("input", debounce(handleSearch,time));
