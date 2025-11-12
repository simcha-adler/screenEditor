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

    // 3. בדיקת אבטחה פשוטה: אם האלמנט מחוץ לעורך, החזר את העורך
    if (!editor.contains(element)) {
        return editor;
    }

    // 4. החזר את האלמנט הספציפי שהסמן התחיל בו.
    return element;
}


function applyEditorCommand(command, value = null) {
    editor.focus();
    try {
        document.execCommand(command, false, value);
    } catch (error) {
        console.error(`Error executing command: ${command}`, error);
    }
}