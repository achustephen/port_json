const output = document.getElementById("output");
function createNode(node) {
  const element = document.createElement("div");

  if (node.type === "folder") {
    element.classList.add("folder");
    const header=document.createElement("div");
    header.classList.add("folder-header");
    header.textContent = "📁" + node.name;
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

function generateTree(){
  const input = document.getElementById("jsonInput").value;
  output.innerHTML = "";
  const data = JSON.parse(egJson);
  const tree = createNode(data);
  output.appendChild(tree);
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



