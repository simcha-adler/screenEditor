const themeStyle = /*html*/ `<style>
    /* --- כללי --- */
    .theme-panel {font-family: sans-serif; direction: rtl; }

    /* --- אקורדיון רשימה --- */
    .color-item {border: 1px solid #ddd; border-radius: 6px; margin-bottom: 8px; background: #fff; overflow: hidden; }
    .color-header {padding: 12px; background: #f9f9f9; cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; }
    .color-header:hover {background: #f0f0f0; }
    .color-content {display: none; padding: 15px; border-top: 1px solid #eee; position: relative; }
    .color-item.open .color-content {display: block; }
    .color-item.open .color-header {background: #fff; border-bottom: 1px solid #eee; font-weight: bold; }

    .actions-bar {display: flex; gap: 10px; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc; }
    .btn-action {font-size: 12px; padding: 5px 10px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc; background: #fff; }
    .btn-delete {color: #d93025; border-color: #fce8e6; }
    .btn-delete:hover {background: #fce8e6; }

    /* --- Visual Slider (רכיב מותאם) --- */
    .v-slider-container {position: relative; height: 40px; margin-bottom: 15px; user-select: none; }
    .v-slider-track {position: absolute; bottom: 0; left: 0; right: 0; height: 20px; border-radius: 4px; border: 1px solid #ccc; cursor: crosshair; overflow: hidden; }
    .v-slider-cursor {
        position: absolute; top: 0; width: 0; height: 100%; pointer-events: none; z-index: 10;
    transform: translateX(-50%); /* Center align */
    }
    .v-arrow-head {
        width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #333;
    margin: 0 auto;
    }
    .v-cursor-line {width: 1px; height: 32px; background: #333; margin: 0 auto; }

    /* --- Limit Masks (מסכות הגבלה) --- */
    .limit-mask {position: absolute; background: rgba(255, 255, 255, 0.75); z-index: 5; pointer-events: none; }
    /* ידיות גרירה לגבולות */
    .limit-handle {
        position: absolute; width: 12px; height: 12px; background: #d93025; border: 1px solid #fff;
    border-radius: 50%; z-index: 20; cursor: ew-resize; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    top: 50%; transform: translate(-50%, -50%);
    }
    .limit-handle.vertical {cursor: ns-resize; left: 50%; }

    /* --- 2D Pad --- */
    .pad-2d {position: relative; width: 100%; height: 150px; border: 1px solid #ccc; border-radius: 4px; cursor: crosshair; overflow: hidden; margin-bottom: 10px; }
    .pad-cursor {
        position: absolute; width: 14px; height: 14px; border: 2px solid #fff; border-radius: 50%;
    box-shadow: 0 0 3px rgba(0,0,0,0.5); transform: translate(-50%, -50%); pointer-events: none; z-index: 10;
    }

    /* --- Builder Form --- */
    .builder-overlay {position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; }
    .builder-modal {background: #fff; width: 400px; max-height: 90vh; overflow-y: auto; padding: 20px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
    .builder-row {margin-bottom: 15px; }
    .builder-label {font-size: 12px; color: #666; display: block; margin-bottom: 5px; }
</style>
`;

// ==========================================
//   STATE & UTILS
// ==========================================
const customColors = [];

const generateId = () => 'clr_' + Math.random().toString(36).substring(2, 9);

// לוגיקת HWB: סכום לבן ושחור <= 100
// changeAxis: הציר שהמשתמש מזיז כרגע ('w' או 'b') כדי לדעת את מי להקטין
function fixHWB(values, changeAxis = null) {
    let { h, w, b } = values;

    // Clamp values
    h = h % 360;
    w = Math.max(0, Math.min(100, w));
    b = Math.max(0, Math.min(100, b));

    if (w + b > 100) {
        if (changeAxis === 'w') {
            b = 100 - w; // הזזנו לבן, נקטין שחור
        } else if (changeAxis === 'b') {
            w = 100 - b; // הזזנו שחור, נקטין לבן
        } else {
            // ברירת מחדל: הפחתה יחסית או פשוטה
            let overflow = (w + b) / 100;
            w /= overflow;
            b /= overflow;
        }
    }
    return { h, w, b };
}

