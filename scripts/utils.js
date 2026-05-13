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
      data=deleteNode(data,node);
      updateJSON(data);
      output.innerHTML="";
      if(data){
        output.appendChild(createNode(data,"search"));
      }
    });
    return menu;
  }
  // FUNCTION TO DELETE A FILE OR FOLDER
  export function deleteNode(tree,node){
    if(tree===node){
      return null;
    }
    // RETURN IF NO CHILDREN TO CHECK
    if(!tree.children) return tree;
    tree.children=tree.children.filter(
        child=>child!==node
      );
    // RECURSIVELY CHECK CHILDREN TO DELETE NODE
    tree.children.forEach(child=>{
      deleteNode(child,node);
    });
    return tree;
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

    // FUNCTION FOR CONTEXT MENU HANDLING-RIGHT CLICK TO SHOW MENU
export function handleContextMenu(){
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
    btns.style.top=(e.clientY+5)+"px";
    btns.style.left=(e.clientX+5)+"px";
  });

  // EVENT LISTENER TO HIDE CONTEXT MENU ON ANY CLICK OUTSIDE
  document.addEventListener("click",()=>{
    document.querySelectorAll(".menu").forEach(menu=>{
      menu.style.display="none";
    });
  });
}

// FUNCTION TO FILTER FILES BASED ON EXTENSION
export function filterFiles(node,extension){
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

// FUNCTION TO FILTER TREE BASED ON SEARCH QUERY
export function searchTree(node,text){
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