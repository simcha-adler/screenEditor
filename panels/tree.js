
// tree.js - ניהול העץ, קליק ימני וגרירה (גרסה יציבה)

// משתנים גלובליים לניהול הגרירה והתפריט
let dragSrcEl = null; // האלמנט שנגרר
let contextMenuTargetId = null; // ה-ID של האלמנט עליו לחצנו קליק ימני

// === 1. בניית העץ (HTML) ===
function buildTreeHTML(element) {
    // סינון אלמנטים לא רצויים
    if (element.nodeType !== 1 ||
        ['SCRIPT', 'STYLE'].includes(element.tagName) ||
        element.classList.contains('activity-bar') ||
        element.id === 'tree-context-menu') {
        return '';
    }

    const elementId = ensureElementId(element);
    const childrenHTML = Array.from(element.children).map(buildTreeHTML).join('');
    const hasChildren = element.children.length > 0;

    // draggable="false" כברירת מחדל. נשנה ל-true רק בפקודת "הזזה"
    let html = `
    <li class="tree-node ${hasChildren ? '' : 'no-children'}" 
        data-editor-id="${elementId}" 
        draggable="false">`;

    const toggleIcon = hasChildren ? '&#9664;' : '•';

    // מזהה קריא יותר
    let displayName = elementId;
    if (elementId.startsWith('auto-')) {
        displayName = `<span style="opacity:0.8">${element.tagName.toLowerCase()}</span>`;
    }

    html += `<div class="tree-row-wrapper">
                <span class="tree-toggle">${toggleIcon}</span>
                <span class="tree-node-content">${displayName}</span>
             </div>`;

    if (hasChildren) {
        html += `<ul class="tree-children">${childrenHTML}</ul>`;
    }
    html += `</li>`;
    return html;
}

function renderElementTree() {
    const treeHTML = buildTreeHTML(editor);
    treeContainer.innerHTML = `
        <h4 style="padding: 10px; margin: 0; border-bottom: 1px solid #eee; background:#fff; position:sticky; top:0;">מבנה המסמך</h4>
        <ul style="padding: 5px; margin: 0;">${treeHTML}</ul>`;
}

// === 2. מאזינים ראשיים (Event Delegation) ===
// פונקציה זו נקראת פעם אחת בלבד בהטענת הדף!
function initGlobalTreeListeners() {

    // -- קליק לבחירה ופתיחה --
    treeContainer.whenClick((e) => {
        // טיפול בפתיחה/סגירה (החץ)
        const toggleBtn = e.target.closest('.tree-toggle');
        if (toggleBtn) {
            const node = toggleBtn.closest('.tree-node');
            node.toggleClass('open');
            // עדכון אייקון
            if (node.$1('.tree-children')) {
                toggleBtn.innerHTML = node.classList.contains('open') ? '&#9660;' : '&#9664;';
            }
            return;
        }

        // טיפול בבחירת אלמנט
        const contentSpan = e.target.closest('.tree-node-content');
        if (contentSpan) {
            const node = contentSpan.closest('.tree-node');
            const id = node.dataset.editorId;
            updateSelectedElement($(id));

            // סימון ויזואלי בעץ
            $$('.tree-node-content').removeClass('selected');
            contentSpan.addClass('selected');
        }
    });

    // -- קליק ימני --
    treeContainer.when('contextmenu', (e) => {
        const node = e.target.closest('.tree-node');
        if (node) {
            e.preventDefault();
            contextMenuTargetId = node.dataset.editorId;
            showContextMenu(e.pageX, e.pageY);
        }
    });

    // -- אירועי גרירה (Drag & Drop) --

    treeContainer.when('dragstart', (e) => {
        const node = e.target.closest('.tree-node');
        // רק אם הופעל מצב גרירה ספציפית על האלמנט הזה
        if (!node || node.attr('draggable') !== 'true') {
            e.preventDefault();
            return;
        }

        dragSrcEl = node;
        e.dataTransfer.effectAllowed = 'move';
        // מעביר את ה-ID
        e.dataTransfer.setData('text/plain', node.dataset.editorId);

        setTimeout(() => node.classList.add('dragging'), 0);
    });

    treeContainer.when('dragover', (e) => {
        e.preventDefault(); // חובה כדי לאפשר Drop!

        const targetNode = e.target.closest('.tree-node');
        if (targetNode && targetNode !== dragSrcEl) {
            // ניקוי סימונים קודמים
            $$('.tree-node').removeClass('drag-over');
            targetNode.addClass('drag-over');
        }
    });

    treeContainer.when('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const destNode = e.target.closest('.tree-node');

        // אם שחררנו במקום לא חוקי או על עצמנו
        if (!destNode || (dragSrcEl && destNode === dragSrcEl)) return;

        const srcId = e.dataTransfer.getData('text/plain');
        const destId = destNode.dataset.editorId;

        executeMoveElement(srcId, destId);

        // ניקוי
        cleanDragClasses();
    });

    treeContainer.when('dragend', (e) => {
        cleanDragClasses();
    });
}

