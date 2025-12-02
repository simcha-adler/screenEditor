
/**
 * מעדכן את המשתנים הרלוונטיים על זהות האלמנט הנבחר ותכונותיו
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
    if (thePanel && thePanel !== panelTree)
        restartPanel(thePanel);
    updateToolbarButtonStates();
    $('theElement').value = Id.replaceAll('_', ' ');
    // סמן את האלמנט הנבחר
    theElement.addClass('selected-element');
}

/**
 * טעינת התוכן לפאנל
*/
function updatePanel(panel) {
    if (thePanel === panel) return;

    if (thePanel)
        thePanel.style.display = 'none';
    thePanel = panel;
    if (panel) {
        panel.style.display = 'block';
        // לבטל כשאסיר את טולבאר
        if (panel === panelTree)
            renderTree();
        else
            restartPanel(thePanel);
    }
}

function createRefRule(selector) {
    if (!styleState[selector]) {
        const rule = createRule(selector);
        styleState[selector] = { 'rule': rule };
        return rule;
    }
    return styleState[selector][rule];
}


function loadPage() {
    loadDocumentListeners();
    updateSelectedElement(editor);
    renderTree();
    initGlobalTreeListeners();
}

loadPage();