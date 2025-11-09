// ------------------------------------
// 2. פונקציות עזר (צבע ו-Selection)
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
    if (selection.rangeCount === 0) {
        return editor;
    }
    const range = selection.getRangeAt(0);
    let element = range.startContainer;

    if (element.nodeType === Node.TEXT_NODE) {
        element = element.parentNode;
    }

    if (!editor.contains(element) || element === editor) {
        let block = range.startContainer.closest('p, h1, h2, h3, pre, div');
        return (block && editor.contains(block)) ? block : editor;
    }

    if (range.collapsed) {
        return element;
    }

    if (element.tagName === 'SPAN' && element.closest('#editor')) {
        return element;
    }

    let blockParent = element.closest('p, h1, h2, h3, pre, div');
    return (blockParent && editor.contains(blockParent)) ? blockParent : editor;
}

/**
 * מעדכן את המשתנים הרלוונטיים על זהות האלמנט הנבחר ותכונותיו
 */
function updateSelectedElement() {
    const element = getSelectedElement();
    if (!element) return;
    currentlyElement = element;
    styles = window.getComputedStyle(element);
}

function applyEditorCommand(command, value = null) {
    editor.focus();
    try {
        document.execCommand(command, false, value);
    } catch (error) {
        console.error(`Error executing command: ${command}`, error);
    }
}