document.addEventListener("DOMContentLoaded", ()=>{

const titleContainer = document.getElementById("page-title");

if(!titleContainer) return;

const pageName = document.body.dataset.page;

if(!pageName) return;

titleContainer.textContent = pageName;

document.title = `Sanctum Vitae | ${pageName}`;

const logo = document.querySelector(".site-logo");
if (logo) {
  logo.textContent = `Sanctum Vitae | ${pageName}`;
}

});