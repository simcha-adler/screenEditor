// ------------------------------------
// 2. פונקציות עזר
// ------------------------------------

function rgbToHex(rgb) {
    if (!rgb || rgb.startsWith('#')) return rgb;
    // טיפול בערך ברירת מחדל 'transparent' או 'rgba(0, 0, 0, 0)'
    if (rgb.includes('0, 0, 0, 0') || rgb === 'transparent') {
        // עבור input[type=color], שקוף אינו ערך חוקי. נחזיר שחור או לבן.
        return '#000000';
    }

    let match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return '#000000';

    function hex(c) {
        return ("0" + parseInt(c).toString(16)).slice(-2);
    }
    return "#" + hex(match[1]) + hex(match[2]) + hex(match[3]);
}


function getSelectedElement() {
    const selection = window.getSelection();

    // 1. אם אין בחירה, החזר את העורך
    if (selection.rangeCount === 0) {
        return editor;
    }

    const range = selection.getRangeAt(0);
    let element = range.startContainer;

    // 2. אם התחלנו מצומת טקסט, עלה להורה שלו (האלמנט)
    if (element.nodeType === Node.TEXT_NODE) {
        element = element.parentNode;
    }

    let tag = element.tagName;
    while (tag === 'B' || tag === 'I' || tag === 'U') {
        element = element.parentNode;
        tag = element.tagName;
    }

    // 3. בדיקת אבטחה פשוטה: אם האלמנט מחוץ לעורך, החזר את העורך
    if (!editor.contains(element)) {
        return editor;
    }

    // 4. החזר את האלמנט הספציפי שהסמן התחיל בו.
    return element;
}

function getStyle(selector, prop) {
    let theRule;
    for (const rule of sheet.cssRules) {
        if (rule.selectorText === selector) {
            theRule = rule; // מצאנו! החזר את החוק הקיים
        }
    }
    if (!theRule)
        return '';
    return theRule.style[prop];
}

function updateStyle(selector, prop, value) {
    // קבל את החוק (הקיים או החדש)
    const rule = getOrCreateRule(selector);

    if (rule) {
        // שנה את הסגנון של החוק!
        // אנו משתמשים ב- bracket notation כי 'prop' הוא משתנה
        rule.style[prop] = value;
    }
}

/**
 * מקבל סלקטור (כמו '#my-id:hover')
 * ומחזיר את אובייקט ה-CSSRule התואם.
 * אם החוק לא קיים, יוצר אותו ומחזיר אותו.
 */
function getOrCreateRule(selector) {

    // 1. חפש חוק קיים
    for (const rule of sheet.cssRules) {
        if (rule.selectorText === selector) {
            return rule; // מצאנו! החזר את החוק הקיים
        }
    }

    // 2. אם הלולאה הסתיימה, החוק לא קיים. צור חוק חדש (וריק).
    try {
        // '0' מוסיף את החוק להתחלה (חשוב לעדיפות)
        sheet.insertRule(`${selector} {}`, 0);
        return sheet.cssRules[0]; // החזר את החוק החדש שנוצר
    } catch (e) {
        console.error("שגיאה ביצירת חוק CSS:", e, selector);
        return null;
    }
}

/**
 * מוודא שלאלמנט נתון יש ID ייחודי.
 * אם אין לו, יוצר עבורו ID ומחזיר אותו.
 */
function ensureElementId(element) {
    if (element.id) {
        return element.id;
    }
    // אם האלמנט הוא העורך עצמו (שורש)
    if (element === editor) {
        element.id = 'editor-root'; // או כל ID קבוע אחר לשורש
        return element.id;
    }
    // יצירת ID ייחודי
    const newId = 'editor-el-' + Math.random().toString(36).substring(2, 9);
    element.id = newId;
    return newId;
}

function applyEditorCommand(command, value = null) {
    editor.focus();
    try {
        document.execCommand(command, false, value);
    } catch (error) {
        console.error(`Error executing command: ${command}`, error);
    }
}

function changeBlockTag(newTag) {
    const element = getSelectedElement();
    const blockElement = element.closest('p, h1, h2, h3, h4, h5, h6, pre, div');

    if (blockElement && editor.contains(blockElement) && blockElement.tagName.toLowerCase() !== newTag) {
        const newBlock = document.createElement(newTag);
        newBlock.id = blockElement.id;
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

        updateSelectedElement(newBlock);
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
