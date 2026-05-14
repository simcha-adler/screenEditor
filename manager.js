
function restartPage() {
    if (!confirm('הדף הנוכחי יימחק לחלוטין, ולא ניתן יהיה לשחזר אותו! האם אתם בטוחים? לשמירת הדף, ניתן להוריד אותו כ-html לפני האתחול.'))
        return false;

    // נקה את העורך הנוכחי
    editor.innerHTML = '';
    Style.restart(); //  איפוס כל הסטיילים
    tree.build.tree();
    return true;
}

function loadPage() {
    loadToEditor();
    // טעינת פאנלים
    UI.buildPanel('panel-display', schemas.view, designListeners);
    UI.buildPanel('panel-layout', schemas.layout, designListeners);
    UI.buildPanel('panel-design', schemas.design, designListeners);
    UI.buildPanel('panel-borders', schemas.borders, designListeners);
    UI.buildPanel('panel-position', schemas.position, designListeners);
    UI.buildPanel('panel-animations', schemas.animations, designListeners);
    UI.buildPanel('panel-theme', schemas.theme);
    UI.buildPanel('panel-add-element', schemas.addElement);
    UI.buildPanel('panel-classes', schemas.classes);
    settings.loadPanel();
    tree.init();

    loadDocumentListeners();
    attachClassesListeners();
    initHamburgerListeners();
    niceColorPicker.init();

    Style.refreshSheet();
    Style.connectAllRules();
    Edit.elementSelected(editor);
    $$('.panel').addClass('d-none');
    $$('.show').forEach(element => element.click()); // הפעלת כפתורי ברירת המחדל בסוויצ'רים
}


function initEeditorReferenses() {
    editor = editorDoc.getElementById('דף_הבסיס');
    editorStyle = editorDoc.getElementById('user_styles');
}

//  הפעלה מותנית של המערכת. ממתין עד שכל קבצי הפאנלים והפריים ייטענו ואז מפעיל את המערכת.
let timer = setInterval(() => {
    initEeditorReferenses();
    if (window.schemas && editorDoc && editorStyle) {
        clearInterval(timer);
        loadPage();
    }
}, 50);
