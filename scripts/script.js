import {debounce,updateJSON,createMenu,deleteNode,addNewNode} from './utils.js';
import {NODE_TYPE,DEBOUNCE_TIME_MS,EXAMPLE_JSON} from './constants.js';

//HTML ELEMENTS REFERENCE
const convertBtn=document.getElementById("convert-btn");
const clearBtn=document.getElementById("clear-btn");
const output=document.getElementById("output");
const searchInput=document.getElementById("searchInput");
const filterInput=document.getElementById("filterInput");

// FUNCTION TO CREATE FOLDER OR FILE NODE IN UI
export function createNode(node,mode="normal"){
  const element=document.createElement("div");
 
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
    const menu=createMenu(node,data,output,NODE_TYPE,createNode);
    element.appendChild(menu);
    element.appendChild(header);

    // CREATES CHILDREN CONTAINER FOR FOLDERS AND RECURSIVELY CREATES CHILD NODES
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
    const menu=createMenu(node,data,output,NODE_TYPE,createNode);
    element.appendChild(menu);
  }
  return element;
}
// FUNCTION CALL TO DISPLAY CONTEXT MENU ON RIGHT CLICK
handleContextMenu();

// FUNCTION FOR CONTEXT MENU HANDLING-RIGHT CLICK TO SHOW MENU
function handleContextMenu(e){
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

// FUNCTION TO FILTER TREE BASED ON SEARCH QUERY
function searchTree(node,text){
  const match=node.name.toLowerCase().includes(text);
  if(node.type===NODE_TYPE.file){
    return match?node:null;
  }
  // IF NODE IS A FOLDER,RECURSIVELY CHECK CHILDREN AND INCLUDE FOLDER IF ANY CHILD MATCHES
  let children=[];
  if(node.children){
    for(let child of node.children){
      const result=searchTree(child,text);
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
  const searchQuery=searchInput.value.toLowerCase();
  output.innerHTML="";
  if (!searchQuery){
    output.appendChild(createNode(data));
    return;
  }
  // FILTERS THE TREE BASED ON SEARCH QUERY AND UPDATES UI WITH MATCHING NODES
  const searchResult=searchTree(data,searchQuery.trim());
  if (searchResult){
    output.appendChild(createNode(searchResult,"search"));
  }
}
// EVENT LISTENER TO IMPLEMENT DEBOUNCE ON SEARCH INPUT
searchInput.addEventListener("input",debounce(handleSearch,DEBOUNCE_TIME_MS));

// FUNCTION TO FILTER FILES BASED ON EXTENSION
function filterFiles(node,extension){
  const queryMatch=node.name.toLowerCase().endsWith(extension);

  // IF NODE IS A FILE,RETURN IT IF IT MATCHES THE QUERY
  if(node.type===NODE_TYPE.file){
    return queryMatch? [node] : [];
  }
  // IF NODE IS A FOLDER,RECURSIVELY CHECK CHILDREN AND ADD MATCHING FILES INTO RESULT
  let files=[];
  if(node.children){
    for(let child of node.children){
      const result=filterFiles(child,extension);
      if(result)
      files.push(...result);
    }
  }
  return files;
}

// FUNCTION TO HANDLE FILTER SEARCH AND UPDATE UI WITH FILTERED FILES
function handleFilter(){
 if (!data) return;
   const filterQuery=filterInput.value.toLowerCase();
  output.innerHTML="";
  if (!filterQuery){
    output.appendChild(createNode(data));
    return;
  }
  // FILTERS THE TREE AND GENERATES MATCHING FILES UI BASED ON EXTENSION QUERY
  const filterResult=filterFiles(data,filterQuery.trim());
  if(filterResult.length>0){
    filterResult.forEach(file=>{
      output.appendChild(createNode(file,"search"));
    });
  }
}
// EVENT LISTENER TO IMPLEMENT DEBOUNCE ON FILTER INPUT
filterInput.addEventListener("input",debounce(handleFilter,DEBOUNCE_TIME_MS));
