/**
 * מאזין האירועים הראשי לזיהוי האלמנט הנבחר.
 */
document.addEventListener('selectionchange', () => {
    if (document.activeElement === editor || editor.contains(window.getSelection().anchorNode)) {
        updateSelectedElement();
        restartPanel(editPanel.firstChild.id)
    }
});


function changeBlockTag(newTag) {
    const element = getSelectedElement();
    const blockElement = element.closest('p, h1, h2, h3, h4, h5, h6, pre, div');

    if (blockElement && editor.contains(blockElement) && blockElement.tagName.toLowerCase() !== newTag) {
        const newBlock = document.createElement(newTag);
        newBlock.style.cssText = blockElement.style.cssText;

        while (blockElement.firstChild) {
            newBlock.appendChild(blockElement.firstChild);
        }

        blockElement.parentNode.replaceChild(newBlock, blockElement);

        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(newBlock);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);

        updateInspectorPanel(newBlock);
    }
}

function insertNodeAtCursor(node) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
        editor.appendChild(node);
        return;
    }
    const range = selection.getRangeAt(0);
    range.insertNode(node);

    range.setStartAfter(node);
    range.setEndAfter(node);
    selection.removeAllRanges();
    selection.addRange(range);
}


// --- לוגיקה חדשה לטיפול בפקדים בסרגל הצד (המפקח) ---
// מאזין 'input' פועל לרוב הפקדים (טקסט, מספר, צבע)
sidebar.when('input' || 'change', (e) => {
    if (!currentlyElement) return;

    const prop = e.target.dataset.styleProp;
    const unit = e.target.dataset.unit || ''; // למשל 'px'

    if (prop)
        currentlyElement.style[prop] = e.target.value + unit;
});

// מאזין 'change' פועל עבור <select>
/*sidebar.when('change', (e) => {
    if (!currentlyElement) return;

    const prop = e.target.dataset.styleProp;
    if (prop && e.target.tagName === 'SELECT') {
        currentlyElement.style[prop] = e.target.value;
    }
});*/


document.whenClick(closeNavs);

