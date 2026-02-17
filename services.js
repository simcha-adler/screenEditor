
// ------------------------------------
// 2. פונקציות עזר
// ------------------------------------

/**
 * @param {string} rgb 
 * @returns {string}
 */
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
    if (!selection) return;
    // 1. אם אין בחירה, החזר את העורך
    if (selection.rangeCount === 0) {
        return editor;
    }

    const range = selection.getRangeAt(0);

    /** @type {any} */
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

/**
 * @param {string} selector 
 * @param {string} prop 
 * @returns {string}
 */
function getStyle(selector, prop) {
    // אם אין סלקטור כזה בסטייט, אין מה להחזיר
    if (!styleState[selector] || !styleState[selector].rule) {
        return '';
    }

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
 * @param {HTMLElement} element
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

/**
 * @param {string} command 
 * @param {string | undefined} value 
 */

function applyEditorCommand(command, value = undefined) {
    editor.focus();
    try {
        document.execCommand(command, false, value);
    } catch (error) {
        console.error(`Error executing command: ${command}`, error);
    }
}

/**
 * משכפל אלמנט ואת כל ילדיו, ומייצר להם IDs חדשים ותקינים.
 * @param {HTMLElement} original - האלמנט המקורי
 * @param {string} newId - השם (ID) החדש לאלמנט הראשי
 */
function cloneElementWithUniqueIds(original, newId) {
    // 1. שכפול עמוק של ה-DOM
    /**@type {any} */
    const clone = original.cloneNode(true);

    // 2. עדכון ה-ID של הראש
    clone.id = newId;

    // 3. עדכון רקורסיבי של IDs לכל הילדים
    // כדי למנוע התנגשות עם הילדים המקוריים
    const descendants = clone.$$('*');
    descendants.forEach(child => {
        if (child.id) {
            child.id = newId + '_>_' + child.id;
        }
    });

    return clone;
}




/**
 * מפרק ערך CSS למספר וליחידה
 * למשל: "20px" -> { value: 20, unit: "px" }
 */
function parseUnit(cssValue) {
    if (!cssValue) return { value: '', unit: '' };
    cssValue = cssValue.trim();

    const floatVal = parseFloat(cssValue);

    // אם זה לא מספר (למשל "auto", "block"), מחזירים את הכל כ-value
    if (isNaN(floatVal)) return { value: '', unit: cssValue };

    // מציאת היחידה ע"י הסרת המספר מתוך המחרוזת המקורית
    const unit = cssValue.replace(floatVal.toString(), '');

    return { value: floatVal, unit: unit }; // בלי ברירת מחדל של 'px'!
}

/**
 * מייצר HTML עבור אינפוט חכם עם בחירת יחידות
 */
function createInputHTML(prop, label, defaultUnit = 'px') {
    return /*html*/ `
    <div class="control-wrapper">
        <span class="ui-title small">${label}</span>
        <div class="ui-input-group">
            <input type="number" data-prop="${prop}" data-type="value" placeholder="-">
            <select class="ui-select" data-prop="${prop}" data-type="unit">
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
    const headers = panelElement.$$('.ui-section-head');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.toggleClass('collapsed');
        });
    });
}







/*==========חדש לניסיון=======*/

const Color = {
    // המרה והרחבה של פונקציות קיימות
    hexToRgb: (hex) => {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    rgbToHex: (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    // ערבוב שני צבעים לפי אחוז (0-100)
    mixColors: (color1, color2, percentage) => {
        const c1 = Color.hexToRgb(color1);
        const c2 = Color.hexToRgb(color2);
        const p = percentage / 100;

        const r = Math.round(c1.r * (1 - p) + c2.r * p);
        const g = Math.round(c1.g * (1 - p) + c2.g * p);
        const b = Math.round(c1.b * (1 - p) + c2.b * p);

        return Color.rgbToHex(r, g, b);
    },

    // יצירת CSS גרדיאנט דינמי לסליידרים (דרישה א')
    generateLiveHwbGradient: (channel, currentH, currentW, currentB) => {
        if (channel === 'h') {
            // Hue תמיד צבעוני, אבל מושפע מ-W ו-B הנוכחיים
            return `linear-gradient(to right, 
                hwb(0 ${currentW}% ${currentB}%), hwb(60 ${currentW}% ${currentB}%), 
                hwb(120 ${currentW}% ${currentB}%), hwb(180 ${currentW}% ${currentB}%), 
                hwb(240 ${currentW}% ${currentB}%), hwb(300 ${currentW}% ${currentB}%), 
                hwb(360 ${currentW}% ${currentB}%))`;
        }
        if (channel === 'w') {
            // מלבן עד הצבע הנוכחי (ללא לבן)
            // שים לב: ככל ש-W עולה הצבע נהיה לבן.
            // הסליידר מציג: צד שמאל (0% לבן = הצבע המלא) -> צד ימין (100% לבן)
            return `linear-gradient(to right, hwb(${currentH} 0% ${currentB}%), hwb(${currentH} 100% ${currentB}%))`;
        }
        if (channel === 'b') {
            // מהצבע הנוכחי (ללא שחור) עד שחור
            return `linear-gradient(to right, hwb(${currentH} ${currentW}% 0%), hwb(${currentH} ${currentW}% 100%))`;
        }
    }
};


/**
 * ממלאת את כל השדות בפאנל באופן אוטומטי לפי הסטייל של האלמנט הנבחר
 */
const fillValues = {
    panel: (panelId) => {
        const panel = $(panelId);
        if (!panel || !theStyles) return;
        switch (panelId) {
            case 'panel-settings':
                settings.fillValues();
                break;

            case 'panel-add-element':
                renderDynamicFields($('elementTypeSelect').value);
                break;

            case 'panel-classes':
                refreshClassesView();
                break;

            case 'panel-theme':
                renderThemeList();
                break;

            default:
                const inputs = panel.$$('[data-property]');
                const styles = theStyles;

                inputs.forEach(element => {
                    const prop = element.dataset.property;
                    let value = styles[prop]; // ערך ה-CSS המחושב
                    fillValues.design(element, value);
                });
                break;
        }
    },
    design: (element, value) => {
        // נרמול בסיסי: הסרת מרכאות ורווחים
        const cleanValue = value ? value.replace(/"/g, '').trim() : '';

        // 1. טיפול באינפוט משולב (מספר + יחידה)
        if (element.classList.contains('ui-input-group')) {
            const parsed = parseUnit(value); // מחזיר אובייקט מחולק למספר ולערך
            const numInput = element.children[0];
            const unitSelect = element.children[1];

            numInput.value = parsed.value;
            fillValues.select(unitSelect, parsed.unit);
            return;
        }

        // 2. Checkbox
        if (element.type === 'checkbox') {
            element.checked = value === element.dataset.v;
        }

        // 3. Select רגיל (לא חלק מקבוצה)
        else if (element.tagName === 'SELECT') {
            fillValues.select(element, cleanValue);
        }

        // 4. צבעים
        else if (element.type === 'color'/* || prop.toLowerCase().includes('color')*/) {
            element.value = rgbToHex(value);
        }

        // 5. מספרים (Range / Number)
        else if (element.type === 'number' || element.type === 'range') {
            element.value = parseFloat(value) || 0;
        }

        // 6. טקסט רגיל
        else {
            element.value = cleanValue;
        }
    },

    // בודקת האם הערך קיים באפשרויות. אם כן - בוחרת אותו, אם לא - מאפסת.
    select: (selectElem, valueToCheck) => {
        const exists = Array.from(selectElem.options).some(opt => opt.value === valueToCheck);
        selectElem.value = exists ? valueToCheck : "";
    }
}



function getActiveSelectorKey() {
    if (!theElement) return '';
    const state = $('dropdown-states').value || '';
    return '#' + theElement.id + state;
}

const ShadowParser = {
    /**
     * מפרק מחרוזת box-shadow מהדפדפן לאובייקט עם ערכים נפרדים
     */
    parse: (shadowStr) => {
        // ערכי ברירת מחדל
        const defaults = {
            x: 0, y: 0, blur: 0, spread: 0,
            color: '#000000', inset: ''
        };

        if (!shadowStr || shadowStr === 'none') return defaults;

        // 1. חילוץ הצבע (RGB/RGBA/HEX)
        // הביטוי הרגולרי מחפש תבניות צבע ותופס אותן
        const colorMatch = shadowStr.match(/(rgb|hsl)a?\([^)]+\)|#[a-f\d]+|[a-z]+/i);
        let color = colorMatch ? colorMatch[0] : '#000000';

        // המרה ל-HEX עבור אינפוט מסוג color
        if (color.startsWith('rgb')) color = rgbToHex(color);

        // 2. בדיקה האם יש Inset
        const inset = shadowStr.includes('inset') ? 'inset' : '';

        // 3. חילוץ המספרים (Pixel Values)
        // מנקים את הצבע וה-inset מהמחרוזת כדי שיישארו רק המספרים
        const cleanStr = shadowStr.replace(colorMatch ? colorMatch[0] : '', '').replace('inset', '').trim();

        // מוצאים את כל המספרים (כולל שליליים)
        const lengths = cleanStr.match(/-?[\d\.]+/g);

        if (!lengths) return defaults;

        // מיפוי לפי הסדר הקבוע של CSS
        return {
            x: parseFloat(lengths[0]) || 0,
            y: parseFloat(lengths[1]) || 0,
            blur: parseFloat(lengths[2]) || 0,
            spread: parseFloat(lengths[3]) || 0,
            color: color,
            inset: inset
        };
    },

    /**
     * מרכיב מחדש מחרוזת CSS תקינה
     */
    assemble: (currentShadowObj, prop, value) => {
        // מעדכנים את הערך הספציפי שהשתנה
        // מיפוי בין שם הפרופרטי בפאנל לשדה באובייקט
        const map = {
            'boxShadowX': 'x',
            'boxShadowY': 'y',
            'boxShadowBlur': 'blur',
            'boxShadowSpread': 'spread',
            'boxShadowColor': 'color',
            'boxShadowInset': 'inset'
        };

        const key = map[prop];
        if (key) currentShadowObj[key] = value;

        // נשתמש בפורמט הסטנדרטי: x y blur spread color inset
        const { x, y, blur, spread, color, inset } = currentShadowObj;
        return `${x}px ${y}px ${blur}px ${spread}px ${color} ${inset}`.trim();
    }
};


/*======================================
            פונקציות הרופא
========================================*/

/**
 * הרופא של האלמנטים
 * @param {HTMLElement} element
 * @returns {Array} רשימת אבחנות
 */
function diagnoseElement(element) {
    if (!element) return [];

    const issues = [];
    const styles = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const parent = element.parentElement;
    const parentStyles = parent ? getComputedStyle(parent) : null;
    const parentRect = parent ? parent.getBoundingClientRect() : null;

    // פונקציית עזר להוספה מהירה
    const addIssue = (icon, title, desc) => {
        issues.push({ icon, title, desc });
    };

    // --- 1. חריגות וגלילה ---
    if (element.scrollHeight > element.clientHeight + 1 && styles.overflowY === 'hidden') {
        addIssue('✂️', 'תוכן נחתך', 'יש בתוך האלמנט יותר תוכן מהגובה שלו, והגדרת overflow: hidden. חלק מהתוכן מוסתר.');
    }
    if (element.scrollHeight > element.clientHeight + 1 && (styles.overflowY === 'visible' || styles.overflowY === '')) {
        addIssue('📏', 'תוכן גולש', ' יש בתוך האלמנט יותר תוכן מהגובה שלו והוא גולש למטה. נסה לשנות את הגדרות הגלישה');
    }
    if (parent && rect.width > parentRect.width) {
        addIssue('📏', 'חריגה מהרוחב', 'האלמנט הזה רחב יותר מהאבא שלו, ולכן הוא "בורח" החוצה.');
    }

    // --- 2. בעיות מיקום (Position) ---
    if (styles.position === 'absolute' && parent) {
        const posParent = element.offsetParent;
        if (posParent !== parent) {
            addIssue('📍', 'Absolute ללא גבולות', `האלמנט מוגדר כ-Absolute, אבל האבא שלו לא מוגדר כ-Relative (או Fixed/Absolute).
                 האלמנט מתמקם ביחס ל${(posParent.id ?? posParent.tagName) + posParent.className} ולא ביחס לאבא.`);
        }
    }
    if (styles.position === 'fixed' && styles.transform !== 'none') {
        addIssue('🐛', 'התנגשות Fixed ו-Transform', 'יש לאלמנט הזה (או לאבא שלו) Transform ביחד עם Position Fixed. זה גורם ל-Fixed להפסיק לעבוד ביחס למסך.');
    }
    if (styles.position === 'sticky') {
        let ancestor = parent;
        while (ancestor && ancestor !== document.body) {
            const s = getComputedStyle(ancestor);
            if (s.overflow !== 'visible' && s.overflow !== '') {
                addIssue('📌', 'הגדרת דביק לא פעילה', 'הגדרת Sticky (דביק), אבל זה לא יעבוד. לאחד ההורים של האלמנט יש הגדרת גלילה (Overflow) שחוסמת את ההדבקה.');
                break;
            }
            ancestor = ancestor.parentElement;
        }
    }
    if (styles.zIndex !== 'auto' && styles.position === 'static') {
        addIssue('🥞', 'פרמטר שכבות לא פעיל', 'נתת לאלמנט Z-Index (שכבות), אבל לא שינית את ה-Position שלו. Z-Index עובד רק על אלמנטים עם Position (כמו Relative, Absolute, Fixed).');
    }


    // --- 3. בעיות תצוגה (Display & Visibility) ---
    if (styles.display === 'inline' && (styles.width !== 'auto' || styles.marginTop !== '0px')) {
        addIssue('🚫', 'Inline לא מקבל גודל', 'אלמנט מסוג Inline מתעלם מהגדרות רוחב, גובה ושוליים אנכיים. שנה ל-Block או Inline-Block.');
    }
    if (styles.opacity === '0' || styles.visibility === 'hidden') {
        addIssue('👻', 'האלמנט מוסתר', 'האלמנט קיים בדף אבל הוא בלתי נראה (Opacity 0 או Hidden).');
    }
    if (styles.width === '100%' && styles.padding !== '0px' && styles.boxSizing === 'content-box') {
        addIssue('📦', 'רוחב 100% + פדינג', 'נתת לאלמנט רוחב 100% וגם ריווח פנימי (Padding), אבל ה-Box Sizing הוא ברירת מחדל (Content-Box). זה גורם לאלמנט להיות רחב יותר מהאבא שלו. שנה את Box Sizing ל-Border-Box.');
    }
    if (parent &&
        styles.marginTop !== '0px' &&
        element === parent.children[0] &&
        parentStyles.paddingTop === '0px' &&
        parentStyles.borderTopWidth === '0px' &&
        styles.position === 'static' &&
        parentStyles.display === 'block') {
        addIssue('🔻', 'קריסת שוליים', 'נתת שוליים עליונים (Margin Top), אבל הם "דוחפים" את האבא למטה במקום להתרחק ממנו. זה קורה כי לאבא אין גבול (Border) או פדינג עליון. נסה לתת לאבא overflow: auto או להוסיף לו פדינג שקוף קטן.');
    }
    if (styles.textOverflow === 'ellipsis') {
        if (styles.whiteSpace !== 'nowrap') {
            addIssue('📝', 'שלוש נקודות לא עובדות', 'הגדרת text-overflow: ellipsis, אבל שכחת להגדיר white-space: nowrap. בלי זה, הטקסט פשוט ירד שורה במקום להיחתך.');
        }
        else if (styles.overflow !== 'hidden' && styles.overflow !== 'scroll' && styles.overflow !== 'auto') {
            addIssue('✂️', 'שלוש נקודות ללא Overflow', 'כדי ששלוש הנקודות יופיעו, חייבים להגדיר overflow: hidden (או auto), אחרת הטקסט פשוט ימשיך לצאת החוצה.');
        }
    }
    if (styles.background !== 'none' && element.clientHeight === 0) {
        addIssue('🖼️', 'רקע באלמנט ריק', 'הגדרת רקע, אבל הגובה של האלמנט הוא 0 ולכן לא רואים כלום. לאלמנטים ללא תוכן חייבים לתת גובה מוגדר (height) או פדינג.');
    }



    // --- 4. אינטראקציה ---
    if (styles.pointerEvents === 'none') {
        addIssue('🖱️', 'לא ניתן ללחיצה', 'הוגדר pointer-events: none. אי אפשר יהיה ללחוץ על האלמנט הזה או לסמן טקסט בתוכו.');
    }
    if (element.tagName === 'BUTTON' && !element.hasAttribute('type') && parent.tagName === 'FORM') {
        addIssue('⚠️', 'כפתור בתוך טופס', 'זהו כפתור בתוך טופס ללא type="button". ברירת המחדל היא לשלוח את הטופס (Submit) ולרענן את הדף בלחיצה.');
    }

    // --- 5. תמונות ומדיה ---
    if (element.tagName === 'IMG') {
        // בדיקת יחס רוחב/גובה (Aspect Ratio)
        const naturalRatio = element.naturalWidth / element.naturalHeight;
        const renderedRatio = rect.width / rect.height;
        // אם יש סטייה של יותר מ-10% ביחס
        if (Math.abs(naturalRatio - renderedRatio) > 0.1 && styles.objectFit === 'fill') {
            addIssue('🖼️', 'תמונה מרוחה/מעוותת', 'הפרופורציות של התמונה נשברו כי הגדרת גובה ורוחב שלא תואמים למקור. נסה להשתמש ב-object-fit: cover.');
        }
    }

    // --- 6. Flexbox ---
    if (parentStyles && parentStyles.display === 'flex') {
        if (styles.flexShrink !== '0' && rect.width < parseFloat(styles.width || 0)) {
            addIssue('🤏', 'האלמנט נמעך', 'האלמנט נמצא בתוך Flexbox ואין לו מקום, אז הוא מתכווץ. תן לו flex-shrink: 0 כדי לשמור על הגודל שלו.');
        }
    }

    // --- בדיקת הצלחה ---
    if (issues.length === 0) {
        // מחזירים אובייקט מיוחד של הצלחה
        return [{
            icon: '✅',
            title: 'הכל נראה תקין!',
            desc: 'לא מצאנו בעיות נפוצות ב-CSS של האלמנט הזה. עבודה טובה!',
            isSuccess: true
        }];
    }

    return issues;
}




function showDiagnosisUI(element) {
    // 1. קודם כל מנקים חלוניות ישנות אם פתוחות
    const existing = $1('.diagnosis-card');
    if (existing) existing.remove();

    // 2. מריצים את האבחון
    const results = diagnoseElement(element);

    // 3. יוצרים את ה-HTML
    const card = createElement('div', { class: 'diagnosis-card' });
    const header = createElement('div', {
        class: 'diagnosis-header',
        in: `<span>👨‍⚕️ דוח אבחון לאלמנט</span>
            <span class="diagnosis-close">×</span>`
    });
    const list = createElement('div', { class: 'diagnosis-list' });

    results.forEach(item => {
        const itemEl = createElement('div', {
            class: `diagnosis-item ${item.isSuccess ? 'success' : ''}`,
            in: `<div class="diagnosis-icon">${item.icon}</div>
                <div class="diagnosis-content">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
                </div>`
        });
        list.appendChild(itemEl);
    });

    card.append(header, list);
    document.body.appendChild(card);

    // 4. סגירה בלחיצה
    card.$1('.diagnosis-close').onclick = () => card.remove();

    // אופציונלי: סגירה אוטומטית אחרי 8 שניות אם הכל תקין
    if (results[0].isSuccess) {
        const tip = createElement('div', {
            class: 'tip',
            in: `<p>עדיין נתקל בבעיה? נסה להפעיל את האבחון על האבא או על הבן הבעייתי של האלמנט!</p>`
        });
        tip.into(card);
        setTimeout(() => {
            if (document.body.contains(card)) card.remove();
        }, 8000);
    }
}
