document.addEventListener("DOMContentLoaded", ()=>{

const titleContainer = document.getElementById("page-title");

if(!titleContainer) return;

const pageName = document.body.dataset.page;

if(!pageName) return;

titleContainer.textContent = pageName;

});