function cleanDragClasses() {
    $$('.tree-node').removeClass('dragging').removeClass('drag-over').removeClass('ready-to-drag');

    // איפוס הגרירה - נועלים את כולם חזרה
    if (dragSrcEl) {
        dragSrcEl.attr('draggable', 'false');
        dragSrcEl = null;
    }
}


// === 3. לוגיקת תפריט והזזה בפועל ===

function showContextMenu(x, y) {
    let menu = $('tree-context-menu');
    // יצירת התפריט אם לא קיים
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'tree-context-menu';
        menu.innerHTML = `
            <div class="ctx-menu-item" onclick="handleMenuAction('add-inside')"><span>↳</span> הוסף בתוך</div>
            <div class="ctx-menu-item" onclick="handleMenuAction('add-after')"><span></span> הוסף אחרי</div>
            <div class="ctx-menu-item" onclick="handleMenuAction('move')"><span>✋</span> הזזה (שחרר לגרירה)</div>
            <div style="height: 1px; background: #eee; margin: 3px 0;"></div>
            <div class="ctx-menu-item" onclick="handleMenuAction('delete')" style="color: red;"><span>🗑️</span> מחק</div>
        `;
        document.body.appendChild(menu);

        // סגירה כשלוחצים בחוץ
        document.whenClick(() => menu.style.display = 'none');
    }

    menu.style.display = 'block';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
}

// פונקציה גלובלית לטיפול בפעולות התפריט
window.handleMenuAction = function (action) {
    const targetEl = $(contextMenuTargetId);
    if (!targetEl) return;

    if (action === 'add-inside') {
        updateSelectedElement(targetEl);
        toggleActivityPanel('panel-add');
    }
    else if (action === 'add-after') {
        updateSelectedElement(targetEl.parentElement);
        toggleActivityPanel('panel-add');
    }
    else if (action === 'delete') {
        if (confirm('למחוק?')) {
            targetEl.remove();
            updateSelectedElement(null); // איפוס בחירה
            renderElementTree();
        }
    }
    else if (action === 'move') {
        // מציאת ה-Node בעץ
        const treeNode = treeContainer.$1(`.tree-node[data-editor-id="${contextMenuTargetId}"]`);
        if (treeNode) {
            treeNode.attr('draggable', 'true');
            treeNode.addClass('ready-to-drag');
            // הודעה קטנה למשתמש - אופציונלי
            // alert('האלמנט משוחרר! כעת ניתן לגרור אותו בעץ.');
        }
    }
};

function executeMoveElement(srcId, destId) {
    const domSrc = $(srcId);
    const domDest = $(destId);

    if (domSrc && domDest) {
        // מניעת לולאות (הכנסת אבא לבן)
        if (domSrc.contains(domDest)) {
            alert('שגיאה: לא ניתן להכניס אלמנט לתוך עצמו.');
            return;
        }

        // הזזה ב-DOM האמיתי
        domDest.appendChild(domSrc);

        // עדכון העץ שיראה את השינוי
        renderElementTree();

        // פתיחת ההורה החדש כדי שנראה את הילד שהתווסף
        setTimeout(() => {
            const newNode = treeContainer.$1(`.tree-node[data-editor-id="${destId}"]`);
            if (newNode) newNode.addClass('open');
            const toggle = newNode.$1('.tree-toggle');
            if (toggle) toggle.innerHTML = '&#9660;';
        }, 50);
    }
}


