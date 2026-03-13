async function loadLayout(){

const headerContainer = document.getElementById("site-header");

if(headerContainer){

const res = await fetch("partials/header.html");
const html = await res.text();

headerContainer.innerHTML = html;

}

}

loadLayout();