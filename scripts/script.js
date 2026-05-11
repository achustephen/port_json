import {debounce,updateJSON} from './utils.js';
import {NODE_TYPE,DEBOUNCE_TIME_MS,EXAMPLE_JSON} from './constants.js';

//HTML ELEMENTS REFERENCE
const convertBtn=document.getElementById("convert-btn");
const clearBtn=document.getElementById("clear-btn");
const output=document.getElementById("output");
const searchInput=document.getElementById("searchInput");

// FUNCTION TO CREATE FOLDER OR FILE NODE IN UI
function createNode(node,mode="normal"){
  const element=document.createElement("div");

    // FUNCTION TO CREATE CONTEXT MENU
  function createMenu(node){
    const menu=document.createElement("ul");
    menu.classList.add("menu");
    menu.innerHTML = `
      <li><button class="menu-btns add-file">New File</button></li>
      <li><button class="menu-btns add-folder">New Folder</button></li>
      <li><button class="menu-btns rename">Rename</button></li>
      <li><button class="menu-btns delete">Delete</button></li> `;

    // EVENT LISTENER FOR RENAMING FILE OR FOLDER
    menu.querySelector(".rename").addEventListener("click",()=>{
    menu.style.display="none";
    node.isNew=true;
    output.innerHTML="";
    output.appendChild(createNode(data,"search"));
    });

    // EVENT LISTENER FOR ADDING FILE
    menu.querySelector(".add-file").addEventListener("click",()=>{
      menu.style.display="none"; 
      addNew(node,NODE_TYPE.file); 
    });

    // EVENT LISTENER FOR ADDING FOLDER
    menu.querySelector(".add-folder").addEventListener("click",()=>{
      menu.style.display="none";
      addNewNode(node,NODE_TYPE.folder); 
    });

    // EVENT LISTENER FOR DELETING FILE OR FOLDER
    menu.querySelector(".delete").addEventListener("click",()=>{
      menu.style.display="none";
      deleteNode(data,node);
      updateJSON(data);
      output.innerHTML="";
      output.appendChild(createNode(data,"search"));
    });
    return menu;
  }

  // FUNCTION TO DELETE EXISTING NODE
  function deleteNode(tree,node){
    if(tree===node){
      data=null;
      output.innerHTML="";
      return;
    }
    // RETURN IF NO CHILDREN TO CHECK
    if(!tree.children) return;
    tree.children=tree.children.filter(
      child=>child!==node
    );
    // RECURSIVELY CHECK CHILDREN TO DELETE NODE
    tree.children.forEach(child=>{
    deleteNode(child,node);
    });
  }
    // FUNCTION TO ADD NEW FILE OR FOLDER
  function addNewNode(node,nodeType){
    if (node.type!==NODE_TYPE.folder) return;
    if (!node.children){
      node.children=[];
    }
    const newNode={
      name:nodeType===NODE_TYPE.file ? "New File" : "New Folder",
      type:nodeType,
      isNew:true
    };
    if(nodeType===NODE_TYPE.folder){
      newNode.children=[];
    }
    // ADD NEW NODE TO DATA STRUCTURE,UPDATE JSON AND UPDATE UI
    node.children.push(newNode);
    updateJSON(data);
    output.innerHTML="";
    output.appendChild(createNode(data,"search"));
  }

  //CREATES UI FOR FOLDER OR FILE
  if(node.type===NODE_TYPE.folder){
    element.classList.add("folder");
    const header=document.createElement("div");
    header.classList.add("folder-header");
    const label=document.createElement("span");
    label.classList.add("label");
    label.textContent="📁 "+node.name;
    // IF NEW NODE, SHOW INPUT FIELD FOR ENTERING FILE NAME
    if(node.isNew){
    const input=document.createElement("input");
    input.classList.add("name-input");
    input.value=node.name;
    header.appendChild(input);
    input.focus();
    // EVENT LISTENER TO SAVE NEW FILE NAME ON BLUR OR ENTER KEY
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
    // CREATE CHILDREN CONTAINER FOR FOLDERS AND RECURSIVELY CREATE CHILD NODES
    const children=document.createElement("div");
    children.classList.add("children");
    if(mode==="normal"){
      children.classList.add("hidden");
    }
    if(node.children){
      node.children.forEach(child=>{
        children.appendChild(createNode(child,mode));
      });
    }
    element.appendChild(children);
    // EVENT LISTENER TO TOGGLE FOLDER OPEN/CLOSE ON HEADER CLICK
    header.addEventListener("click",(e)=>{
      if(e.target.closest(".menu-btns")) return;
      children.classList.toggle("hidden");
    });
  } 
  // IF NODE IS A FILE, CREATE FILE ELEMENT WITH CONTEXT MENU USING SIMILAR LOGIC AS FOLDER
  else{
    element.classList.add("file");
    const label=document.createElement("span");
    label.classList.add("label");
    label.textContent="📄 "+node.name;
    if(node.isNew){
    const input=document.createElement("input");
    input.classList.add("name-input");
    input.value=node.name;
    element.appendChild(input);
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
    element.appendChild(label);
    }
    const menu=createMenu(node);
    element.appendChild(menu);
  }
  return element;
}

// CONTEXT MENU HANDLING-RIGHT CLICK TO SHOW MENU
document.addEventListener("contextmenu",(e)=>{
  const item=e.target.closest(".folder, .file");
  if (!item) return;
  e.preventDefault();
  document.querySelectorAll(".menu").forEach(menu => {
    menu.style.display="none";
  });
  // LOGIC TO DISPLAY MENU FOR CLICKED ITEM
  const btns=item.querySelector(".menu");
  if (!btns) return;
  btns.style.display="flex";
  btns.style.position="absolute";
  btns.style.top=(e.clientY + 5)+"px";
  btns.style.left=(e.clientX + 5)+"px";
});

// EVENT LISTENER TO HIDE CONTEXT MENU ON ANY CLICK OUTSIDE
document.addEventListener("click",()=>{
  document.querySelectorAll(".menu").forEach(menu=>{
    menu.style.display="none";
  });
});

// FUNCTION TO FILTER TREE BASED ON SEARCH QUERY
function filterTree(node,text){
  const match=node.name.toLowerCase().includes(text);
  if(node.type===NODE_TYPE.file){
    return match?node:null;
  }
  // IF NODE IS A FOLDER,RECURSIVELY CHECK CHILDREN AND INCLUDE FOLDER IF ANY CHILD MATCHES
  let children=[];
  if(node.children){
    for(let child of node.children){
      const result=filterTree(child,text);
      if (result) children.push(result);
    }
  }
  // IF CURRENT NODE OR ANY CHILD MATCHES,RETURN NODE WITH FILTERED CHILDREN
  if (match) return node;
  if (children.length>0){
    return{
      name:node.name,
      type:node.type,
      children:children
    };
  }
  return null;
}

let data;
// FUNCTION TO GENERATE FOLDER STRUCTURE UI FROM JSON INPUT
function generateTree(){
  const input=document.getElementById("jsonInput").value;
  output.innerHTML="";
  // PARSES JSON AND CREATES UI,ALERTS USER IF JSON IS INVALID
  try {
    data=JSON.parse(input);
    output.appendChild(createNode(data));
  } catch{
    alert("Invalid JSON!");
  }
}
convertBtn.addEventListener("click",generateTree);

// LOADS EXAMPLE JSON INTO TEXTAREA
const textarea=document.getElementById("jsonInput");
textarea.value=EXAMPLE_JSON; 

// EVENT LISTENER TO CLEAR TEXTAREA AND OUTPUT
clearBtn.addEventListener("click",()=>{
  textarea.value="";
  output.innerHTML="";
});

// FUNCTION TO HANDLE SEARCH INPUT AND UPDATE UI WITH FILTERED RESULTS
function handleSearch(){
  if (!data) return;
  const query=searchInput.value.toLowerCase();
  output.innerHTML="";
  if (!query) {
    output.appendChild(createNode(data));
    return;
  }
  // FILTERS THE TREE BASED ON SEARCH QUERY AND UPDATES UI WITH MATCHING NODES
  const filtered=filterTree(data,query.trim());
  if (filtered){
    output.appendChild(createNode(filtered,"search"));
  }
}
// EVENT LISTENER TO IMPLEMENT DEBOUNCE ON SEARCH INPUT
searchInput.addEventListener("input",debounce(handleSearch,DEBOUNCE_TIME_MS));

