
function updatePanel(panelName) {

    if (!panelName) {
        thePanel = null;
        loadDefaultPanel();
        return;
    }
    if (thePanel === 'tree-panel') {
        closeTree();
    }
    if (panelName === 'tree-panel') {
        thePanel = 'tree-panel';
        loadPanelListeners(panelName);
        return;
    }
    const successfuly = loadPanel(panelName);
    if (successfuly) {
        thePanel = panelName;
        loadPanelListeners(panelName);
    }
}


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
    // אם לא התבצעה עריכה של הגבול, אחזר לאלמנט הנבחר הקודם את הגבול שהיה לו לפני סימון האלמנט   
    if (theElement) {
        if (getStyle(`#${theElement.id}`, 'border') === '1px solid black')
            updateStyle(`#${theElement.id}`, 'border', borderElement);
    }
    // עדכן את כל התוכנית שהאלמנט השתנה
    theElement = newElement;
    theStyles = window.getComputedStyle(newElement);
    restartPanel(thePanel);
    updateToolbarButtonStates();
    $('theElement').value = Id;
    // סמן את האלמנט הנבחר
    borderElement = getStyle(`#${Id}`, 'border');
    updateStyle(`#${Id}`, 'border', '1px solid black');
}

function loadPage() {
    loadDocumentListeners();
    updateSelectedElement(editor);
    updatePanel('');
}

loadPage();