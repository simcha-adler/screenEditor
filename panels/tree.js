
// החלף את התוכן של tree_maneger.js בזה:

// --- לוגיקה לבניית העץ ---
function buildTreeHTML(element) {
    if (element.nodeType !== 1 || element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
        return '';
    }

    const elementId = ensureElementId(element);

    const childrenHTML = Array.from(element.children).map(buildTreeHTML).join('');
    const hasChildren = element.children.length > 0;

    // השתמש ב-ID האמיתי ב-data
    let html = `<li class="tree-node ${hasChildren ? '' : 'no-children'}" data-editor-id="${elementId}">`;

    const toggleIcon = hasChildren ? '&#9664;' : ''; // חץ למטה
    html += `<span class="tree-toggle">${toggleIcon}</span>`;

    let displayName = elementId;
    html += `<span class="tree-node-content">${displayName}</span>`;

    if (hasChildren) {
        html += `<ul class="tree-children">${childrenHTML}</ul>`;
    }
    html += `</li>`;
    return html;
}

function renderElementTree() {
    const treeHTML = buildTreeHTML(editor); // השתמש ב-ID של העורך שהגדרנו
    treeContainer.innerHTML = `<h4>מבנה האלמנטים</h4><ul style="padding: 0;">${treeHTML}</ul>`;
}

// --- לוגיקה לפתיחה/סגירה ---
function closeTree() {
    treeContainer.style.display = 'none';
    editPanel.style.display = 'block';
    toggleTree.innerHTML = '&#127793;'; // אייקון עץ
    updatePanel(''); // חזור לפאנל ברירת מחדל
}

function openTree() {
    editPanel.style.display = 'none';
    treeContainer.style.display = 'block';
    toggleTree.innerHTML = '&#128193;'; // אייקון תיקייה
    updatePanel('tree-panel');
    renderElementTree(); // רענן את העץ בכל פעם
}

// --- מאזיני אירועים (החלק החשוב!) ---
treeContainer.whenClick((e) => {
    const nodeContent = e.target.closest('.tree-node-content');
    const toggleButton = e.target.closest('.tree-toggle');

    // 1. טיפול בלחיצה על תוכן ה-Node (בחירת אלמנט)
    if (nodeContent) {
        const node = nodeContent.closest('.tree-node');
        const elementId = node.dataset.editorId;

        if (elementId) {
            // בטל בחירה מכולם
            $$('.tree-node').forEach(n => n.removeClass('selected'));
            // סמן בעץ
            node.addClass('selected');

            // --- הנה החיבור ---
            // מצא את האלמנט האמיתי ב-DOM וקרא לפונקציה המרכזית
            const elementToSelect = $(elementId);
            if (elementToSelect) {
                updateSelectedElement(elementToSelect);
            }
        }
    }

    // 2. טיפול בלחיצה על כפתור הפתיחה/סגירה
    if (toggleButton) {
        const node = toggleButton.closest('.tree-node');
        const childrenList = node.$1('.tree-children');
        if (childrenList) {
            node.toggleClass('open');
            toggleButton.innerHTML = node.classList.contains('open') ? '&#9660;' : '&#9664;'; // חץ למטה/ימינה
        }
    }
});

toggleTree.whenClick(() => {
    if (thePanel === 'tree-panel') {
        closeTree();
    } else {
        openTree();
    }
});

