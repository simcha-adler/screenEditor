// ==========================================
//   הגדרות הרכיבים (Metadata)
// ==========================================
// (נשאר זהה לקוד המקורי שלך - לא שיניתי את ההגדרות)
const elementDefinitions = {
    'h1': {
        label: '🇹 כותרת ראשית (H1)',
        fields: [
            { key: 'text', label: 'תוכן', type: 'text', default: 'כותרת ראשית' },
            { key: 'color', label: 'צבע', type: 'color', default: '#333333' }
        ]
    },
    'h2': {
        label: '🇹 כותרת משנית (H2)',
        fields: [
            { key: 'text', label: 'תוכן', type: 'text', default: 'כותרת משנה' },
            { key: 'color', label: 'צבע', type: 'color', default: '#555555' }
        ]
    },
    'p': {
        label: '📝 פסקה (Paragraph)',
        fields: [
            { key: 'text', label: 'תוכן', type: 'textarea', default: 'טקסט לדוגמה...' },
            { key: 'fontSize', label: 'גודל (px)', type: 'number', default: '16' },
            { key: 'lineHeight', label: 'גובה שורה', type: 'number', default: '1.5' }
        ]
    },
    'img': {
        label: '🖼️ תמונה (Image)',
        fields: [
            { key: 'src', label: 'URL', type: 'text', default: 'https://via.placeholder.com/400x300' },
            { key: 'alt', label: 'תיאור', type: 'text', default: 'תמונה' },
            { key: 'width', label: 'רוחב (%)', type: 'number', default: '100' },
            { key: 'borderRadius', label: 'עיגול (px)', type: 'number', default: '8' }
        ]
    },
    'video': {
        label: '🎬 וידאו (Video)',
        fields: [
            { key: 'src', label: 'URL', type: 'text', default: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { key: 'controls', label: 'פקדים', type: 'checkbox', default: true },
            { key: 'autoplay', label: 'ניגון אוטומטי', type: 'checkbox', default: false }
        ]
    },
    'button': {
        label: '🔘 כפתור (Button)',
        fields: [
            { key: 'text', label: 'טקסט', type: 'text', default: 'לחץ כאן' },
            { key: 'backgroundColor', label: 'רקע', type: 'color', default: '#0078d4' },
            { key: 'color', label: 'טקסט', type: 'color', default: '#ffffff' },
            { key: 'borderRadius', label: 'עיגול (px)', type: 'number', default: '4' },
            { key: 'padding', label: 'ריווח', type: 'text', default: '10px 20px' }
        ]
    },
    'a': {
        label: '🔗 קישור (Link)',
        fields: [
            { key: 'text', label: 'טקסט', type: 'text', default: 'עבור לאתר' },
            { key: 'href', label: 'URL', type: 'text', default: 'https://google.com' },
            { key: 'target', label: 'חלון חדש', type: 'checkbox', default: true },
            { key: 'color', label: 'צבע', type: 'color', default: '#0078d4' }]
    },
    'div': {
        label: '🔲 קופסה (Container)',
        fields: [
            { key: 'minHeight', label: 'גובה מינ\' (px)', type: 'number', default: '100' },
            { key: 'backgroundColor', label: 'רקע', type: 'color', default: '#f9f9f9' },
            { key: 'padding', label: 'ריווח', type: 'text', default: '20px' },
            { key: 'border', label: 'מסגרת', type: 'checkbox', default: true }
        ]
    },
    'details': {
        label: '🔻 אקורדיון (Details)',
        fields: [
            { key: 'summary', label: 'כותרת', type: 'text', default: 'לחץ לפתיחה' },
            { key: 'content', label: 'תוכן', type: 'textarea', default: 'תוכן מוסתר...' }
        ]
    },
    'card': {
        label: '🃏 כרטיס (Card)',
        fields: [
            { key: 'imgSrc', label: 'תמונה', type: 'text', default: 'https://via.placeholder.com/300x200' },
            { key: 'title', label: 'כותרת', type: 'text', default: 'כותרת' },
            { key: 'desc', label: 'תיאור', type: 'textarea', default: 'תיאור קצר.' },
            { key: 'btnText', label: 'כפתור', type: 'text', default: 'קרא עוד' }
        ]
    }
};

// ==========================================
//   בניית הממשק (HTML & Setup)
// ==========================================

const htmlAddElement = /* html */ `
    <style>
        .add-element-header { margin-bottom: 15px; }
        .form-group { margin-bottom: 12px; }
        .form-label { display: block; font-size: 12px; font-weight: 500; color: #444; margin-bottom: 5px; }
        
        .styled-select, .styled-input, .styled-textarea {
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 13px;
            background: #fff;
            box-sizing: border-box;
            transition: border-color 0.2s;
        }
        .styled-select:focus, .styled-input:focus, .styled-textarea:focus {
            border-color: #0078d4;
            outline: none;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #f9f9f9;
            padding: 8px;
            border-radius: 6px;
            border: 1px solid #eee;
        }
        .checkbox-group input { margin: 0; }
        .checkbox-group label { margin: 0; cursor: pointer; flex: 1;}

        .btn-primary {
            background-color: #0078d4;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            width: 100%;
            font-weight: 600;
            font-size: 14px;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            transition: background 0.2s;
            margin-top: 20px;
        }
        .btn-primary:hover { background-color: #0063b1; }
        
        .separator { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
        .element-id-hint { font-size: 11px; color: #888; margin-top: 4px; display: block; }
    </style>

    <h4>הוספת אלמנט</h4>
    
    <div class="form-group">
        <label class="form-label">בחר סוג אלמנט:</label>
        <div style="position:relative;">
            <select id="elementTypeSelect" class="styled-select" style="appearance: none; font-weight:bold;">
            </select>
            <div style="position:absolute; left:10px; top:50%; transform:translateY(-50%); pointer-events:none; color:#666;">▼</div>
        </div>
    </div>

    <div class="separator"></div>

    <div id="dynamicFormFields"></div>

    <div class="separator"></div>

    <div class="form-group">
        <label class="form-label">מזהה ייחודי - מומלץ</label>
        <input type="text" id="newElementId" class="styled-input" placeholder="למשל: hero_section" style="direction:ltr;">
        <span class="element-id-hint">השאר ריק ליצירה אוטומטית</span>
    </div>

    <button id="btnSmartAdd" class="btn-primary">
         <span>+</span> הוסף למסמך
    </button>
`;

htmlAddElement.into('#panel-add-element');

function loadAddElementPanel() {
    const select = $('elementTypeSelect');
    select.innerHTML = ''; // איפוס

    // מילוי ה-Select
    Object.keys(elementDefinitions).forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = elementDefinitions[type].label;
        select.appendChild(option);
    });

    // האזנה לשינוי סוג האלמנט -> בניית הטופס מחדש
    select.when('change', () => {
        renderDynamicFields(select.value);
    });

    // אתחול ראשוני (הצג שדות של הסוג הראשון)
    renderDynamicFields(select.value);
    $('btnSmartAdd').whenClick(executeSmartAdd);
}

