
/*=======================================
            פונקציות לבניית עץ
=========================================*/


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
    treePanel.innerHTML = '';

    // יצירת העץ והכנסתו
    const ulRoot = createElement('ul', { style: 'padding: 10px; margin: 0;' });
    const rootLi = buildTreeDOM(editor); // מתחילים מהעורך

    if (rootLi) {
        rootLi.into(ulRoot);
        // פתיחת רמת השורש כברירת מחדל
        showChildren(rootLi);
    }

    ulRoot.into(treePanel);
}


/**
 * יצירת אלמנט ה-LI לעץ (ללא הכנסה לעץ)
 */
function createTreeNode(realElement) {
    const id = ensureElementId(realElement);
    const hasChildren = realElement.children.length > 0;

    // קביעת השם לתצוגה
    let displayName = id.replaceAll("_", " ");
    if (id.startsWith('auto_')) {
        displayName = `<span style="opacity:0.8">${realElement.tagName.toLowerCase()}</span>`;
    }

    // יצירת ה-LI
    const li = createElement('li', {
        class: 'tree-node',
        'data-editor-id': id,
        'tree.draggable': 'true'
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

    // === כפתור התפריט ===
    const menuBtn = createElement('span', {
        class: 'tree-node-menu-btn',
        text: '⋮', // תו של שלוש נקודות אנכיות
        title: 'פעולות נוספות'
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
    if (!parent || !newNode) {
        return;
    }

    // בדיקה אם להורה כבר יש רשימת ילדים (UL)
    let ul = parent.$1('ul.tree-children');
    if (!ul) {
        ul = createElement('ul', { class: 'tree-children' });
        ul.into(parent);
    }

    // הפעולה הסופית - הכנסה (או העברה אם כבר קיים)
    newNode.into(ul);
}


/*====================================================
        פונקציות לניהול מקביל של העץ וה-dom
======================================================*/



function selectTreeNode(node) {
    const src = $(node.dataset.editorId);
    updateSelectedElement(src);

    // עדכון משתנים גלובליים
    tree.actionTree = node;
    tree.actionDom = src;

    // סימון ויזואלי בעץ
    $$('.tree-life').removeClass('selected');
    node.$1('.tree-life').addClass('selected');
}

function insertElementManager(node, parent, isTree) {
    if (!node || !parent || node === parent) return;
    let nodeTree, parentTree, nodeDom, parentDom;
    if (isTree) {
        nodeTree = node;
        parentTree = parent;
        nodeDom = $(nodeTree.dataset.editorId);
        parentDom = $(parentTree.dataset.editorId);
    } else {
        nodeTree = treePanel.$1(`.tree-node[data-editor-id=${node.id}]`);
        parentTree = treePanel.$1(`.tree-node[data-editor-id=${parent.id}]`);
        nodeDom = node;
        parentDom = parent;
        if (!nodeTree) nodeTree = buildTreeDOM(nodeDom);
    }

    //  אם אלמנט האב אינו יכול להכיל אלמנטים בתוכו, עבור לאלמנט האב באישור המשתמש
    const voidElements = ['IMG', 'INPUT', 'HR', 'BR', 'VIDEO'];
    if (voidElements.includes(parentDom.tagName))
        if (confirm("אין אפשרות להכניס בתוך האלמנט הנבחר. להכניס אחריו?")) {
            parentDom = parentDom.parentNode;
            parentTree = parentTree.parentNode.closest('.tree-node');
        } else return;

    // מניעת לולאות (הכנסת אבא לבן)
    if (nodeDom.contains(parentDom))
        return alert('שגיאה: לא ניתן להכניס אלמנט לתוך עצמו.');

    // הכנסה בפועל ל-dom ולעץ
    nodeDom.into(parentDom);
    appendNodeToTree(nodeTree, parentTree);

    // פתיחת ההורה החדש כדי שנראה את הילד שהתווסף, כולל גם את הוספת אייקון החץ.
    setTimeout(showChildren(parentTree), 50);
    tree.sincDo.select(nodeTree);
}

function removeElementManager() {
    let del = false;
    if (tree.actionDom.children.length === 0) {
        del = confirm('למחוק את האלמנט?');
    } else {
        del = confirm('למחוק את האלמנט ואת כל האלמנטים שבו?');
    }
    if (del) {
        const parent = tree.actionTree.closest('.tree-node');
        tree.actionTree.remove();
        tree.actionDom.remove();
        tree.actionTree = null;
        tree.actionDom = null;
        updateHasChildren(parent);
        updateSelectedElement(null); // איפוס בחירה
    }
}

function duplicateElementManager() {
    let newName = prompt('הכנס שם לאלמנט המשוכפל (מומלץ). השאר ריק ליצירה אוטומטית', tree.actionDom.id.replaceAll('_', ' ') + '_copy');
    if (newName || newName === '') {
        newName = createSafeId(newName, tree.actionDom.tagName);
        if (!newName) return; // שם כפול!
        // שימוש בפונקציית השכפול החכמה מ-servises.js
        const newClone = cloneElementWithUniqueIds(tree.actionDom, newName);

        if (newClone) {
            // הוספה ל-DOM אחרי המקורי
            tree.actionDom.after(newClone);
            // יצירת השורות המקבילות בעץ
            const newTreeItem = buildTreeDOM(newClone);
            // הוספה לעץ אחרי המקורי
            if (tree.actionTree)
                tree.actionTree.after(newTreeItem);
            // עדכון בחירה
            updateSelectedElement(newClone);
        }
    }
}



/*===========================
      אתחול מאזיני העץ 
=============================*/



function initTreeListeners() {

    /*----------------------------------------------------------
        לחיצה על שורה בעץ. טיפול מתאים לפי מיקום הלחיצה
    -------------------------------------------------------------*/

    treePanel.whenClick((e) => {
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
            tree.sincDo.select(node);
            return;
        }

        // מאזין לחיצה לפתיחת התפריט
        const menuBtn = e.upTo('.tree-node-menu-btn');
        if (menuBtn) {
            e.preventDefault();
            e.stopPropagation();
            const node = menuBtn.closest('.tree-node');
            // עדכון משתני הפעולה הגלובליים
            tree.sincDo.select(node);
            // פתיחת התפריט במיקום הכפתור
            if (node.dataset.editorId === 'דף_הבסיס')
                hideItemsNotForEditor();
            else
                showItemsNotForEditor();
            tree.menu.show(e.pageX, e.pageY);
        }
    });

    // ===== מאזין לפקודות התפריט הנפתח ===== */
    $('tree-menu').whenClick((e) => {
        const btn = e.upTo('.tree-menu-item');
        if (btn) {
            const action = btn.dataset.action;
            tree.menu.router(action);
        }
    });


    /*---------------------------------------------
          מאזין לאירועי גרירה (Drag & Drop)
    -----------------------------------------------*/

    // ======== שחרור הנעילה ======
    $('toggle-lock-drag').when('change', function () {
        if (this.checked) {
            tree.draggable = true;
            treePanel.addClass('drag-mode');
        } else {
            tree.draggable = false;
            treePanel.removeClass('drag-mode');
        };
    });

    // ======== תחילת גרירה =========
    treePanel.when('dragstart', (e) => {
        if (tree.draggable) {
            const node = e.upTo('.tree-node');

            if (!node || node === $1('.tree-node[data-editor-id="דף הבסיס"]')) {
                e.preventDefault();
                return;
            }

            tree.actionTree = node;
            e.dataTransfer.effectAllowed = 'move';

            setTimeout(() => node.addClass('dragging'), 0);
        }
    });

    // ======== תהליך הגרירה ==========
    treePanel.when('dragover', (e) => {
        if (tree.draggable) {
            e.preventDefault(); // חובה כדי לאפשר Drop!

            const targetTree = e.upTo('.tree-node');
            if (targetTree && targetTree !== tree.actionTree) {
                // ניקוי סימונים קודמים
                $$('.tree-node').removeClass('drag-over');
                targetTree.addClass('drag-over');
            }
        }
    });

    // ======== שחרור ==========
    treePanel.when('drop', (e) => {
        if (tree.draggable) {
            e.preventDefault();
            e.stopPropagation();

            const parent = e.upTo('.tree-node');

            // אם שחררנו במקום לא חוקי או על עצמנו
            if (!parent || (parent === tree.actionTree)) return;

            const preParent = tree.actionTree.parentNode.closest('.tree-node');
            tree.sincDo.add(tree.actionTree, parent, true);
            updateHasChildren(preParent);

            // ניקוי
            cleanDragClasses();
        }
    });

    treePanel.when('dragend', (e) => {
        cleanDragClasses();
    });
}



/*=============================================
        תצוגת וניהול פעולות התפריט הנפתח
===============================================*/


function showContextMenu(x, y) {
    const menu = $('tree-menu');

    menu.removeClass('hide');
    menu.style.left = (x - 150) + 'px';
    menu.style.top = y + 'px';
}

function hideContextMenu() {
    $('tree-menu').addClass('hide');
}

// פונקציה גלובלית לטיפול בפעולות התפריט
function handleMenuAction(action) {
    if (!action) return;

    switch (action) {
        case 'add-inside':
            toggleActivityPanel($1('.activity-btn[data-panel="panel-add-element"]'));
            break;

        case 'add-after':
            // לסדר, כי עכשיו זה מוסיף לסוף האבא ולא אחרי הנבחר
            updateSelectedElement(tree.actionDom.parentElement);
            toggleActivityPanel($1('.activity-btn[data-panel="panel-add-element"]'));
            break;

        case 'delete':
            tree.sincDo.delete();
            break;

        case 'empty':
            if (confirm('למחוק את כל האלמנטים שבתוך אלמנט זה?')) {
                $$(`#${tree.actionDom.id} *`).forEach(ch => ch.remove());
                updateHasChildren(tree.actionTree, true);
            }
            break;

        case 'duplicate':
            tree.sincDo.duplicate();
            break;

        case 'diagnostic':
            showDiagnosisUI(theElement);
            break;

        default:
            break;
    }
};


/*======================================
        פונקציות עזר קטנות
========================================*/

function showChildren(parentTree) {
    parentTree.addClass('open');
    parentTree.$1('.tree-node-toggle').innerHTML = '&#9660;';
}

function hideChildren(parentTree) {
    parentTree.removeClass('open');
    parentTree.$1('.tree-node-toggle').innerHTML = '&#9664;';
}

function updateHasChildren(node, empty = false) {
    const list = node.$1('ul');
    if (!list) return;
    if (empty || list.children.length === 0) {
        list.remove();
        node.$1('.tree-node-toggle').innerHTML = '';
    }
}

function hideItemsNotForEditor() {
    $('tree-menu').$$('.not-for-editor').forEach(row => row.addClass('hide'));
}

function showItemsNotForEditor() {
    $('tree-menu').$$('.not-for-editor').forEach(row => row.removeClass('hide'));
}

function cleanDragClasses() {
    $$('.tree-node').removeClass('dragging').removeClass('drag-over');
}


/*export*/ const tree = {

    // משתנים גלובליים לניהול
    draggable: false,
    actionTree: null, // אלמנט העץ הפעיל
    actionDom: null, // אלמנט ה-dom הפעיל

    init: () => {
        renderTree();
        initTreeListeners();
    },

    menu: {
        show: showContextMenu,
        hide: hideContextMenu,
        router: handleMenuAction,
    },
    build: {

    },
    sincDo: {
        select: selectTreeNode,
        add: insertElementManager,
        delete: removeElementManager,
        duplicate: duplicateElementManager
    }
}