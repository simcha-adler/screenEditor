
/**
 * מעדכן את המשתנים הרלוונטיים על זהות האלמנט הנבחר ותכונותיו
 * @param {HTMLElement | null} newElement
 */
function updateSelectedElement(newElement) {

    if (!newElement) newElement = editor;
    // אם האלמנט לא השתנה או שהוא מחוץ לעורך, חזור
    if (theElement === newElement ||
        (newElement !== 'editor' && !editor.contains(newElement))) return;
    // מחזיר id. אם אין, יוצר ומחזיר.
    const Id = ensureElementId(newElement);
    // 3. ניקוי הסימון מהאלמנט הקודם (אם היה)
    if (theElement) {
        theElement.removeClass('selected-element');
    }
    // עדכן את כל התוכנית שהאלמנט השתנה
    theElement = newElement;
    theStyles = window.getComputedStyle(theElement);
    if (thePanel && thePanel !== treePanel)
        restartPanel(thePanel);
    $('theElement').value = Id.replaceAll('_', ' ');
    // סמן את האלמנט הנבחר
    theElement.addClass('selected-element');
}

/**
 * טעינת התוכן לפאנל
*/
function updatePanel(panel) {
    if (thePanel === panel) return;

    // צריך לתמוך במצב פתיחת פאנל, סגירה ויזואלית, והחלפה מיידית
    if (panel) {
        if (thePanel) thePanel.addClass('hide');
        panel.removeClass('hide');
        fillValues.panel(panel.id);
    } else if (thePanel) {
        const temp = thePanel;
        setTimeout(() => {
            if (!panelLeft.classList.contains('open')) //כדי למנוע תקלות בסגירה ופתיחה מיידית
                temp.addClass('hide');
        }, 300);
    }
    thePanel = panel;
}

function restartPage() {
    if (!confirm('הדף הנוכחי יימחק לחלוטין, ולא ניתן יהיה לשחזר אותו! האם אתם בטוחים? לשמירת הדף, ניתן להוריד אותו כ-html לפני האתחול.'))
        return false;

    // נקה את העורך הנוכחי
    $('דף_הבסיס').innerHTML = '';
    // נקה את ה-CSS ואת ה-State
    $('styles').innerHTML = '';
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
    // tree.init();

    loadDocumentListeners();
    attachClassesListeners();

    updateSelectedElement(editor);
    $$('.panel').addClass('hide');
    $$('.show').forEach(element => element.click()); // הפעלת כפתורי ברירת המחדל בסוויצ'רים
    // $('fileUploadInput').files[0].name = 'site.html';
    // $('fileUploadInput').sendInput();
}

//  הפעלה מותנית של המערכת. ממתין עד שכל קבצי הפאנלים ייטענו ואז מפעיל את המערכת.
let timer = setInterval(() => {
    console.log(window.schemas);
    if (window.schemas) {
        clearInterval(timer);
        loadPage();
    }
}, 50)