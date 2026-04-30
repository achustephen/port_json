import { debounce } from './utils.js';
import { downArrow, upArrow, type, time } from './constants.js';

const convertBtn=document.getElementById("convert-btn");
const clearBtn=document.getElementById("clear-btn");
const output=document.getElementById("output");
const searchInput=document.getElementById("searchInput");

// NODE CREATION
function createNode(node, mode = "normal") {
  const element=document.createElement("div");
  element.nodeRef=node;
  const renameBtn=document.createElement("button");
  renameBtn.className="rename-btn";
  renameBtn.textContent="Rename";

  // RENAME LOGIC 
  renameBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    renameBtn.style.display="none";
    const label=element.querySelector(".label");
    const input=document.createElement("input");
    input.classList.add("rename-input");
    input.value=node.name;
    label.replaceWith(input);
    input.focus();
    function save(){
      const newName = input.value.trim();
      if (newName=== "") {
      newName="Untitled";
      }
      node.name=newName;
      const newLabel=document.createElement("span");
      newLabel.classList.add("label");
      const icon=node.type===type.folder ? "📁 " : "📄 ";
      newLabel.textContent=icon+newName;
      input.replaceWith(newLabel);
      updateJSON();
    }
    input.addEventListener("blur", save);
    input.addEventListener("keydown", (e) => {
      if (e.key==="Enter"){
        input.blur();
      }
    });
  });

  // JSON UPDATE
  function updateJSON() {
    document.getElementById("jsonInput").value =JSON.stringify(data, null, 2);
  }

  // FOLDER
  if (node.type === type.folder) {
    element.classList.add("folder");
    const header=document.createElement("div");
    header.classList.add("folder-header");
    const label=document.createElement("span");
    label.classList.add("label");
    label.textContent="📁 " + node.name;
    header.appendChild(label);
    header.appendChild(renameBtn);
    element.appendChild(header);
    const children=document.createElement("div");
    children.classList.add("children");
    if (mode==="normal") {
      children.classList.add("hidden");
    }
    if (node.children) {
      node.children.forEach(child => {
        children.appendChild(createNode(child, mode));
      });
    }
    element.appendChild(children);
    header.addEventListener("click", () => {
      children.classList.toggle("hidden");
      if (children.classList.contains("hidden")) {
        label.textContent=downArrow + "📁 " + node.name;
      } else {
        label.textContent=upArrow + "📁 " + node.name;
      }
    });
  } 
  else {
    element.classList.add("file");
    const label=document.createElement("span");
    label.classList.add("label");
    label.textContent= "📄 " + node.name;
    element.appendChild(label);
    element.appendChild(renameBtn);
  }
  return element;
}

// RIGHT CLICK
document.addEventListener("contextmenu", (e) => {
  const item= e.target.closest(".folder, .file");
  if (!item) return;
  e.preventDefault();
  document.querySelectorAll(".rename-btn").forEach(btn => {
    btn.style.display= "none";
  });
  const btn= item.querySelector(".rename-btn");
  if (!btn) return;
  btn.style.display= "block";
  btn.style.position= "fixed";
  btn.style.top= e.clientY + "px";
  btn.style.left= e.clientX + "px";
});

// CLICK TO HIDE BUTTON
document.addEventListener("click", (e) => {
  if (e.target.closest(".rename-btn")) return;
  document.querySelectorAll(".rename-btn").forEach(btn => {
    btn.style.display="none";
  });
});

// TREE FILTERING
function filterTree(node, text) {
  const match=node.name.toLowerCase().includes(text);
  if (node.type===type.file) {
    return match?node:null;
  }
  let children= [];
  if (node.children) {
    for (let child of node.children) {
      const result = filterTree(child, text);
      if (result) children.push(result);
    }
  }
  if (match) return node;
  if (children.length > 0) {
    return {
      name: node.name,
      type: node.type,
      children: children
    };
  }
  return null;
}

// TREE GENERATION
let data;
function generateTree() {
  const input = document.getElementById("jsonInput").value;
  output.innerHTML = "";
  try {
    data = JSON.parse(input);
    output.appendChild(createNode(data));
  } catch {
    alert("Invalid JSON!");
  }
}
convertBtn.addEventListener("click", generateTree);

// DEFAULT JSON
const textarea = document.getElementById("jsonInput");
textarea.value = `{
  "name": "Portfolio",
  "type": "folder",
  "children": [
    { "name": "index.html", "type": "file" },
    { "name": "script.js", "type": "file" },
    {
      "name": "style",
      "type": "folder",
      "children": [
        { "name": "styles.css", "type": "file" }
      ]
    }
  ]
}`;

// CLEAR
clearBtn.addEventListener("click", () => {
  textarea.value = "";
  output.innerHTML = "";
  data = null;
});

// SEARCH
function handleSearch() {
  if (!data) return;
  const query = searchInput.value.toLowerCase();
  output.innerHTML = "";
  if (!query) {
    output.appendChild(createNode(data));
    return;
  }
  const filtered = filterTree(data, query.trim());
  if (filtered) {
    output.appendChild(createNode(filtered, "search"));
  }
}
searchInput.addEventListener("input", debounce(handleSearch, time));