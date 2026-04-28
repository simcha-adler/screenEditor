
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


/**
 * מוודא שלאלמנט נתון יש ID ייחודי.
 * אם אין לו, יוצר עבורו ID ומחזיר אותו.
 * @param {HTMLElement} element
 * @returns {string} id
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
    clone.addClass(convertToClass(clone.id, true));

    // 2. עדכון ה-ID של הראש
    clone.id = newId;

    // 3. עדכון רקורסיבי של IDs לכל הילדים
    // כדי למנוע התנגשות עם הילדים המקוריים
    const descendants = clone.$$('*');
    descendants.forEach(child => {
        if (child.id) {
            const className = convertToClass(child.id, true);
            child.addClass(className);
            child.id = newId + '_➜_' + child.id;
        }
    });

    return clone;
}

function convertToClass(id, autoClass = false) {
    const rules = Style.getRulesById(id);
    if (!rules) return console.log(`לא נמצאו חוקים תואמים ל-${id}`);
    let className = '';
    if (!autoClass) className = prompt('הזן שם רצוי לקלאס. השאר ריק ליצירה אוטומטית (לא מומלץ):  ');
    if (!className) className = `class_${id}_` + Math.random().toString(36).substring(2, 9);
    rules.forEach(rule => {
        Style.reconnectRule(rule.selectorText);
        rule.selectorText = rule.selectorText.replace('#' + id, '.' + className);
        Style.connectRule(rule);
    });
    editorDoc.$(id).addClass(className);
    return className;
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
    panel: (panel) => {
        const panelId = panel.id;
        if (!panel || !Edit.getStyles()) return;
        switch (panelId) {
            case 'panel-settings':
                return settings.fillValues();

            case 'panel-add-element':
                return renderDynamicFields($('elementTypeSelect').value);

            case 'panel-classes':
                return refreshClassesView();

            case 'panel-theme':
                return renderThemeList();

            default:
                const inputs = panel.$$('[data-property]');
                const styles = Edit.getStyles();
                if (!styles) return;

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
        else if (element.classList.contains('ui-smart-color-group')) {
            colorPicker.fill(element, value);
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

/**
 * 
 * @param {HTMLElement} popap 
 * @param {number} x 
 * @param {number} y 
 */
function popoverPosition(popap, x, y) {
    const computed = getComputedStyle(popap);
    const width = computed['width'];
    const height = computed['height'];
    popap.removeClass('visibi');
    popap.style.left = (x - parseInt(width)) + 'px';
    popap.style.top = y + 'px';
}