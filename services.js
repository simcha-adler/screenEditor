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
    // אם אין סלקטור כזה בסטייט, אין מה להחזיר
    if (!styleState[selector] || !styleState[selector].rule) {
        return '';
    }
    // קריאה ישירה מהחוק החי
    return styleState[selector].rule.style[prop];
}

function updateStyle(selector, prop, value) {
    // אם אין עדיין חוק כזה, צור אותו ב-state ובתגית הסטייל, וקשר אותם.
    if (!styleState[selector]) {
        createRuleAndRef(selector);
    }

    let rule = styleState[selector]['rule'];
    if (rule) {
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
    const newId = createSafeId('', element.tagName);
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

/**
 * משכפל אלמנט ואת כל ילדיו, ומייצר להם IDs חדשים ותקינים.
 * @param {HTMLElement} original - האלמנט המקורי
 * @param {string} newId - השם (ID) החדש לאלמנט הראשי
 */
function cloneElementWithUniqueIds(original, newId) {
    // 1. שכפול עמוק של ה-DOM
    const clone = original.cloneNode(true);

    // 2. עדכון ה-ID של הראש
    clone.id = newId;

    // 3. עדכון רקורסיבי של IDs לכל הילדים
    // כדי למנוע התנגשות עם הילדים המקוריים
    const descendants = clone.$$('*');
    descendants.forEach(child => {
        if (child.id) {
            // יצירת ID חדש: "copy_" + המקורי + מספר אקראי
            child.id = child.id + '_ב' + newId;
        }
    });

    return clone;
}




/**
 * מפרק ערך CSS למספר וליחידה
 * למשל: "20px" -> { value: 20, unit: "px" }
 */
function parseUnit(cssValue, defaultUnit = 'px') {
    if (!cssValue) return { value: '', unit: defaultUnit };

    // אם זה "auto" או מילה אחרת
    if (isNaN(parseFloat(cssValue))) return { value: '', unit: defaultUnit };

    const value = parseFloat(cssValue);
    const unit = cssValue.replace(value, '').trim() || defaultUnit;
    return { value, unit };
}

/**
 * מייצר HTML עבור אינפוט חכם עם בחירת יחידות
 */
function createSmartInputHTML(prop, label, defaultUnit = 'px') {
    return /*html*/ `
    <div class="control-wrapper">
        <span class="input-label-small">${label}</span>
        <div class="smart-input-group">
            <input type="number" data-prop="${prop}" data-type="value" placeholder="-">
            <select class="unit-select" data-prop="${prop}" data-type="unit">
                <option value="px" ${defaultUnit === 'px' ? 'selected' : ''}>px</option>
                <option value="%" ${defaultUnit === '%' ? 'selected' : ''}>%</option>
                <option value="vh" ${defaultUnit === 'vh' ? 'selected' : ''}>vh</option>
                <option value="vw" ${defaultUnit === 'vw' ? 'selected' : ''}>vw</option>
                <option value="rem" ${defaultUnit === 'rem' ? 'selected' : ''}>rem</option>
                <option value="em" ${defaultUnit === 'em' ? 'selected' : ''}>em</option>
                <option value="" ${defaultUnit === '' ? 'selected' : ''}>-</option>
            </select>
        </div>
    </div>`;
}

// פונקציה לטיפול באקורדיונים
function initAccordions(panelElement) {
    const headers = panelElement.$$('.section-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.toggleClass('collapsed');
        });
    });
}




/*======לניסיון======*/

// --- ניהול הגדרות משתמש ---

function initUserSettings() {
    // 1. טעינה מ-LocalStorage
    const saved = localStorage.getItem('screenEditor_settings');
    if (saved) {
        try {
            // מיזוג ההגדרות השמורות עם ברירות המחדל (למקרה שהוספנו פיצ'רים חדשים)
            userSettings = { ...userSettings, ...JSON.parse(saved) };
        } catch (e) {
            console.error('שגיאה בטעינת הגדרות', e);
        }
    }

    // 2. החלת ההגדרות בפועל
    applyUserSettings();
}

function saveUserSettings() {
    localStorage.setItem('screenEditor_settings', JSON.stringify(userSettings));
}

function applyUserSettings() {
    const body = document.body;

    // --- יישום מצב כהה ---
    if (userSettings.theme === 'dark') {
        body.addClass('editor-dark-mode');
    } else {
        body.removeClass('editor-dark-mode');
    }

    // --- יישום גבולות עזר ---
    // מוסיף קלאס לקונטיינר של העורך
    const editorContainer = $('editor-downloader');
    if (userSettings.showOutlines) {
        editorContainer.addClass('show-outlines');
    } else {
        editorContainer.removeClass('show-outlines');
    }

    // --- יישום גודל ממשק ---
    // משנה את הזום של הממשק (לא של האתר הנערך!)
    // נשתמש במשתנה CSS לשליטה בגודל הפונט הבסיסי של הממשק
    document.documentElement.style.setProperty('--ui-scale', userSettings.uiScale / 100);
}
