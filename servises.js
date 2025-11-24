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
    if (styleState[selector] && styleState[selector][prop]) {
        return styleState[selector][prop];
    }
    return ''; // לא קיים ב-State
}


function updateStyle(selector, prop, value) {
    // --- 1. עדכון ה-State ---
    // אם אין עדיין חוק כזה, צור אותו ב-state ובתגית הסטייל, וקשר אותם.
    if (!styleState[selector]) {
        styleState[selector] = { 'rule': createRule(selector) };
    }
    // עדכן את הערך ב-State
    styleState[selector][prop] = value;

    // --- 2. עדכון ה-Sheet (המראה ב-DOM) ---
    let rule = styleState[selector]['rule'];

    if (rule) {
        // שנה את הסגנון של החוק
        rule.style[prop] = value;
    }
}

/**
 * מקבל סלקטור, יוצר אוביקט CSSRule תואם, ומחזיר אותו.
 */
function createRule(selector) {
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
    // יצירת ID ייחודי
    const newId = 'auto-' + element.tagName + '-' + Math.random().toString(36).substring(2, 9);
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


// שריד לגירסאות ישנות. לבדוק אם צריך בכלל, ולבנות בהתאם לארכיטקטורה החדשה
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
