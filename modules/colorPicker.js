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
const presetColors = [
    "#B71C1C", "#C62828", "#D32F2F", "#E53935", "#F44336", "#EF5350", "#E57373", "#EF9A9A", "#FFCDD2", "#FFEBEE",
    "#880E4F", "#AD1457", "#C2185B", "#D81B60", "#E91E63", "#EC407A", "#F06292", "#F48FB1", "#F8BBD0", "#FCE4EC",
    "#4A148C", "#6A1B9A", "#7B1FA2", "#8E24AA", "#9C27B0", "#AB47BC", "#BA68C8", "#CE93D8", "#E1BEE7", "#F3E5F5",
    "#311B92", "#4527A0", "#512DA8", "#5E35B1", "#673AB7", "#7E57C2", "#9575CD", "#B39DDB", "#D1C4E9", "#EDE7F6",
    "#1A237E", "#283593", "#303F9F", "#3949AB", "#3F51B5", "#5C6BC0", "#7986CB", "#9FA8DA", "#C5CAE9", "#E8EAF6",
    "#0D47A1", "#1565C0", "#1976D2", "#1E88E5", "#2196F3", "#42A5F5", "#64B5F6", "#90CAF9", "#BBDEFB", "#E3F2FD",
    "#01579B", "#0277BD", "#0288D1", "#039BE5", "#03A9F4", "#29B6F6", "#4FC3F7", "#81D4FA", "#B3E5FC", "#E1F5FE",
    "#006064", "#00838F", "#0097A7", "#00ACC1", "#00BCD4", "#26C6DA", "#4DD0E1", "#80DEEA", "#B2EBF2", "#E0F7FA",
    "#004D40", "#00695C", "#00796B", "#00897B", "#009688", "#26A69A", "#4DB6AC", "#80CBC4", "#B2DFDB", "#E0F2F1",
    "#1B5E20", "#2E7D32", "#388E3C", "#43A047", "#4CAF50", "#66BB6A", "#81C784", "#A5D6A7", "#C8E6C9", "#E8F5E9",
    "#33691E", "#558B2F", "#689F38", "#7CB342", "#8BC34A", "#9CCC65", "#AED581", "#C5E1A5", "#DCEDC8", "#F1F8E9",
    "#827717", "#9E9D24", "#AFB42B", "#C0CA33", "#CDDC39", "#D4E157", "#DCE775", "#E6EE9C", "#F0F4C3", "#F9FBE7",
    "#F57F17", "#F9A825", "#FBC02D", "#FDD835", "#FFEB3B", "#FFEE58", "#FFF176", "#FFF59D", "#FFF9C4", "#FFFDE7",
    "#FF6F00", "#FF8F00", "#FFA000", "#FFB300", "#FFC107", "#FFCA28", "#FFD54F", "#FFE082", "#FFECB3", "#FFF8E1",
    "#E65100", "#EF6C00", "#F57C00", "#FB8C00", "#FF9800", "#FFA726", "#FFB74D", "#FFCC80", "#FFE0B2", "#FFF3E0",
    "#BF360C", "#D84315", "#E64A19", "#F4511E", "#FF5722", "#FF7043", "#FF8A65", "#FFAB91", "#FFCCBC", "#FBE9E7",
    "#3E2723", "#4E342E", "#5D4037", "#6D4C41", "#795548", "#8D6E63", "#A1887F", "#BCAAA4", "#D7CCC8", "#EFEBE9",
    "#212121", "#424242", "#616161", "#757575", "#9E9E9E", "#BDBDBD", "#E0E0E0", "#EEEEEE", "#F5F5F5", "#FAFAFA",
    "#263238", "#37474F", "#455A64", "#546E7A", "#607D8B", "#78909C", "#90A4AE", "#B0BEC5", "#CFD8DC", "#ECEFF1"
];

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