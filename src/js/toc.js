// find all headers in the rendered markdown and store them in an array
let headersList = [];

// TOC Logic

const tocContainer = document.getElementById("toc");

// Create button
const btn = document.createElement("button");
btn.id = "toc-btn";
btn.className = "toc-btn";
btn.innerHTML = `<span></span><span></span><span></span>`;

// Create menu
const menu = document.createElement("div");
menu.className = "toc-menu";

const ul = document.createElement("ul");

const li1 = document.createElement("li");
li1.textContent = "Table of Contents";
li1.style.fontWeight = "bold";
li1.style.cursor = "default";

ul.appendChild(li1);
// headersList.forEach((heading, index) => {
//   const id = "heading-" + index;

//   const li = document.createElement("li");
//   li.textContent = heading.text;
//   console.log(heading);

//   li.onclick = () => {
//     // document.getElementById(id).scrollIntoView({
//     //   behavior: "smooth"
//     // });
//     btn.classList.toggle("active");
//     menu.classList.toggle("show");
//   };

//   ul.appendChild(li);
// });

menu.appendChild(ul);
tocContainer.appendChild(btn);
tocContainer.appendChild(menu);

/* Default expand */
btn.classList.add("active");
menu.classList.add("show");
// Toggle
btn.addEventListener("click", () => {
  btn.classList.toggle("active");
  menu.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  requestAnimationFrame(() => {
    const isClickInside = btn.contains(e.target) || menu.contains(e.target);

    if (!isClickInside) {
      btn.classList.remove("active");
      menu.classList.remove("show");
    }
  });
});

window.addEventListener("DOMContentLoaded", async () => {
  const targetNode = document.getElementById("app");

  const observer = new MutationObserver((mutations) => {
    // Clear the list so you don't get duplicates every time the observer fires
    ul.innerHTML = "";

    const headers = targetNode.querySelectorAll("h1, h2");

    headers.forEach((h, idx) => {
      const text = h.innerText.trim();
      if (text !== "") {
        const uniqueId = "heading-anchor-" + idx;

        // 1. CRITICAL: Assign the ID to the actual H1/H2 element in the document
        h.id = uniqueId;

        const li = document.createElement("li");
        li.textContent = text;

        li.onclick = () => {
          // 2. Now this will find the H1/H2 element, not the LI
          const targetElement = document.getElementById(uniqueId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
            });
          }
        };

        ul.appendChild(li);
      }
    });
  });

  observer.observe(targetNode, { childList: true, subtree: true });
});
