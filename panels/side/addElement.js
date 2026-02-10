
// ==========================================
//   1. הגדרות הרכיבים
// ==========================================

const elementsList = {
    'h1': {
        label: '🇹 כותרת ראשית (H1)',
        fields: [
            { type: 'inputRow', label: 'תוכן', inputType: 'text', prop: 'text', value: 'כותרת ראשית' },
            { type: 'inputRow', label: 'צבע', inputType: 'color', prop: 'color', value: '#333333' }
        ]
    },
    'h2': {
        label: '🇹 כותרת משנית (H2)',
        fields: [
            { type: 'inputRow', label: 'תוכן', inputType: 'text', prop: 'text', value: 'כותרת משנה' },
            { type: 'inputRow', label: 'צבע', inputType: 'color', prop: 'color', value: '#555555' }
        ]
    },
    'p': {
        label: '📝 פסקה (Paragraph)',
        fields: [
            { type: 'inputRow', label: 'תוכן', inputType: 'textarea', prop: 'text', value: 'טקסט לדוגמה...' },
            { type: 'inputRow', label: 'גודל', inputType: 'number', prop: 'fontSize', unit: 'px', value: '16' },
            { type: 'inputRow', label: 'גובה שורה', inputType: 'number', prop: 'lineHeight', value: '1.5' }
        ]
    },
    'img': {
        label: '🖼️ תמונה (Image)',
        fields: [
            { type: 'inputRow', label: 'URL', inputType: 'text', prop: 'src', value: 'https://via.placeholder.com/400x300' },
            { type: 'inputRow', label: 'תיאור', inputType: 'text', prop: 'alt', value: 'תמונה' },
            {
                type: 'grid',
                children: [
                    { type: 'input', inputType: 'number', label: 'רוחב', prop: 'width', unit: '%', value: '100' },
                    { type: 'input', inputType: 'number', label: 'עיגול', prop: 'borderRadius', unit: 'px', value: '8' }
                ]
            }
        ]
    },
    'video': {
        label: '🎬 וידאו (Video)',
        fields: [
            { type: 'inputRow', label: 'URL', inputType: 'text', prop: 'src', value: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { type: 'inputRow', label: 'פקדים', inputType: 'toggle', prop: 'controls', v: true, x: false, value: true },
            { type: 'inputRow', label: 'ניגון אוטומטי', inputType: 'toggle', prop: 'autoplay', v: true, x: false, value: false }
        ]
    },
    'button': {
        label: '🔘 כפתור (Button)',
        fields: [
            { type: 'inputRow', label: 'טקסט', inputType: 'text', prop: 'text', value: 'לחץ כאן' },
            { type: 'inputRow', label: 'צבע רקע', inputType: 'color', prop: 'backgroundColor', value: '#0078d4' },
            { type: 'inputRow', label: 'צבע טקסט', inputType: 'color', prop: 'color', value: '#ffffff' },
            {
                type: 'grid',
                children: [
                    { type: 'input', inputType: 'number', label: 'עיגול', prop: 'borderRadius', unit: 'px', value: '4' },
                    { type: 'input', inputType: 'text', label: 'ריווח', prop: 'padding', value: '10px 20px' }
                ]
            }
        ]
    },
    'a': {
        label: '🔗 קישור (Link)',
        fields: [
            { type: 'inputRow', label: 'טקסט', inputType: 'text', prop: 'text', value: 'עבור לאתר' },
            { type: 'inputRow', label: 'כתובת (HREF)', inputType: 'text', prop: 'href', value: 'https://google.com' },
            { type: 'inputRow', label: 'חלון חדש', inputType: 'toggle', prop: 'target', v: true, x: false, value: true },
            { type: 'inputRow', label: 'צבע', inputType: 'color', prop: 'color', value: '#0078d4' }
        ]
    },
    'div': {
        label: '🔲 קופסה (Container)',
        fields: [
            { type: 'inputRow', label: 'גובה מינימלי', inputType: 'number', prop: 'minHeight', unit: 'px', value: '100' },
            { type: 'inputRow', label: 'צבע רקע', inputType: 'color', prop: 'backgroundColor', value: '#f9f9f9' },
            { type: 'inputRow', label: 'ריווח פנימי', inputType: 'text', prop: 'padding', value: '20px' },
            { type: 'inputRow', label: 'מסגרת', inputType: 'toggle', prop: 'border', v: true, x: false, value: true }
        ]
    },
    'details': {
        label: '🔻 אקורדיון (Details)',
        fields: [
            { type: 'inputRow', label: 'כותרת', inputType: 'text', prop: 'summary', value: 'לחץ לפתיחה' },
            { type: 'inputRow', label: 'תוכן', inputType: 'textarea', prop: 'content', value: 'תוכן מוסתר...' }
        ]
    },
    'card': {
        label: '🃏 כרטיס (Card)',
        fields: [
            { type: 'inputRow', label: 'תמונה', inputType: 'text', prop: 'imgSrc', value: 'https://via.placeholder.com/300x200' },
            { type: 'inputRow', label: 'כותרת', inputType: 'text', prop: 'title', value: 'כותרת' },
            { type: 'inputRow', label: 'תיאור', inputType: 'textarea', prop: 'desc', value: 'תיאור קצר.' },
            { type: 'inputRow', label: 'טקסט כפתור', inputType: 'text', prop: 'btnText', value: 'קרא עוד' }
        ]
    }
};

// ==========================================
//   2. הסכימה הראשית של הפאנל
// ==========================================
const addElementSchema = [
    { type: 'title', label: 'הוספת אלמנט' },

    {
        type: 'inputRow',
        label: 'בחר סוג אלמנט',
        inputType: 'select',
        id: 'elementTypeSelect',
        options: Object.keys(elementsList).map(k => ({ value: k, text: elementsList[k].label })),
        oninput: (e) => renderDynamicFields(e.target.value)
    },

    // קונטיינר לשדות הדינמיים
    {
        type: 'div',
        id: 'dynamicFormFields',
        style: 'display: flex; flex-direction: column; gap: 20px; border-top: 1px solid var(--ui-10); padding-top: 15px;'
    },

    {
        type: 'inputRow',
        label: 'מזהה ייחודי (ID)',
        inputType: 'text',
        id: 'newElementId',
        placeholder: 'מומלץ לקרוא שם לאלמנט',
    },

    {
        type: 'button',
        id: 'btnAdd',
        label: '+ הוסף למסמך',
        class: 'ui-btn-primary',
        onClick: executeAdd
    }
];

// ==========================================
//   3. לוגיקה וניהול
// ==========================================


/**
 * בונה את השדות הדינמיים באמצעות ה-Builder
 */
function renderDynamicFields(type) {
    const container = $('dynamicFormFields');
    const config = elementsList[type];

    container.innerHTML = '';
    if (!config || !config.fields) return;

    // שימוש ב-Builder כדי לרנדר את רשימת השדות של האלמנט הנבחר
    build.fillChildren(container, config.fields);
}

/**
 * לוגיקת הוספה - אוספת נתונים ובודקת איפה להכניס את האלמנט
 */
function executeAdd() {
    const type = $('elementTypeSelect').value;
    const config = elementsList[type];

    let baseId = $('newElementId').value;
    baseId = createSafeId(baseId, type);
    if (!baseId) return;

    // איסוף הנתונים מהטופס הדינמי
    const data = {};
    const dynamicContainer = $('dynamicFormFields');

    // סריקת ההגדרות כדי לדעת אילו שדות לחפש
    const allProps = [];
    config.fields.forEach(field => {
        if (field.children) { // אם זה גריד
            field.children.forEach(child => allProps.push(child.prop));
        } else if (field.prop) { // אם זה inputRow
            allProps.push(field.prop);
        }
    });

    // שליפת הערכים מה-DOM
    allProps.forEach(prop => {
        const input = dynamicContainer.$1(`[data-property="${prop}"]`);
        if (input) {
            data[prop] = input.type === 'checkbox' ? input.checked : input.value;
        }
    });

    // בניית המבנה הלוגי של האלמנט
    const result = buildElementStructure(type, data, baseId);

    // החלטה איפה להוסיף את האלמנט (בתוך או אחרי ההורה)
    let parent = theElement;
    if (['IMG', 'INPUT', 'HR', 'BR', 'VIDEO'].includes(parent.tagName)) {
        if (confirm("אין אפשרות להכניס בתוך האלמנט הנבחר. להכניס אחריו?")) {
            parent = parent.parentNode;
        } else return;
    }

    // הוספה בפועל ל-DOM
    insertElementManager(result.element, parent, false);

    // יצירת חוקי CSS ושיוך שלהם
    Object.keys(result.rules).forEach(selector => {
        const rule = createRuleAndRef(selector);
        Object.entries(result.rules[selector]).forEach(([p, v]) => {
            if (v !== undefined && v !== '') {
                // הוספת px אם צריך
                if (['width', 'height', 'fontSize', 'borderRadius', 'minHeight', 'padding', 'margin'].includes(p) && !isNaN(v)) v += 'px';
                rule.style[p] = v;
            }
        });
    });
}

/**
 * בונה את מבנה ה-DOM ומכין את אובייקט העיצובים
 */
function buildElementStructure(type, data, baseId) {
    const rules = {};
    let el;

    // --- קומפוננטת כרטיס (Card) - מורכב ---
    if (type === 'card') {
        el = document.createElement('div');
        el.id = baseId;
        rules['#' + baseId] = {
            border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden',
            backgroundColor: 'var(--ui-base)', maxWidth: '300px', display: 'flex',
            flexDirection: 'column', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        };

        const img = createElement('img', { id: baseId + '_תמונה', src: data.imgSrc });
        el.appendChild(img);
        rules['#' + baseId + '_תמונה'] = { width: '100%', height: '150px', objectFit: 'cover', display: 'block' };

        const content = createElement('div', { id: baseId + '_תוכן' });
        el.appendChild(content);
        rules['#' + baseId + '_תוכן'] = { padding: '15px' };

        const h3 = createElement('h3', { id: baseId + '_כותרת', text: data.title });
        content.appendChild(h3);
        rules['#' + baseId + '_כותרת'] = { margin: '0 0 10px 0', fontSize: '18px' };

        const p = createElement('p', { text: data.desc, id: baseId + '_פירוט' });
        content.appendChild(p);
        rules['#' + baseId + '_פירוט'] = { fontSize: '14px', color: '#666', margin: '0 0 15px 0' };

        const b = document.createElement('button', { id: baseId + '_כפתור', text: data.btnText });
        content.appendChild(b);
        rules['#' + baseId + '_כפתור'] = {
            backgroundColor: '#0078d4', color: 'white', border: 'none',
            padding: '8px 16px', borderRadius: '4px'
        };
        return { element: el, rules: rules };
    }

    // --- אלמנטים סטנדרטיים ---
    el = createElement(type, { id: baseId });
    const myStyle = {};

    // -- DOM Attributes --
    if (data.text) el.innerText = data.text;
    if (data.src) el.src = data.src;
    if (data.href) el.href = data.href;
    if (data.alt) el.alt = data.alt;
    if (data.target) el.target = '_blank';

    if (type === 'video') {
        if (data.controls) el.controls = true;
        if (data.autoplay) el.autoplay = true;
        myStyle.maxWidth = '100%';
    }
    if (type === 'details') {
        const s = createElement('summary', { id: baseId + '_summary', text: data.summary });
        const p = createElement('p', { id: baseId + '_p', text: data.content });
        el.append(s, p);
        myStyle.border = '1px solid #ccc'; myStyle.padding = '10px'; myStyle.borderRadius = '4px';
    }

    // -- CSS Properties Mapping --
    const styleKeys = [
        'color', 'backgroundColor', 'fontSize', 'lineHeight',
        'borderRadius', 'width', 'minHeight', 'padding'
    ];

    styleKeys.forEach(key => {
        if (data[key]) myStyle[key] = data[key];
    });

    if (data.border) myStyle.border = '1px dashed #ccc';
    if (type === 'a') myStyle.textDecoration = 'none';
    if (type === 'button') { myStyle.border = 'none'; myStyle.cursor = 'pointer'; }

    rules['#' + baseId] = myStyle;
    return { element: el, rules: rules };
}

/**
 * יצירת id מאובטח
 */
function createSafeId(nameFromUser, tagName) {
    let safeId;
    if (nameFromUser) {
        safeId = nameFromUser.trim().replace(/\s+/g, '_');
        if ($(safeId)) return alert('שגיאה: קיים כבר אלמנט עם השם הזה. אנא בחר שם אחר.');
    } else {
        do {
            safeId = 'auto_' + tagName + '_' + Math.random().toString(36).substring(2, 9);
        } while ($(safeId));
    }
    return safeId;
}

