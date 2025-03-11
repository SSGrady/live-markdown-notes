import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown } from "@codemirror/lang-markdown";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();
const editorContainer = document.getElementById("editorContainer");
const previewElement = document.getElementById("preview");

// **Update Preview Function**
function updatePreview() {
  const content = editorView.state.doc.toString();
  previewElement.innerHTML = md.render(content);
  console.log("🔄 Preview Updated:", content);
}

// **Initialize Editor**
let editorState = EditorState.create({
  doc: "# Welcome to Obsidian-like Markdown\n\nType markdown and see it render live!",
  extensions: [
    markdown(),
    keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
    history(),
    syntaxHighlighting(defaultHighlightStyle),
    EditorView.lineWrapping,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        updatePreview(); // ✅ Live preview update
      }
    }),
  ],
});

let editorView = new EditorView({
  state: editorState,
  parent: document.getElementById("editor"), // ✅ Target "editor", not "editorContainer"
});

// **Click-to-Edit Mode**: Show Editor When Clicking Preview
previewElement.addEventListener("click", () => {
  console.log("📝 Switching to Editor...");
  previewElement.style.display = "none";
  editorContainer.style.display = "block";
  editorView.focus();
});

// **Blur Event (Clicking Out of Editor)**
editorContainer.addEventListener("focusout", (event) => {
  console.log("🔴 focusout triggered, checking if we should switch to preview...");

  setTimeout(() => {
    if (!document.activeElement.closest("#editorContainer")) {
      console.log("✅ Switching to Preview...");
      updatePreview(); // ✅ Re-render markdown
      previewElement.style.display = "block"; // ✅ Show preview
      editorContainer.style.display = "none"; // ✅ Hide editor
    } else {
      console.log("⏳ Ignored focusout (Still inside editor)");
    }
  }, 100);
});

// **Ensure Initial Preview Render**
updatePreview();
previewElement.style.display = "block";
editorContainer.style.display = "none";