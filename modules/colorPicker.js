//@ts-check

import { clr } from './colorServices.js'

// --- State ---
let state = {
    h: 210,
    s: 50,
    v: 100,
    a: 1,
    /** @param {{h?: number, s?: number, v?: number, a?: number}} color; @param {boolean} fromInputs */
    change: (color, fromInputs = false) => {
        state = { ...state, ...color } // עדכון כל השינויים שנשלחו
        updateUI(fromInputs);
        if (activeCallback)
            activeCallback(clr.rgbToHex(...clr.hsvToRgb(state.h, state.s, state.v), state.a)) // ליצור hsvToHex
    }
};
let oldColorStr = "rgba(50, 100, 150, 1)"; // הצבע של הרקע החיצוני
const formats = ['rgba', 'hex', 'hsl', 'hwb'];
let currentFormatIndex = 0;

// רשימת הצבעים
// הרשימה נלקחה מ-קולור פיקר ווב קומפוננטס. לבדוק זכויות יוצרים. ויותר טוב, לבנות רשימה מתמטית
// מחליף את מערך ה-presetColors הקשיח
function generateMathematicalPalette() {
    const palette = [];

    // בוחרים זוויות גוון (Hue) מרכזיות על גלגל הצבעים (בדילוגים של 24 מעלות כדי לקבל 15 גווני בסיס)
    for (let h = 0; h < 360; h += 24) {

        // לכל גוון, ניצור רצף של 10 וריאציות (דומה למשקלים 100-900 במטריאל דיזיין)
        // נשחק עם ה-Saturation וה-Value כדי ליצור מעבר מצבעים בהירים/חלשים לכהים/עזים
        const variations = [
            { s: 10, v: 100 }, // בהיר מאוד
            { s: 20, v: 95 },
            { s: 40, v: 90 },
            { s: 60, v: 85 },
            { s: 80, v: 80 },  // צבע בסיס יציב
            { s: 100, v: 75 },
            { s: 100, v: 60 },
            { s: 100, v: 45 },
            { s: 100, v: 30 }, // כהה מאוד
            { s: 100, v: 15 }  // כמעט שחור
        ];

        variations.forEach(v => {
            // שימוש בפונקציות העזר שכבר קיימות אצלך להמרה מ-HSV להקס
            const [r, g, b] = clr.hsvToRgb(h, v.s, v.v);
            const hex = clr.rgbToHex(r, g, b, 1);
            palette.push(hex.toUpperCase());
        });
    }

    // נוסיף בסוף פלטה מונוכרומטית (אפורים - Saturation 0)
    for (let v = 100; v >= 0; v -= 10) {
        const [r, g, b] = clr.hsvToRgb(0, 0, v);
        palette.push(clr.rgbToHex(r, g, b, 1).toUpperCase());
    }

    const professionalBrowns = [
        "#EFEBE9", // 50 - בהיר מאוד (לרקעים עדינים)
        "#D7CCC8", // 100
        "#BCAAA4", // 200
        "#A1887F", // 300
        "#8D6E63", // 400
        "#795548", // 500 - צבע הבסיס (חום שוקולד נעים)
        "#6D4C41", // 600
        "#5D4037", // 700
        "#4E342E", // 800
        "#3E2723"  // 900 - כהה מאוד (לטקסטים)
    ];

    const professionalBlueGreys = [
        "#ECEFF1", // 50 - מעולה לרקעים של פאנלים
        "#CFD8DC", // 100 - לגבולות (Borders)
        "#B0BEC5", // 200
        "#90A4AE", // 300
        "#78909C", // 400
        "#607D8B", // 500 - אפור-כחול בסיסי
        "#546E7A", // 600
        "#455A64", // 700
        "#37474F", // 800 - מעולה לטקסט משני
        "#263238"  // 900 - מושלם למצב לילה (Dark Mode background)
    ];

    const customPalettes = [...professionalBrowns, ...professionalBlueGreys];
    return palette.concat(customPalettes);
}

// בקוד שלך, פשוט תקרא לפונקציה הזו:
const presetColors = generateMathematicalPalette();

// --- DOM Elements ---
const pickerWrapper = $('color-picker-card'); // מעטפת הפיקר
const wheelArea = $('wheel-area'); // מעגל הצבעים הראשי
const knob = $('knob'); // עיגול הבורר
const knobBG = $('knob-bg');
const wheelDarkness = $('wheel-darkness'); // שכבת ההכהיה מעל המעגל
const alphaSlider = $('alpha-slider');
const valueSlider = $('value-slider');
const oldColorBg = $('old-color-bg');
const newColorFill = $('new-color-fill');
const toggleBtn = $('toggle-btn');
const formatLabel = $('format-label');
const inputsContainer = $('inputs-container');

// פופאפ
const btnPalette = $('btn-palette');
const palettePopup = $('palette-popup'); // מעטפת טבלת הצבעים
const closePaletteBtn = $('close-palette');
const paletteGrid = $('palette-grid'); // גריד הצבעים

