function debounce(func,time,input){
  let timer;
  document.getElementById("searchInput").addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(func, time);
});}


function debounce(){
  let timer;
  document.getElementById("searchInput").addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(searchItem, 300);
});}