const defaultColorConfig = {
    id: null,
    name: 'צבע חדש',
    type: 'absolute', // absolute, 1d, 2d, 3d
    values: { h: 200, w: 0, b: 0 },
    // לכל ציר יש min/max. ב-Absolute הם מתעלמים מזה.
    ranges: {
        h: { min: 0, max: 360 },
        w: { min: 0, max: 100 },
        b: { min: 0, max: 100 }
    },
    // להגדרות 1D/2D
    signalD: 'h' // איזה צירים הם הדינמיים. ב-1D יש אחד, ב-2D שניים.
};

// ==========================================
//   MAIN RENDERER (Accordion List)
// ==========================================

function loadThemePanel() {
    const container = $('panel-theme');
    container.innerHTML = `
        <div class="theme-panel">
            <h4>ניהול צבעים</h4>
            <div id="colorsList"></div>
            <button id="btnNewColor" class="btn-add" style="margin-top:10px;">+ הוסף צבע חדש</button>
        </div>
        <div id="builderContainer"></div> `;

    $('btnNewColor').whenClick(() => openBuilder());
    renderCustomColors();
}

function renderCustomColors() {
    const list = $('colorsList');
    list.innerHTML = '';

    customColors.forEach(color => {
        const el = createElement('div', { class: 'color-item' });

        // Header
        const swatch = `background: hwb(${color.values.h} ${color.values.w}% ${color.values.b}%); width: 20px; height: 20px; border-radius: 50%; border: 1px solid #ccc; display:inline-block; vertical-align:middle; margin-left:8px;`;

        el.innerHTML = `
            <div class="color-header" onclick="toggleAccordion('${color.id}')">
                <div>
                    <span style="${swatch}"></span>
                    <span>${color.name}</span>
                </div>
                <small style="color:#999">${getTypeLabel(color.type)}</small>
            </div>
            <div class="color-content" id="content_${color.id}">
                <div class="preview-area"></div>
                <div class="actions-bar">
                    <button class="btn-action" onclick="openBuilder('${color.id}')">✏️ עריכה</button>
                    <button class="btn-action btn-delete" onclick="deleteColor('${color.id}')">🗑️ מחיקה</button>
                </div>
            </div>
        `;
        list.appendChild(el);

        // רינדור התצוגה במצב פתוח (Read Only View)
        const previewArea = el.querySelector('.preview-area');
        renderReadOnlyPreview(color, previewArea);
    });
}

function toggleAccordion(id) {
    const el = $('content_' + id).parentNode;
    el.toggleClass('open');
}

function deleteColor(id) {
    const idx = customColors.findIndex(c => c.id === id);
    if (idx > -1) {
        customColors.splice(idx, 1);
        renderCustomColors();
    }
}

function getTypeLabel(type) {
    const map = { absolute: 'קבוע', '1d': 'טווח חד ממדי', '2d': 'משטח דו ממדי', '3d': 'תלת ממדי' };
    return map[type] || type;
}

