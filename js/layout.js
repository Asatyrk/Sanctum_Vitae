async function loadLayout(){

const headerContainer = document.getElementById("site-header");

if(headerContainer){

const res = await fetch("partials/header.html");
const html = await res.text();

headerContainer.innerHTML = html;

}

const footerContainer = document.getElementById("site-footer");

if(footerContainer){

const res = await fetch("partials/footer.html");
const html = await res.text();

footerContainer.innerHTML = html;

}

}

loadLayout();