// משתני מצב
/**@type {HTMLElement | null} */
let activeTarget = null; // הקלט/כפתור שלחצו עליו
/**@type {Function | null} */
let activeCallback = null; // הפונקציה שנקראת כשהצבע משתנה

let isDragging = false;

/*======================================================*/

function _initEvents() {

    // מאזין לשינוי פורמט הצבע
    toggleBtn.whenClick(() => {
        currentFormatIndex = (currentFormatIndex + 1) % formats.length;
        renderInputDOM();
    });

    //פתיחה וסגירה של טבלת הגוונים
    btnPalette.whenClick(() => { palettePopup.classList.add('open'); });
    closePaletteBtn.whenClick(() => { palettePopup.classList.remove('open'); });

    // מאזין לבחירה והפעלת גרירה במעגל. שאר מאזיני הגרירה בפונקציית אופן
    wheelArea.addEventListener('mousedown', (e) => { isDragging = true; handleWheelMove(e); });

    // מאזיני הסליידרים
    alphaSlider.when('input', /**@param {any} e*/(e) => { state.change({ a: parseFloat(e.target.value) }); });
    valueSlider.when('input', /**@param {any} e*/(e) => { state.change({ v: parseFloat(e.target.value) }); });
};

function notDragging() {
    isDragging = false;
}

/**
 * פותח את הפיקר ומקשר אותו לקלט ספציפי
 * @param {MouseEvent} e 
 * @param {HTMLElement} triggerElement - האלמנט שלחצו עליו (כדי למקם לידו)
 * @param {string} initialColor - הצבע הנוכחי של הקלט בהקס(כדי לאתחל את הפיקר)
 * @param {Function} onChangeCallback - פונקציה שתקבל את הצבע החדש
 */
function open(e, triggerElement, initialColor, onChangeCallback) {

    // אתחול מאזינים. הקודמים בוטלו בסגירה לחסוך פעולות
    // האזנה ללחיצה מחוץ לפיקר כדי לסגור אותו
    document.whenClick(_smartClose);
    editorDoc.whenClick(_smartClose);
    window.addEventListener('mousemove', handleWheelMove);
    window.addEventListener('mouseup', notDragging);

    //  טעינת צבע ראשוני למערכת (state) לפני עדכון הקולבק כדי שלא יופעל
    if (initialColor) {
        oldColorStr = initialColor;
        let parts = initialColor.replace(/([()a-z])/g, '').split(',');
        const rgba = parts.map(part => parseFloat(part))
        let [h, s, v] = clr.rgbToHsv(rgba[0], rgba[1], rgba[2]);
        if (rgba[3] === 0) [h, s, v] = [0, 0, 100]
        state.change({ h, s, v, a: rgba[3] ?? 1 });
    }

    activeTarget = triggerElement;
    activeCallback = onChangeCallback;

    // 2. חישוב המיקום של הפיקר על המסך ביחס לכפתור שלחצו עליו
    popoverPosition(pickerWrapper, e.clientX, e.clientY);

    // 3. הצגת הפיקר
    pickerWrapper.removeClass('hide');
};

function _smartClose(/**@type {any} e */ e) {
    // בודק אם הלחיצה הייתה מחוץ לפיקר
    // כרגע נסגר אם הלחיצה מחוץ לפיקר על ידי המאזין הכללי, אבל זה לא מפריע, וצריך כאן את ניקוי השולחן.
    const clickedInsidePicker = pickerWrapper.contains(e.target);

    if (!clickedInsidePicker) {
        pickerWrapper.addClass('hide');
        activeTarget = null;
        activeCallback = null;
        document.removeEventListener('click', _smartClose);
        editorDoc.removeEventListener('click', _smartClose);
        window.removeEventListener('mousemove', handleWheelMove);
        window.removeEventListener('mouseup', notDragging);
    }
};


/**
 * עדכון כל ערכי הפיקר בצבע הנוכחי
 * @param {boolean} skipInputsUpdate 
 */