// --- רינדור תצוגה לקריאה בלבד ברשימה ---
function renderReadOnlyPreview(color, container) {
    const v = color.values;
    const r = color.ranges;

    if (color.type === 'absolute') {
        container.innerHTML = `<div style="height:40px; background:hwb(${v.h} ${v.w}% ${v.b}%); border-radius:4px;"></div>`;
        return;
    }

    // עבור 1D/2D/3D אנו מציגים את הטווח הוויזואלי עם המסכות (Limits)
    // אך ללא הידיות גרירה (Static).

    // לוגיקה מקוצרת: נשתמש ברכיבי ה-Builder אבל במצב "Disabled"
    if (color.type === '1d') {
        // מציג סליידר ויזואלי של הציר הפעיל
        const axis = color.signalD || 'h';
        const showRange = generateLimitGradient(axis, v, r[axis]);
        container.innerHTML = `<div style="height:40px; background: ${showRange}; border-radius:4px;"></div>`;
    }
    else if (color.type === '2d' || color.type === '3d') {
        // ב-3D נציג חתך דו-ממדי (לפי שני הצירים הראשונים ב-signalD, או ברירת מחדל H/W)
        // ב-3D אמיתי צריך להציג גם סליידר ליד, אבל נתחיל בבסיס
        const axisZ = color.signalD || 'h';

        const pad = create2DPad({
            axisZ: axisZ,
            values: v,
            ranges: r,
            readOnly: true
        });
        container.appendChild(pad);

        if (color.type === '3d') {
            const showRange = generateLimitGradient('h', v, r['h']);
            container.innerHTML += `<div style="height:40px; background: ${showRange}; border-radius:4px;"></div>`;
        }
    }
}


// ==========================================
//   BUILDER (Edit/Create)
// ==========================================

function openBuilder(editId = null) {
    let config;
    if (editId) { // במצב עריכת צבע. כרגע לא קיים במערכת בכלל.
        const original = customColors.find(c => c.id === editId);
        config = JSON.parse(JSON.stringify(original)); // Deep copy
    } else {
        config = JSON.parse(JSON.stringify(defaultColorConfig));
        config.id = generateId();
    }

    const modal = document.createElement('div');
    modal.className = 'builder-overlay';

    const renderForm = () => {
        modal.innerHTML = `
        <div class="builder-modal">
            <h3>${editId ? 'עריכת צבע' : 'יצירת צבע חדש'}</h3>
            
            <div class="builder-row">
                <span class="builder-label">שם הצבע או הטווח</span>
                <input type="text" id="b_name" value="${config.name}" style="width:100%; padding:5px;">
            </div>

            <div class="builder-row">
                <span class="builder-label">סוג</span>
                <select id="b_type" style="width:100%; padding:5px;">
                    <option value="absolute" ${config.type === 'absolute' ? 'selected' : ''}>צבע מוגדר</option>
                    <option value="1d" ${config.type === '1d' ? 'selected' : ''}>טווח חד-ממדי</option>
                    <option value="2d" ${config.type === '2d' ? 'selected' : ''}>טווח דו-ממדי</option>
                    <option value="3d" ${config.type === '3d' ? 'selected' : ''}>טווח תלת-ממדי</option>
                </select>
            </div>

            ${renderAxesSelector(config)}

            <hr style="margin:15px 0; border:0; border-top:1px solid #eee;">
            
            <div class="builder-row">
                <span class="builder-label">ערכים וגבולות</span>
                <div id="b_controls_area"></div>
            </div>

            <div style="display:flex; gap:10px; margin-top:20px;">
                <button id="b_save" style="flex:1; padding:8px; background:#0078d4; color:#fff; border:none; border-radius:4px;">שמור</button>
                <button id="b_cancel" style="flex:1; padding:8px; background:#eee; border:none; border-radius:4px;">ביטול</button>
            </div>
        </div>
        `;

        // Bind Events
        const typeSelect = modal.$('b_type');
        typeSelect.when('change', (e) => {
            config.type = e.target.value;
            // Reset active axes defaults based on type
            if (config.type === '1d') config.signalD = 'h';
            if (config.type === '2d') config.signalD = 'b';
            renderForm();
        });

        const axesSelect = modal.$('b_signal_axis');
        if (axesSelect) {
            axesSelect.when('change', (e) => {
                config.signalD = e.target.value;
                renderForm();
            });
        }

        modal.$('b_name').when('input', (e) => config.name = e.target.value);

        modal.$('b_save').whenClick(() => {
            saveColorConfig(config, editId);
            document.body.removeChild(modal);
        });

        modal.$('b_cancel').whenClick(() => {
            document.body.removeChild(modal);
        });

        // Render the visual editors
        const controlsArea = modal.$('b_controls_area');
        renderBuilderControls(config, controlsArea);
    };

    document.body.appendChild(modal);
    renderForm();
}

