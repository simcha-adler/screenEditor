
// משתנים גלובליים לניהול הגרירה והתפריט
let draggable = false;
let actionTree = null; // האלמנט שנגרר
let actionDom = null; // אלמנט ה-dom המקביל לנגרר

/*============================
          קוד חדש
=============================*/


function buildTreeDOM(element) {
    // סינון אלמנטים לא רצויים (כמו בקוד המקורי)
    if (element.nodeType !== 1 || ['SCRIPT', 'STYLE'].includes(element.tagName))
        return null;

    // 1. יצירת הצומת הנוכחי
    const li = createTreeNode(element);

    // 2. אם יש ילדים - בנייה רקורסיבית
    if (element.children.length > 0) {
        const ul = createElement('ul', { class: 'tree-children' });

        Array.from(element.children).forEach(child => {
            const childLi = buildTreeDOM(child);
            if (childLi) childLi.into(ul);
        });

        ul.into(li);
    }

    return li;
}

// הפונקציה הראשית שנקראת מבחוץ
function renderTree() {
    // ניקוי העץ
    tree.innerHTML = '';

    // יצירת העץ והכנסתו
    const ulRoot = createElement('ul', { style: 'padding: 10px; margin: 0;' });
    const rootLi = buildTreeDOM(editor); // מתחילים מהעורך

    if (rootLi) {
        rootLi.into(ulRoot);
        // פתיחת רמת השורש כברירת מחדל
        rootLi.addClass('open');
        const toggle = rootLi.$1('.tree-node-toggle');
        if (toggle) toggle.innerHTML = '&#9660;';
    }

    ulRoot.into(tree);
}


/**
 * יצירת אלמנט ה-LI לעץ (ללא הכנסה לעץ)
 */
function createTreeNode(realElement) {
    const id = ensureElementId(realElement);
    const hasChildren = realElement.children.length > 0;

    // קביעת השם לתצוגה
    let displayName = id.replaceAll("_", " ");
    if (id.startsWith('auto-')) {
        displayName = `<span style="opacity:0.8">${realElement.tagName.toLowerCase()}</span>`;
    }

    // יצירת ה-LI
    const li = createElement('li', {
        class: 'tree-node',
        attrs: {
            'data-editor-id': id,
            'draggable': 'true'
        }
    });

    // יצירת התוכן הפנימי (Toggle + Text)
    const container = createElement('div', { class: 'tree-life' });

    const toggle = createElement('span', {
        class: 'tree-node-toggle',
        in: hasChildren ? '&#9664;' : ''
    });

    const content = createElement('span', {
        class: 'tree-node-content',
        in: displayName
    });

    // === חדש: כפתור התפריט ===
    const menuBtn = createElement('span', {
        class: 'tree-node-menu-btn',
        text: '⋮', // תו של שלוש נקודות אנכיות
        attrs: { title: 'פעולות נוספות' }
    });

    // חיבור פנימי
    toggle.into(li);
    content.into(container);
    menuBtn.into(container);
    container.into(li);

    return li;
}


/**
 * הכנסת האלמנט לעץ במקום הנכון
 * מטפל גם ביצירת ה-UL להורה אם צריך
 */
function appendNodeToTree(newNode, parent) {
    // הגנה: אם ההורה לא בעץ (למשל אם זה ה-Editor הראשי, מוסיפים לשורש)
    if (!parent || !newNode) {
        return;
    }

    // בדיקה אם להורה כבר יש רשימת ילדים (UL)
    let ul = parent.$1('ul.tree-children');
    if (!ul) {
        ul = createElement('ul', { class: 'tree-children' });
        ul.into(parent);

        // עדכון אייקון ההורה
        const toggle = parent.$1('.tree-node-toggle');
        if (toggle) toggle.innerHTML = '&#9660;'; // חץ למטה
        parent.addClass('open');
    }

    // הפעולה הסופית - הכנסה (או העברה אם כבר קיים)
    newNode.into(ul);
}


/*====== עד כאן קוד חדש =====*/

