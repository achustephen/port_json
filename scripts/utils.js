export function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args)}, delay);
  };
}


// import { debounce } from './utils.js';
// import { downArrow,upArrow,type,time } from './constants.js';

// const convertBtn = document.getElementById("convert-btn");
// const clearBtn = document.getElementById("clear-btn");
// const searchBtn = document.getElementById("search-btn");
// const output = document.getElementById("output");
// const searchInput = document.getElementById("searchInput");

// // NODE CREATION
// function createNode(node,mode="normal") {
//   const element = document.createElement("div");
//   element.setAttribute("data-name", node.name.toLowerCase());
//   if (node.type === type.folder) {
//     element.classList.add("folder");
//     const header = document.createElement("div");
//     header.classList.add("folder-header");
//     header.textContent = "📁" + node.name;
//     header.setAttribute("data-name", node.name.toLowerCase());
//     element.appendChild(header);
//     const childrenContainer = document.createElement("div");
//     childrenContainer.classList.add("children");
//     if (mode === "normal") {
//       childrenContainer.classList.add("hidden");
//     }
//     if (node.children) {
//       node.children.forEach(child => {
//         childrenContainer.appendChild(createNode(child,mode));
//       });
//     }
//     element.appendChild(childrenContainer);
//     header.addEventListener("click", () => {
//       childrenContainer.classList.toggle("hidden");
//       if (childrenContainer.classList.contains("hidden")) {
//         header.textContent = downArrow + "📁" + node.name;
//       } else {
//         header.textContent = upArrow + "📁" + node.name;
//       }
//     });
//   } else {
//     element.classList.add("file");
//     element.textContent = "📄" + node.name;
//   }
//   return element;
// }

// // FILTER
// function filterTree(node, text) {
//   const name = node.name.toLowerCase();
//   const match = name.includes(text);
//   if (node.type === type.file) {
//     return match ? node : null;
//   }
//   let children = [];
//   if (node.children) {
//     for (let child of node.children) {
//       const result = filterTree(child, text);
//       if (result) children.push(result);
//     }
//   }
//   if (match) {
//   return node;
// }
// if (children.length > 0) {
//   return {
//     name: node.name,
//     type: node.type,
//     children: children
//   };
// }
//   return null;
// }

// // TREE GENERATION
// let data;
// function generateTree() {
//   const input = document.getElementById("jsonInput").value;
//   output.innerHTML = "";
//   try {
//     data = JSON.parse(input);
//     const tree = createNode(data,"normal");
//     output.appendChild(tree);
//   } catch (e) {
//     alert("Invalid JSON!");
//   }
// }
// convertBtn.addEventListener("click", generateTree);
// const egJson = `{
//   "name": "Portfolio",
//   "type": "folder",
//   "children": [
//     { "name": "index.html", "type": "file" },
//     { "name": "script.js", "type": "file" },
//     {
//       "name": "style",
//       "type": "folder",
//       "children": [
//         { "name": "styles.css", "type": "file" }
//       ]
//     }
//   ]
// }`;
// const textarea = document.getElementById("jsonInput");
// textarea.value = egJson;

// // CLEAR
// function clearEg() {
//   textarea.value = "";
//   output.innerHTML = "";
//   data = null;
// }
// clearBtn.addEventListener("click", clearEg);

// // REAL-TIME SEARCH
// function handleSearch() {
//   if (!data) return;
//   const query = searchInput.value.toLowerCase();
//   output.innerHTML = "";
//   if (!query) {
//     output.appendChild(createNode(data,"normal"));
//     return;
//   }
//   const filtered = filterTree(data, query.trim());
//   if (filtered) {
//     output.appendChild(createNode(filtered,"search"));
//   }
// }

// // EVENTS
// const debounced = debounce(handleSearch,time);
// searchInput.addEventListener("input", debounced);