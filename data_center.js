const nav = $('main-nav');
const toolbar = $('toolbar');
const sidebar = $('sidebar');
const panelLeft = $('panel-left');
const panelRight = $('panel-right');
const panels = $('panels');
const treePanel = $('panel-tree');

function initIframe() {
    const iframe = $('canvas-iframe');
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write(/*html*/`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <style id="user_styles"></style>
            <link rel="stylesheet" href="./styles/orderCss/editor.css">
        </head>
        <body>
            <div id="דף_הבסיס" style="min-height: 100vh;"></div>
            <script src="./lib/short.js"></script>
        </body>
        </html>
    `);
    doc.close();
}

initIframe();


/**@type {HTMLIFrameElement} */
const iframe = $('canvas-iframe');
const editorDoc = iframe.contentDocument || iframe.contentWindow.document;
const editor = editorDoc.getElementById('דף_הבסיס');
const editorStyle = editorDoc.getElementById('user_styles');