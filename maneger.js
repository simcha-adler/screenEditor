
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
    $('theElement').value = Id;
    // סמן את האלמנט הנבחר
    theElement.addClass('selected-element');
}

function updatePanel(panelName) {


    const successfuly = loadPanel(panelName);
    if (successfuly) {
        thePanel = panelName;
        loadPanelListeners(panelName);
    }
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
        renderElementTree(); // פונקציה מ-tree.js
        return;
    }

    // עבור כל שאר הפאנלים (עיצוב, גבולות וכו')
    treeContainer.style.display = 'none';
    editPanel.style.display = 'block';

    const successfuly = loadPanel(panelName);
    if (successfuly) {
        loadPanelListeners(panelName);
    } else {
        thePanel = '';
    }
}

function createRefRule(selector) {
    if (!styleState[selector]) {
        styleState[selector] = { 'rule': createRule(selector) };
    }
}

// אם נשאר כך שאין עיצובים באובייקט אלא רק הפניה - להעביר לסרוויסס
function updateStyle(selector, prop, value) {
    // --- 1. עדכון ה-State ---
    // אם אין עדיין חוק כזה, צור אותו ב-state ובתגית הסטייל, וקשר אותם.
    if (!styleState[selector]) {
        createRefRule(selector);
    }
    // עדכן את הערך ב-State
    //styleState[selector][prop] = value;

    // --- 2. עדכון ה-Sheet (המראה ב-DOM) ---
    let rule = styleState[selector]['rule'];

    if (rule) {
        // שנה את הסגנון של החוק
        rule.style[prop] = value;
    }
}

function loadPage() {
    loadDocumentListeners();
    updateSelectedElement(editor);
    renderElementTree();
    initGlobalTreeListeners();
}

loadPage();