// === 2. מאזינים ראשיים (Event Delegation) ===
// פונקציה זו נקראת פעם אחת בלבד בהטענת הדף!
function initGlobalTreeListeners() {

    /*----------------------------------------------------------
        לחיצה על שורה בעץ. טיפול מתאים לפי מיקום הלחיצה
    -------------------------------------------------------------*/

    tree.whenClick((e) => {
        // טיפול בפתיחה/סגירה (החץ)
        const toggleBtn = e.upTo('.tree-node-toggle');
        if (toggleBtn) {
            const node = toggleBtn.closest('.tree-node');
            let icon = toggleBtn.innerText;
            if (icon)
                if (icon === '▼') /* תפריט ילדים פתוח */
                    hideChildren(node);
                else
                    showChildren(node);
            return;
        }

        // טיפול בבחירת אלמנט
        const contentSpan = e.upTo('.tree-node-content');
        if (contentSpan) {
            const node = contentSpan.closest('.tree-node');
            const id = node.dataset.editorId;
            updateSelectedElement($(id));

            // סימון ויזואלי בעץ
            $$('.tree-life').removeClass('selected');
            node.$1('.tree-life').addClass('selected');
            return;
        }

        // מאזין לחיצה לפתיחת התפריט
        const menuBtn = e.upTo('.tree-node-menu-btn');
        if (menuBtn) {
            e.preventDefault();
            e.stopPropagation();
            const node = menuBtn.closest('.tree-node');
            // עדכון משתני הפעולה הגלובליים
            actionTarget = node;
            actionDom = $(node.dataset.editorId);
            updateSelectedElement(actionDom);

            // פתיחת התפריט במיקום הכפתור
            // ליצור תפריט קבוע, להוסיף לו רוקן אלמנט,
            // אם נשלח אדיטור, להסתיר את מחק והוסף אחרי
            if (node.dataset.editorId === 'דף_הבסיס')
                editorMenu();/*לא קיים */
            else
                showContextMenu(e.pageX, e.pageY);
        }
    });


    //========אירועי גרירה (Drag & Drop)==========

    $('toggle-lock-drag').when('change', function () {
        if (this.checked) {
            draggable = true;
            treeContainer.addClass('drag-mode');
        } else {
            draggable = false;
            treeContainer.removeClass('drag-mode');
        };
    });

    tree.when('dragstart', (e) => {
        if (draggable) {
            const node = e.upTo('.tree-node');

            if (!node || node === $('.tree-node[data-editor-id="דף הבסיס"]')) {
                e.preventDefault();
                return;
            }

            actionTree = node;
            e.dataTransfer.effectAllowed = 'move';

            setTimeout(() => node.addClass('dragging'), 0);
        }
    });

    tree.when('dragover', (e) => {
        if (draggable) {
            e.preventDefault(); // חובה כדי לאפשר Drop!

            const targetTree = e.upTo('.tree-node');
            if (targetTree && targetTree !== actionTree) {
                // ניקוי סימונים קודמים
                $$('.tree-node').removeClass('drag-over');
                targetTree.addClass('drag-over');
            }
        }
    });

    tree.when('drop', (e) => {
        if (draggable) {
            e.preventDefault();
            e.stopPropagation();

            const parentTree = e.upTo('.tree-node');
            const listContainer = actionTree.parentNode;

            // אם שחררנו במקום לא חוקי או על עצמנו
            if (!parentTree || (parentTree === actionTree)) return;

            insertElementManeger(actionTree, parentTree);
            updateHasChildren(listContainer);

            // ניקוי
            cleanDragClasses();
        }
    });

    tree.when('dragend', (e) => {
        cleanDragClasses();
    });
}

function cleanDragClasses() {
    $$('.tree-node').removeClass('dragging').removeClass('drag-over');
}


// === 3. לוגיקת תפריט והזזה בפועל ===

function showContextMenu(x, y) {
    let menu = $('tree-menu');
    // יצירת התפריט אם לא קיים
    if (!menu) {
        menu = document.createElement('div');
        menu.id = 'tree-menu';
        menu.innerHTML = `
            <div class="tree-menu-item" onclick="handleMenuAction('add-inside')"><span>↳</span> הוסף בתוך</div>
            <div class="tree-menu-item" onclick="handleMenuAction('add-after')"><span></span> הוסף אחרי</div>
            <div style="height: 1px; background: #eee; margin: 3px 0;"></div>
            <div class="tree-menu-item" onclick="handleMenuAction('delete')" style="color: red;"><span>🗑️</span> מחק</div>
            <div class="tree-menu-item" onclick="handleMenuAction('empty')" style="color: red;"><span>🗑️</span> רוקן תוכן</div>
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
    if (!action) return;

    if (action === 'add-inside') {
        updateSelectedElement(actionTarget);
        toggleActivityPanel('panel-add');
    }
    else if (action === 'add-after') {
        updateSelectedElement(actionTarget.parentElement);
        toggleActivityPanel('panel-add');
    }
    else if (action === 'delete') {
        let del = false;
        if (actionDom.children.length === 0) {
            del = confirm('למחוק את האלמנט?');
        } else {
            del = confirm('למחוק את האלמנט ואת כל האלמנטים שבו?');
        }
        if (del) {
            const parentList = actionTree.parentNode;
            actionTree.remove();
            actionDom.remove();
            actionTree = null;
            actionDom = null;
            updateHasChildren(parentList);
            updateSelectedElement(null); // איפוס בחירה
        }
    }
};


function insertElementManeger(nodeTree, parentTree, nodeDom = null, parentDom = null) {
    if (!nodeTree || !parentTree || nodeTree === parentTree) return;

    if (!nodeDom) nodeDom = $(nodeTree.dataset.editorId);
    if (!parentDom) parentDom = $(parentTree.dataset.editorId);

    //  אם אלמנט האב אינו יכול להכיל אלמנטים בתוכו, עבור לאלמנט האב באישור המשתמש
    const voidElements = ['IMG', 'INPUT', 'HR', 'BR'];
    if (voidElements.includes(parentDom.tagName))
        if (confirm("אין אפשרות להכניס בתוך האלמנט הנבחר. להכניס אחריו?")) {
            parentDom = parentDom.parentNode;
            parentTree = parentTree.parentNode.parentNode;
        } else return;

    // מניעת לולאות (הכנסת אבא לבן)
    if (nodeDom.contains(parentDom))
        return alert('שגיאה: לא ניתן להכניס אלמנט לתוך עצמו.');

    // הכנסה בפועל ל-dom ולעץ
    nodeDom.into(parentDom);
    appendNodeToTree(nodeTree, parentTree);

    // פתיחת ההורה החדש כדי שנראה את הילד שהתווסף
    setTimeout(showChildren(parentTree), 50);
}

function showChildren(parentTree) {
    parentTree.addClass('open');
    parentTree.$1('.tree-node-toggle').innerHTML = '&#9660;';
}

function hideChildren(parentTree) {
    parentTree.removeClass('open');
    parentTree.$1('.tree-node-toggle').innerHTML = '&#9664;';
}

function updateHasChildren(list) {
    if (list.children.length === 0) {
        const parent = list.parentNode;
        list.remove();
        parent.$1('.tree-node-toggle').innerHTML = '';
    }
}