function renderAxesSelector(config) {
    if (config.type === 'absolute' || config.type === '3d') return '';

    let options = '';
    const dim = config.signalD;
    if (config.type === '1d') {
        options = `
            <option value="h" ${dim === 'h' ? 'selected' : ''}>גוון</option>
            <option value="w" ${dim === 'w' ? 'selected' : ''}>לבן</option>
            <option value="b" ${dim === 'b' ? 'selected' : ''}>שחור</option>
        `;
    } else if (config.type === '2d') {
        options = `
            <option value="b" ${dim === 'b' ? 'selected' : ''}>גוון + לבן</option>
            <option value="w" ${dim === 'w' ? 'selected' : ''}>גוון + שחור</option>
            <option value="h" ${dim === 'h' ? 'selected' : ''}>לבן + שחור</option>
        `;
    }

    return `
        <div class="builder-row">
            <span class="builder-label">ציר שליטה פעיל</span>
            <select id="b_signal_axis" style="width:100%; padding:5px;">${options}</select>
        </div>
    `;
}

function renderBuilderControls(config, container) {
    // 1. אם זה 1D-נציג סליידר ויזואלי ענק שניתן לגרירה וגם לקביעת גבולות
    if (config.type === '1d') {
        const axis = config.signalD;
        const slider = createVisualSlider({
            axis: axis,
            val: config.values[axis],
            min: config.ranges[axis].min,
            max: config.ranges[axis].max,
            staticColors: config.values,
            onChange: (val) => {
                config.values[axis] = val;
                // עדכון נגדי במידת הצורך
                const fixed = fixHWB(config.values, axis);
                config.values = fixed;
            },
            onLimitChange: (min, max) => {
                config.ranges[axis].min = min;
                config.ranges[axis].max = max;
            }
        });
        container.appendChild(slider);

        // נוסיף סליידרים פשוטים עבור הצירים הקבועים (הלא פעילים) כדי לקבוע את הרקע
        ['h', 'w', 'b'].forEach(ax => {
            if (ax !== axis) {
                container.appendChild(createSimpleControl(ax, config));
            }
        });
    }

    // 2. אם זה 2D-נציג משטח עם גבולות
    else if (config.type === '2d') {
        const az = config.signalD;
        const pad = create2DPad({
            axisZ: az,
            values: config.values,
            ranges: config.ranges,
            onChange: (vals) => {
                Object.assign(config.values, vals);
                config.values = fixHWB(config.values); // אין ציר ספציפי ב-2D בו-זמנית, אז כללי
            },
            onLimitChange: (limits) => {
                // limits = { xMin, xMax, yMin, yMax }
                config.ranges[ax].min = limits.xMin;
                config.ranges[ax].max = limits.xMax;
                config.ranges[ay].min = limits.yMin;
                config.ranges[ay].max = limits.yMax;
            }
        });
        container.appendChild(pad);

        // סליידר לציר השלישי הקבוע
        container.appendChild(createSimpleControl(config.signalD, config));
    }

    // 3. Absolute-סליידרים רגילים ופיקר
    else {
        // עבור Absolute ו-3D נשתמש כרגע בפקדים פשוטים, או נשלב (ב-3D צריך גם וגם)
        ['h', 'w', 'b'].forEach(ax => {
            container.appendChild(createSimpleControl(ax, config));
        });

        // תצוגה מקדימה
        const preview = document.createElement('div');
        preview.style.height = '30px';
        preview.style.marginTop = '10px';
        preview.className = 'live-preview';
        updateLivePreview(preview, config);
        container.appendChild(preview);
    }
}

