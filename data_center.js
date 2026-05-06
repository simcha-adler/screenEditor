const nav = $('main-nav');
const toolbar = $('toolbar');
const sidebar = $('sidebar');
const panelLeft = $('panel-left');
const panelRight = $('panel-right');
const panels = $('panels');
const treePanel = $('panel-tree');

/**@type {HTMLIFrameElement} */
const iframe = $('canvas-iframe');
const editorDoc = iframe.contentDocument || iframe.contentWindow.document;

let editor;
let editorStyle;


function initIframe() {
    const page = /*html*/`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <style id="user_styles"></style>
            <link rel="stylesheet" href="./styles/orderCss/editor.css">
            <link rel="stylesheet" href="./styles/orderCss/animation.css">
            <script src="./lib/short.js"></script>
        </head>
        <body>
            <div id="דף_הבסיס" style="min-height: 100vh;"></div>
        </body>
        </html>
    `;
    editorDoc.open();
    editorDoc.writeln(page);
    editorDoc.close();
}

initIframe();