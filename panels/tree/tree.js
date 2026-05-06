import { dual } from "./dualManager.js";
import { build } from "./treeBuilder.js";
import { menu } from "./treeMenu.js";


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



/*===========================
      אתחול מאזיני העץ 
=============================*/



function initTreeListeners() {

    /*----------------------------------------------------------
        לחיצה על שורה בעץ. טיפול מתאים לפי מיקום הלחיצה
    -------------------------------------------------------------*/

    treePanel.whenClick((/**@param {MouseEvent}*/e) => {
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
            tree.dual.select(node);
            return;
        }

        // מאזין לחיצה לפתיחת התפריט
        const menuBtn = e.upTo('.tree-node-menu-btn');
        if (menuBtn) {
            e.preventDefault();
            e.stopPropagation();
            const node = menuBtn.closest('.tree-node');
            // עדכון משתני הפעולה הגלובליים
            if (node !== tree.actionTree && SelectorLock.getState()) return;
            tree.dual.select(node);
            // פתיחת התפריט במיקום הכפתור
            if (node.dataset.editorId === 'דף_הבסיס')
                hideItemsNotForEditor();
            else
                showItemsNotForEditor();
            popoverPosition($('tree-menu'), e.pageX, e.pageY);
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
            tree.dual.add(tree.actionTree, parent, true);
            updateHasChildren(preParent);

            // ניקוי
            cleanDragClasses();
        }
    });

    treePanel.when('dragend', (e) => {
        cleanDragClasses();
    });
}


/*======================================
        פונקציות עזר קטנות
========================================*/

export function showChildren(parentTree) {
    parentTree.addClass('open');
    parentTree.$1('.tree-node-toggle').innerHTML = '&#9660;';
}

export function hideChildren(parentTree) {
    parentTree.removeClass('open');
    parentTree.$1('.tree-node-toggle').innerHTML = '&#9664;';
}

function updateHasChildren(node, del = false) {
    const list = node.$1('ul');
    if (!list) return;
    if (list.children.length === 0 || del) {
        list.remove();
        node.$1('.tree-node-toggle').innerHTML = '';
    }
}

export function hideItemsNotForEditor() {
    $('tree-menu').$$('.not-for-editor').forEach(row => row.addClass('d-none'));
}

export function showItemsNotForEditor() {
    $('tree-menu').$$('.not-for-editor').forEach(row => row.removeClass('d-none'));
}

function cleanDragClasses() {
    $$('.tree-node').removeClass('dragging').removeClass('drag-over');
}


export const tree = {

    // משתנים גלובליים לניהול
    draggable: false,
    actionTree: null, // אלמנט העץ הפעיל
    actionDom: null, // אלמנט ה-dom הפעיל

    init: () => {
        tree.build.tree();
        initTreeListeners();
        tree.dual.select(treePanel.$1('[data-editor-id="דף_הבסיס"]'))
    },

    menu: menu,
    build: build,
    utils: {
        insertNode: appendNodeToTree,
        showChildren,
        hideChildren,
        showItemsNotForEditor,
        hideItemsNotForEditor,
        cleanDragClasses,
        updateHasChildren
    },
    dual: dual
}

window.tree = tree;