// יצירת סליידר פשוט לצירים קבועים
function createSimpleControl(axis, config) {
    const div = document.createElement('div');
    div.style.marginBottom = '5px';
    div.innerHTML = `<label style="font-size:10px; width:15px; display:inline-block">${axis.toUpperCase()}</label>
                     <input type="range" min="0" max="${axis === 'h' ? 360 : 100}" value="${config.values[axis]}">
                     <span style="font-size:10px">${config.values[axis]}</span>`;

    div.$1('input').when('input', (e) => {
        config.values[axis] = parseInt(e.target.value);
        config.values = fixHWB(config.values, axis);
        div.$1('span').textContent = config.values[axis];
        // עדכון גרפי אם יש (מסובך לקשר רכיבים אחים, נסתפק בלוגיקה)
        const preview = div.parentElement.$1('.live-preview');
        if (preview) updateLivePreview(preview, config);

        // טריק: אם יש Visual Slider באותו פאנל, צריך לרענן אותו כדי שהרקע ישתנה.
        // במימוש מלא נשתמש ב-Event Bus או Reactive State.
    });
    return div;
}

function updateLivePreview(el, config) {
    el.style.background = `hwb(${config.values.h} ${config.values.w}% ${config.values.b}%)`;
}

function saveColorConfig(config, editId) {
    if (editId) {
        const idx = customColors.findIndex(c => c.id === editId);
        customColors[idx] = config;
    } else {
        customColors.push(config);
    }
    renderCustomColors();
}

// ==========================================
//   VISUAL COMPONENTS (Sliders & Pads)
// ==========================================

/**
 * Visual Slider:
 * מציג רקע גרדיאנט, חץ עליון לערך הנוכחי, ו"וילונות" לגבולות.
 */
function createVisualSlider({ axis, val, min, max, staticColors, onChange, onLimitChange, readOnly = false }) {
    const container = document.createElement('div');
    container.className = 'v-slider-container';

    const track = document.createElement('div');
    track.className = 'v-slider-track';

    // יצירת רקע (Gradient)
    track.style.background = generateGradient(axis, staticColors);

    // סמן (Cursor)-חץ + קו
    const cursor = createElement('div', {
        class: 'v-slider-cursor',
        in: `<div class="v-arrow-head"></div><div class="v-cursor-line"></div>`
    });

    // מסכות גבולות (Min/Max Masks)
    const maskMin = document.createElement('div');
    maskMin.className = 'limit-mask';
    maskMin.style.left = '0'; maskMin.style.height = '100%';

    const maskMax = document.createElement('div');
    maskMax.className = 'limit-mask';
    maskMax.style.right = '0'; maskMax.style.height = '100%';

    container.appendChild(track);
    container.appendChild(maskMin);
    container.appendChild(maskMax);
    if (!readOnly || (readOnly && axis)) container.appendChild(cursor); // מציגים סמן גם בקריאה כדי לראות איפה הערך עומד

    // ידיות לגבולות (רק במצב עריכה)
    if (!readOnly && onLimitChange) {
        const handleMin = createLimitHandle(axis, 'min', min, (v) => { min = v; updatePos(); onLimitChange(min, max); });
        const handleMax = createLimitHandle(axis, 'max', max, (v) => { max = v; updatePos(); onLimitChange(min, max); });
        container.appendChild(handleMin);
        container.appendChild(handleMax);
    }

    const rangeMax = axis === 'h' ? 360 : 100;

    const updatePos = () => {
        // מיקום הסמן
        const pct = (val / rangeMax) * 100;
        cursor.style.left = pct + '%';

        // מיקום המסכות
        const minPct = (min / rangeMax) * 100;
        const maxPct = (max / rangeMax) * 100;

        maskMin.style.width = minPct + '%';
        maskMax.style.width = (100 - maxPct) + '%';
        maskMax.style.left = maxPct + '%';
    };

    updatePos();

    // לוגיקת גרירה של הסמן הראשי (בחירת הערך)
    if (!readOnly && onChange) {
        let dragging = false;
        track.addEventListener('mousedown', (e) => { dragging = true; updateValFromEvent(e); });
        window.addEventListener('mousemove', (e) => { if (dragging) updateValFromEvent(e); });
        window.addEventListener('mouseup', () => dragging = false);

        const updateValFromEvent = (e) => {
            const rect = track.getBoundingClientRect();
            let x = e.clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const newVal = Math.round((x / rect.width) * rangeMax);
            val = newVal;
            onChange(val);
            updatePos();
        };
    }

    return container;
}

