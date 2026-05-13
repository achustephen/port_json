import {NODE_TYPE} from "./constants.js";
// DEBOUNCE FUNCTION FOR SEARCH OPTIMIZATION
export function debounce(func,delay){
  let timer;
  return function (...args){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      func(...args)},delay);
  };
}
// FUNCTION TO UPDATE JSON STRING IN TEXTAREA AFTER UPDATES IN UI
export function updateJSON(data){
  document.getElementById("jsonInput").value=
    JSON.stringify(data,(key,value)=>{
      if(key==="isNew") return undefined;
      return value;
    },1);
}
// FUNCTION TO CREATE CONTEXT MENU FOR EACH NODE
export function createMenu(node,data,output,NODE_TYPE,createNode){
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
      addNewNode(node,NODE_TYPE.file,NODE_TYPE,data,output,createNode);
    });

    // EVENT LISTENER FOR ADDING FOLDER
    menu.querySelector(".add-folder").addEventListener("click",()=>{
      menu.style.display="none";
      addNewNode(node,NODE_TYPE.folder,NODE_TYPE,data,output,createNode);
    });

    // EVENT LISTENER FOR DELETING FILE OR FOLDER
    menu.querySelector(".delete").addEventListener("click",()=>{
      menu.style.display="none";
      deleteNode(data,node,output);
      updateJSON(data);
      output.innerHTML="";
      output.appendChild(createNode(data,"search"));
    });
    return menu;
  }
  // FUNCTION TO DELETE A FILE OR FOLDER
  export function deleteNode(tree,node,output){
      if(tree===node){
        // tree=null;
        // output.innerHTML="";
        return null;
      }
      // RETURN IF NO CHILDREN TO CHECK
      if(!tree.children) return;
      tree.children=tree.children.filter(
        child=>child!==node
      );
      // RECURSIVELY CHECK CHILDREN TO DELETE NODE
      tree.children.forEach(child=>{
      deleteNode(child,node,output);
      });
    }

    // FUNCTION TO ADD NEW FILE OR FOLDER
    export function addNewNode(node,nodeType,NODE_TYPE,data,output,createNode){
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