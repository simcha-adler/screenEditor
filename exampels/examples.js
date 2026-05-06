import { site } from "./site.js"
import { support } from "./support.js"
import { developer } from "./developer.js"
import { service } from "./service.js"


export const examples = {
    corrent: site
}

export function loadToEditor(html, css) {
    if (!html || !css) {
        html = localStorage.getItem('screenEditor_html');
        css = localStorage.getItem('screenEditor_css');
    }
    if (!html || !css) {
        html = examples.corrent.html;
        css = examples.corrent.css;
    };
    editor.innerHTML = html;
    editorStyle.innerHTML = css;
}

window.loadToEditor = loadToEditor;