/**
 * בונה את השדות (Inputs) בהתאם לסוג שנבחר
 */
function renderDynamicFields(type) {
    const container = $('dynamicFormFields');
    container.innerHTML = '';
    const config = elementDefinitions[type];
    if (!config || !config.fields) return;

    config.fields.forEach(field => {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group';

        if (field.type === 'checkbox') {
            wrapper.className = 'checkbox-group'; // עיצוב שונה לצ'קבוקס

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = field.default;
            input.id = 'field_' + field.key;

            const label = document.createElement('label');
            label.htmlFor = input.id; // קשירה ללחיצה
            label.textContent = field.label;
            label.className = 'form-label';

            wrapper.appendChild(input);
            wrapper.appendChild(label);
        } else {
            const label = document.createElement('label');
            label.className = 'form-label';
            label.textContent = field.label;
            wrapper.appendChild(label);

            let input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.className = 'styled-textarea';
                input.rows = 3;
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.className = 'styled-input';
                // אם זה צבע, ניתן לו גובה קבוע שיראה טוב
                if (field.type === 'color') input.style.height = '35px';
            }

            if (field.default !== undefined) input.value = field.default;
            input.id = 'field_' + field.key;
            wrapper.appendChild(input);
        }
        container.appendChild(wrapper);
    });
}


// ==========================================
//   לוגיקת הוספה חכמה (Architecture Compliant)
// ==========================================

/**
 * הפונקציה הראשית שיוצרת את האלמנט לפי הנתונים בטופס
 */
function executeSmartAdd() {
    const type = $('elementTypeSelect').value;
    const config = elementDefinitions[type];

    let baseId = $('newElementId').value;
    baseId = createSafeId(baseId, type);
    if (!baseId) return;

    const data = {};
    config.fields.forEach(field => {
        const input = $('field_' + field.key);
        data[field.key] = field.type === 'checkbox' ? input.checked : input.value;
    });

    const result = buildElementStructure(type, data, baseId);
    let parent = theElement;
    if (['IMG', 'INPUT', 'HR', 'BR', 'VIDEO'].includes(parent.tagName)) {
        if (confirm("אין אפשרות להכניס בתוך האלמנט הנבחר. להכניס אחריו?")) {
            parent = parent.parentNode;
        } else return;
    }

    insertElementManager(result.element, parent, false);

    Object.keys(result.rules).forEach(selector => {
        const rule = createRuleAndRef(selector);
        Object.entries(result.rules[selector]).forEach(([p, v]) => {
            if (v !== undefined && v !== '') {
                if (['width', 'height', 'fontSize', 'borderRadius', 'minHeight', 'padding', 'margin'].includes(p) && !isNaN(v)) v += 'px';
                rule.style[p] = v;
            }
        });
    });
}