function updateUI(skipInputsUpdate) {
    const [r, g, b] = clr.hsvToRgb(state.h, state.s, state.v);
    const [rFull, gFull, bFull] = clr.hsvToRgb(state.h, state.s, 100);

    // רקעים (הישן נשאר קבוע ברקע הראשי של הפס)
    oldColorBg.style.background = oldColorStr;
    newColorFill.style.background = `rgba(${r}, ${g}, ${b}, ${state.a})`;

    // גלגל
    const radius = wheelArea.offsetWidth / 2;
    const angleRad = state.h * Math.PI / 180;
    const distance = (state.s / 100) * radius;
    knob.style.left = `${radius + distance * Math.cos(angleRad)}px`;
    knob.style.top = `${radius + distance * Math.sin(angleRad)}px`;
    knobBG.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${state.a})`;
    wheelDarkness.style.opacity = (1 - (state.v / 100)).toString();

    // סליידרים
    alphaSlider.value = state.a;
    valueSlider.value = state.v;
    alphaSlider.style.background = `linear-gradient(to right, transparent, rgba(${r}, ${g}, ${b}, 1))`;
    valueSlider.style.background = `linear-gradient(to right, black, rgb(${rFull}, ${gFull}, ${bFull}))`;

    if (!skipInputsUpdate) updateInputValues();
}

// יצירת שדות
function renderInputDOM() {
    const format = formats[currentFormatIndex];
    formatLabel.innerText = format;
    inputsContainer.innerHTML = '';

    let labels = format === 'hex' ? ['hex'] : (format === 'rgba' ? ['r', 'g', 'b', 'a'] : (format === 'hsl' ? ['h', 's', 'l', 'a'] : ['h', 'w', 'b', 'a']));

    labels.forEach(label => {
        const input = createElement('input', { type: 'text' });
        input.className = label === 'hex' ? 'color-input hex-input' : 'color-input';

        input.when('input', () => { readInputsAndUpdateState(); });
        inputsContainer.appendChild(input);
    });
    updateInputValues();
}

// עדכון תוכן השדות
function updateInputValues() {
    const inputs = inputsContainer.querySelectorAll('input');
    if (!inputs.length) return;
    const format = formats[currentFormatIndex];
    const rgb = clr.hsvToRgb(state.h, state.s, state.v);
    /**@type {(string | number)[]} */
    let vals = [];

    if (format === 'rgba') vals = [...rgb, state.a.toFixed(2)];
    else if (format === 'hex') vals = [clr.rgbToHex(...rgb, state.a)];
    else if (format === 'hsl') vals = [...clr.hsvToHsl(state.h, state.s, state.v), state.a.toFixed(2)];
    else if (format === 'hwb') vals = [...clr.hsvToHwb(state.h, state.s, state.v), state.a.toFixed(2)];

    inputs.forEach((input, i) => { if (document.activeElement !== input) input.value = vals[i]; });
}

// קריאה מהשדות
function readInputsAndUpdateState() {
    const format = formats[currentFormatIndex];
    const vals = Array.from(inputsContainer.querySelectorAll('input')).map(i => i.value);
    /**@type {number[]} */
    let color = [state.h, state.s, state.v];
    let a = state.a;
    try {
        if (format === 'rgba') {
            color = [...clr.rgbToHsv(clr.clamp(parseFloat(vals[0]) || 0, 0, 255), clr.clamp(parseFloat(vals[1]) || 0, 0, 255), clr.clamp(parseFloat(vals[2]) || 0, 0, 255))];
            if (!isNaN(parseFloat(vals[3]))) a = clr.clamp(parseFloat(vals[3]), 0, 1);
        } else if (format === 'hex') {
            const rgba = clr.hexToRgba(vals[0]);
            if (rgba) {
                color = [...clr.rgbToHsv(rgba[0], rgba[1], rgba[2])];
                a = rgba[3];
            }
        } else if (format === 'hsl') {
            color = [...clr.hslToHsv(clr.clamp(parseFloat(vals[0]) || 0, 0, 360), clr.clamp(parseFloat(vals[1]) || 0, 0, 100), clr.clamp(parseFloat(vals[2]) || 0, 0, 100))];
            if (!isNaN(parseFloat(vals[3]))) a = clr.clamp(parseFloat(vals[3]), 0, 1);
        } else if (format === 'hwb') {
            color = [...clr.hwbToHsv(clr.clamp(parseFloat(vals[0]) || 0, 0, 360), clr.clamp(parseFloat(vals[1]) || 0, 0, 100), clr.clamp(parseFloat(vals[2]) || 0, 0, 100))];
            if (!isNaN(parseFloat(vals[3]))) a = clr.clamp(parseFloat(vals[3]), 0, 1);
        }
        state.change({ h: color[0], s: color[1], v: color[2], a }, true);
    } catch (e) { }
}

// בניית גריד הצבעים
function buildPalette() {
    presetColors.forEach(hex => {
        const div = createElement('div', { class: 'palette-item', title: hex });
        div.style.backgroundColor = hex;
        div.whenClick(() => {
            const rgba = clr.hexToRgba(hex);
            if (rgba) {
                const [h, s, v] = clr.rgbToHsv(rgba[0], rgba[1], rgba[2]);
                state.change({ h, s, v, a: 1 }) // ללא שקיפות מהפלטה
                // palettePopup.classList.remove('open');
            }
        });
        paletteGrid.appendChild(div);
    });
}

/**
 * בחירת צבע מתוך המעגל
 * @param {MouseEvent} e  
 */
function handleWheelMove(e) {
    if (!isDragging) return;
    const rect = wheelArea.getBoundingClientRect();
    const r = rect.width / 2;
    const dx = e.clientX - rect.left - r;
    const dy = e.clientY - rect.top - r;

    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    let dist = Math.min(Math.sqrt(dx * dx + dy * dy), r);

    state.change({ h: angle, s: (dist / r) * 100 })
}


function initPicker() {
    buildPalette();
    _initEvents();
    renderInputDOM();
}



export const colorPicker = {
    open,
    init: initPicker
}

//@ts-ignore
window.niceColorPicker = colorPicker;