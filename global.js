console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 2 Code
// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add('current');

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"
  : "/portfolio/";

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/PeterLittle670', title: 'GitHub' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  url = !url.startsWith('http') ? BASE_PATH + url : url;
  // next step: create link and add it to nav
  // let link = document.createElement('a');
  // link.href = url;
  // link.textContent = title;
  // nav.appendChild(link);
  nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
}
