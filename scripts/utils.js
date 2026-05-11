export function debounce(func,delay){
  let timer;
  return function (...args){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      func(...args)},delay);
  };
}
export function updateJSON(data){
  document.getElementById("jsonInput").value=
    JSON.stringify(data,(key,value)=>{
      if(key==="isNew") return undefined;
      return value;
    },1);
}
