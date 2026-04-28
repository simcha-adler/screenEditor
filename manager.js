
function restartPage() {
    if (!confirm('הדף הנוכחי יימחק לחלוטין, ולא ניתן יהיה לשחזר אותו! האם אתם בטוחים? לשמירת הדף, ניתן להוריד אותו כ-html לפני האתחול.'))
        return false;

    // נקה את העורך הנוכחי
    editor.innerHTML = '';
    // נקה את ה-CSS ואת ה-State
    editorStyle.innerHTML = ''; // להכניס לתוך פונקציית ריסטארט
    Style.refreshSheet(); // רענון הרפרנס
    Style.restart(); // איפוס אובייקט המידע
    tree.build.tree();
    return true;
}

function loadPage() {
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

    Style.refreshSheet();
    Edit.elementSelected(editor);
    $$('.panel').addClass('hide');
    $$('.show').forEach(element => element.click()); // הפעלת כפתורי ברירת המחדל בסוויצ'רים
    // $('fileUploadInput').files[0].name = 'site.html';
    // $('fileUploadInput').sendInput();
    Style.refreshSheet(); // אתחול ראשוני של Style.sheet
    Style.connectAllRules();
}

//  הפעלה מותנית של המערכת. ממתין עד שכל קבצי הפאנלים ייטענו ואז מפעיל את המערכת.
let timer = setInterval(() => {
    console.log(window.schemas);
    if (window.schemas) {
        clearInterval(timer);
        loadPage();
    }
}, 50)