
/**
 * מעדכן את המשתנים הרלוונטיים על זהות האלמנט הנבחר ותכונותיו
 * @param {HTMLElement | null} newElement
 */
function updateSelectedElement(newElement = null) {
    // כשהאלמנט נבחר מהעורך, לא נשלח ערך ומופעלת פונקציית מיקוד
    if (!newElement)
        newElement = getSelectedElement();
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

function createRuleAndRef(selector) {
    if (!styleState[selector]) {
        let rule;
        rule = Array.from(sheet.cssRules).find(r => r.selectorText === selector);
        if (!rule) rule = createRule(selector);
        styleState[selector] = { 'rule': rule };
        return rule;
    }
    return styleState[selector]['rule'];
}

function restartPage() {
    if (!confirm('הדף הנוכחי יימחק לחלוטין, ולא ניתן יהיה לשחזר אותו! האם אתם בטוחים? לשמירת הדף, ניתן להוריד אותו כ-html לפני האתחול.'))
        return false;

    // נקה את העורך הנוכחי
    $('דף_הבסיס').innerHTML = '';
    // נקה את ה-CSS ואת ה-State
    $('styles').innerHTML = '';
    sheet = $('styles').sheet; // רענון הרפרנס
    styleState = {}; // איפוס אובייקט המידע
    tree.build.tree();
    return true;
}

function createRefRule(rule) {
    const selector = rule.selectorText;
    if (!selector) return null;
    styleState[selector] = { 'rule': rule };
    return rule;
}

function loadPage() {
    // טעינת פאנלים
    build.panel('panel-display', viewSchema, designListeners);
    build.panel('panel-layout', layoutSchema, designListeners);
    build.panel('panel-design', designSchema, designListeners);
    build.panel('panel-borders', bordersSchema, designListeners);
    build.panel('panel-position', positionSchema, designListeners);
    build.panel('panel-animations', animationsSchema, designListeners);
    build.panel('panel-theme', themeSchema);
    build.panel('panel-add-element', addElementSchema);
    build.panel('panel-classes', classesSchema);
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


let timer = setInterval(() => {
    console.log(window.schemas);
    if (window.schemas) {
        clearInterval(timer);
        loadPage();
    }
}, 50)