
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
    restartPanel(thePanel);
    updateToolbarButtonStates();
    $('theElement').value = Id.replaceAll('_', ' ');
    // סמן את האלמנט הנבחר
    theElement.addClass('selected-element');
}

/**
 * טעינת התוכן לפאנל
 */
function updatePanel(panelName) {

    thePanel = panelName;
    updateActivityBarState(panelName); // עדכון האייקון בסרגל

    // טיפול מיוחד לעץ האלמנטים
    if (panelName === 'tree-panel') {
        treeContainer.style.display = 'block';
        editPanel.style.display = 'none';
        renderTree(); // פונקציה מ-tree.js
        return;
    }

    // עבור כל שאר הפאנלים (עיצוב, גבולות וכו')
    treeContainer.style.display = 'none';
    editPanel.style.display = 'block';

    const successfuly = loadPanel(panelName);
    if (!successfuly) {
        thePanel = '';
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