/**
 * בונה את מבנה ה-DOM ומכין את אובייקט העיצובים
 * @returns { element: HTMLElement, rules: { 'selector': { prop: val } } }
 */
function buildElementStructure(type, data, baseId) {
    const rules = {};
    let el;

    // --- קומפוננטת כרטיס (Card) - מורכב ---
    if (type === 'card') {
        // 1. מיכל ראשי
        el = document.createElement('div');
        el.id = baseId;
        rules['#' + baseId] = {
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#fff',
            maxWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        };

        // 2. תמונה
        const img = document.createElement('img');
        img.id = baseId + '_img';
        img.src = data.imgSrc;
        el.appendChild(img);
        rules['#' + baseId + '_img'] = {
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            display: 'block'
        };

        // 3. תוכן הכרטיס (עוטף)
        const content = document.createElement('div');
        content.id = baseId + '_content';
        el.appendChild(content);
        rules['#' + baseId + '_content'] = { padding: '15px' };

        // 4. כותרת
        const h3 = document.createElement('h3');
        h3.id = baseId + '_title';
        h3.innerText = data.title;
        content.appendChild(h3);
        rules['#' + baseId + '_title'] = { margin: '0 0 10px 0', fontSize: '18px' };

        // 5. תיאור
        const p = document.createElement('p');
        p.innerText = data.desc;
        p.id = baseId + '_desc';
        content.appendChild(p);
        rules['#' + baseId + '_desc'] = {
            fontSize: '14px',
            color: '#666',
            margin: '0 0 15px 0'
        };
        // 6. כפתור
        const b = document.createElement('button');
        b.innerText = data.btnText;
        b.id = baseId + '_b';
        content.appendChild(b);
        rules['#' + baseId + '_b'] = {
            backgroundColor: '#0078d4',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px'
        };
        return { element: el, rules: rules };
    }

    // --- אלמנטים סטנדרטיים ---

    el = createElement(type, { id: baseId });

    // אובייקט הסטייל של האלמנט הראשי
    const myStyle = {};

    // מיפוי שדות מידע ל-DOM Attributes או ל-CSS Styles

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
        const s = document.createElement('summary');
        p.id = baseId + '_summary'
        s.innerText = data.summary;
        const p = document.createElement('p');
        p.id = baseId + '_p'
        p.innerText = data.content;
        el.append(s, p);
        myStyle.border = '1px solid #ccc';
        myStyle.padding = '10px';
        myStyle.borderRadius = '4px';
    }

    // -- CSS Properties Mapping --
    // מיפוי ישיר: אם המפתח קיים ב-data, נעביר אותו לסטייל
    const styleKeys = [
        'color', 'backgroundColor', 'fontSize', 'lineHeight',
        'borderRadius', 'border', 'width', 'minHeight', 'padding'
    ];

    styleKeys.forEach(key => {
        if (data[key]) {
            if (key === 'border') {
                if (data[key] === true)
                    myStyle.border = '1px dashed #ccc'; // ברירת מחדל למסגרת
            } else {
                myStyle[key] = data[key];
            }
        }
    });

    // כפתור וקישורים - הסרת קו תחתון ועיצוב בסיסי
    if (type === 'a') myStyle.textDecoration = 'none';
    if (type === 'button') {
        myStyle.border = 'none';
        myStyle.cursor = 'pointer';
    }
    rules['#' + baseId] = myStyle;
    return { element: el, rules: rules };
}


/**
 * יצירת id מאובטח מהשם שהכניס המשתמש
 */
function createSafeId(nameFromUser, tagName) {
    let safeId;
    if (nameFromUser) {
        safeId = nameFromUser.trim().replace(/\s+/g, '_');
        if ($(safeId))
            return alert('שגיאה: קיים כבר אלמנט עם השם הזה. אנא בחר שם אחר.');
    } else {
        do {
            safeId = 'auto-' + tagName + '-' + Math.random().toString(36).substring(2, 9);
        } while ($(safeId));
    }
    return safeId;
}


function setInitialStyles(selector, stylesObject) {
    // 1. יצירת רפרנס לחוק ב-State אם אינו קיים (פעם אחת בלבד)
    if (!styleState[selector]) {
        createRuleAndRef(selector);
    }

    // 2. שליפת ה-Rule מתוך ה-State
    const rule = styleState[selector].rule;

    // 3. עדכון ישיר של ה-style בחוק ה-CSS בלבד
    if (rule) {
        for (const [prop, value] of Object.entries(stylesObject)) {
            rule.style[prop] = value;
        }
    }
}

// הפעלה ראשונית
loadAddElementPanel();