/**
 * 2D Pad with Limits
 */
function create2DPad({ axisZ, values, ranges, onChange, onLimitChange, readOnly }) {
    const container = createElement('div', { class: 'pad-2d' });

    // רקע גרדיאנט מורכב (CSS Conic/Linear blend)
    // פישוט: משתמשים ב-helper שיוצר גרדיאנט דו מימדי
    let valZ = values[axisZ];
    container.style.background = generate2DGradient(axisZ, valZ);

    // סמן
    const cursor = document.createElement('div');
    cursor.className = 'pad-cursor';
    container.appendChild(cursor);

    // גבולות (4 מסכות)
    // Top (Y Min? תלוי בכיוון), Bottom, Left (X Min), Right
    // נניח ש-Y הולך מלמטה (0) למעלה (100) או להפך. בד"כ ב-HWB:
    // W/B: 0=Dark/None, 100=Full. 
    // בגרפיקה: Y=0 זה למעלה. נעשה ש-Y בפיקסלים 0 זה ערך מקסימלי (או מינימלי, תלוי בציר).
    // נניח שציר Y הוא מלמטה למעלה (Bottom=0).

    // לצורך הקוד, נממש רק את המסכות הוויזואליות בצורה פשטנית של box-shadow או divים.
    // מפאת קוצר המקום, נדלג על מימוש מלא של 4 ידיות גרירה ל-Pad בקוד זה,
    // אבל העיקרון זהה ל-Visual Slider (4 divים שחוסמים את הצדדים).
    const axisY = axisZ === 'b' ? 'w' : 'b';
    const axisX = axisZ === 'h' ? 'w' : 'h';
    const maxX = axisX === 'h' ? 360 : 100;
    const maxY = 100;

    const updateView = () => {
        const xPct = (values[axisX] / maxX) * 100;
        // נניח Y עולה מלמטה למעלה
        const yPct = 100 - (values[axisY] / maxY) * 100;

        cursor.style.left = xPct + '%';
        cursor.style.top = yPct + '%';
    };

    updateView();

    if (!readOnly && onChange) {
        let dragging = false;
        container.addEventListener('mousedown', (e) => { dragging = true; handleMove(e); });
        window.addEventListener('mousemove', (e) => { if (dragging) handleMove(e); });
        window.addEventListener('mouseup', () => dragging = false);

        const handleMove = (e) => {
            const rect = container.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;

            x = Math.max(0, Math.min(x, rect.width));
            y = Math.max(0, Math.min(y, rect.height));

            const vX = Math.round((x / rect.width) * maxX);
            const vY = Math.round(((rect.height - y) / rect.height) * maxY); // Invert Y

            const newVals = {};
            newVals[axisX] = vX;
            newVals[axisY] = vY;
            onChange(newVals);
            updateView();
        };
    }

    return container;
}

// --- Helpers ---

function createLimitHandle(axis, type, startVal, onUpdate) {
    const handle = document.createElement('div');
    handle.className = 'limit-handle';
    const rangeMax = axis === 'h' ? 360 : 100;

    const updatePos = (v) => {
        const pct = (v / rangeMax) * 100; //המרה מאחוזים לפיקסלים
        handle.style.left = pct + '%';
    };
    updatePos(startVal);

    let dragging = false;
    handle.addEventListener('mousedown', (e) => { e.stopPropagation(); dragging = true; });
    window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const rect = handle.parentElement.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const v = Math.round((x / rect.width) * rangeMax); // המרה מפיקסלים לאחוזים
        updatePos(v);
        onUpdate(v);
    });
    window.addEventListener('mouseup', () => dragging = false);

    return handle;
}

