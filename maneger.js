
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
function updateSelectedElement(element = null) {
    // כשהאלמנט נבחר מהעורך, לא נשלח ערך ומופעלת פונקציית מיקוד
    if (!element)
        element = getSelectedElement();
    // אם האלמנט לא השתנה או שהוא מחוץ לעורך, חזור
    if (theElement === element ||
        (element !== 'editor' && !editor.contains(element))) return;
    // אם לא התבצעה עריכה של הגבול, אחזר לאלמנט הנבחר הקודם את הגבול שהיה לו לפני סימון האלמנט   
    if (theElement) {
        if (theElement.style.border === '1px solid black')
            theElement.style.border = borderElement;
    }
    // עדכן את כל התוכנית שהאלמנט השתנה
    theElement = element;
    theStyles = window.getComputedStyle(element);
    restartPanel(thePanel);
    updateToolbarButtonStates();
    $('theElement').value = theElement.id;
    // סמן את האלמנט הנבחר
    borderElement = theElement.style.border;
    theElement.style.border = '1px solid black';
}

function loadPage() {
    loadDocumentListeners();
    updateSelectedElement(editor);
    updatePanel('');
}

loadPage();