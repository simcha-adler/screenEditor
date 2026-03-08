import { tree } from './tree.js'

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
        tree.utils.showChildren(rootLi);
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
        'draggable': 'true'
    });

    // יצירת התוכן הפנימי (Toggle + Text)
    const wrapper = createElement('div', { class: 'tree-life-wrapper' });

    const toggle = createElement('span', {
        class: 'tree-node-toggle',
        in: hasChildren ? '&#9664;' : ''
    });

    const life = createElement('div', { class: 'tree-life' });
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
    toggle.into(wrapper);
    content.into(life);
    menuBtn.into(life);
    life.into(wrapper);
    wrapper.into(li);

    return li;
}

export const build = {
    tree: renderTree,
    node: buildTreeDOM,
    life: createTreeNode
}