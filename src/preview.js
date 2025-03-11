import MarkdownIt from "markdown-it";

const md = new MarkdownIt();
const previewElement = document.getElementById("preview");

// **Listen for Updates from Editor**
window.addEventListener("markdown-update", (event) => {
  console.log("Preview Updating:", event.detail); // ✅ Debug log
  previewElement.innerHTML = md.render(event.detail);
});

// **Ensure Initial Render is Shown**
previewElement.innerHTML = md.render("# Welcome to Obsidian-like Markdown\n\nType markdown and see it render live!");