function generateGradient(axis, staticColors) {
    const { h, w, b } = staticColors;
    // מחזיר מחרוזת CSS linear-gradient המייצגת את הציר המשתנה תוך שמירה על האחרים קבועים
    if (axis === 'h') {
        // H משתנה, W/B קבועים.
        // מכיוון ש-H הוא מעגלי וצבעוני, ו-W/B משפיעים על הלבנת/השחרת הצבע:
        return `linear-gradient(to right, 
            hwb(0 ${w}% ${b}%), hwb(60 ${w}% ${b}%), hwb(120 ${w}% ${b}%), 
            hwb(180 ${w}% ${b}%), hwb(240 ${w}% ${b}%), hwb(300 ${w}% ${b}%), hwb(360 ${w}% ${b}%))`;
    }
    else if (axis === 'w') {
        // W משתנה (0 עד 100), H ו-B קבועים.
        // W=0 -> הצבע המקורי (עם השחור הנתון), W=100 -> לבן
        return `linear-gradient(to right, hwb(${h} 0% ${b}%), hwb(${h} 100% ${b}%))`;
    }
    else if (axis === 'b') {
        return `linear-gradient(to right, hwb(${h} ${w}% 0%), hwb(${h} ${w}% 100%))`;
    }
}

function generateLimitGradient(axis, staticColors, limitAxit) {
    const { h, w, b } = staticColors;
    const { min, max } = limitAxit;
    // מחזיר מחרוזת CSS linear-gradient המייצגת את הציר המשתנה תוך שמירה על האחרים קבועים
    if (axis === 'h') {
        // H משתנה, W/B קבועים.
        // מכיוון ש-H הוא מעגלי וצבעוני, ו-W/B משפיעים על הלבנת/השחרת הצבע:
        return `linear-gradient(to right, 
            hwb(0 ${w}% ${b}%), hwb(60 ${w}% ${b}%), hwb(120 ${w}% ${b}%), 
            hwb(180 ${w}% ${b}%), hwb(240 ${w}% ${b}%), hwb(300 ${w}% ${b}%), hwb(360 ${w}% ${b}%))`;
    }
    else if (axis === 'w') {
        // W משתנה (0 עד 100), H ו-B קבועים.
        // W=0 -> הצבע המקורי (עם השחור הנתון), W=100 -> לבן
        return `linear-gradient(to right, hwb(${h} ${min}% ${b}%), hwb(${h} ${max}% ${b}%))`;
    }
    else if (axis === 'b') {
        return `linear-gradient(to right, hwb(${h} ${w}% ${min}%), hwb(${h} ${w}% ${max}%))`;
    }
}
/**
 * מחזירה גרדיאנט דו ממדי, מותאם לערך הממד הקבוע
 * @params  הממד הקבוע וערכו
 * @returns מחרוזת של הגרדיאנט הרצוי
 */
function generate2DGradient(typeZ, valZ) {
    if (typeZ === 'h')
        return `linear-gradient(to top, black, transparent), linear-gradient(to right, white, transparent), hwb(${valZ} 0% 0%)`;
    else if (typeZ === 'w')
        return `linear-gradient(to top, hwb(0 ${valZ}% ${100 - valZ}%), transparent),linear-gradient(to right, hwb(0 ${valZ}% 0%), hwb(60 ${valZ}% 0%), hwb(120 ${valZ}% 0%), hwb(180 ${valZ}% 0%), hwb(240 ${valZ}% 0%), hwb(300 ${valZ}% 0%), hwb(0 ${valZ}% 0%))`;
    else if (typeZ === 'b')
        return `linear-gradient(to top, hwb(0 ${100 - valZ}% ${valZ}%), transparent),linear-gradient(to right, hwb(0 0% ${valZ}%), hwb(60 0% ${valZ}%), hwb(120 0% ${valZ}%), hwb(180 0% ${valZ}%), hwb(240 0% ${valZ}%), hwb(300 0% ${valZ}%), hwb(0 0% ${valZ}%))`;
}


loadThemePanel();