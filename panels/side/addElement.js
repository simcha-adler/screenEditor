// ==========================================
//   הגדרות הרכיבים (Metadata)
// ==========================================

const elementDefinitions = {
    // --- טקסט וכותרות ---
    'h1': {
        label: '🇹 כותרת ראשית (H1)',
        fields: [
            { key: 'text', label: 'תוכן הכותרת', type: 'text', default: 'כותרת ראשית חדשה' },
            { key: 'color', label: 'צבע', type: 'color', default: '#333333' }
        ]
    },
    'h2': {
        label: '🇹 כותרת משנית (H2)',
        fields: [
            { key: 'text', label: 'תוכן הכותרת', type: 'text', default: 'כותרת משנה' },
            { key: 'color', label: 'צבע', type: 'color', default: '#555555' }
        ]
    },
    'p': {
        label: '📝 פסקה (Paragraph)',
        fields: [
            { key: 'text', label: 'תוכן הטקסט', type: 'textarea', default: 'לורם איפסום דולור סיט אמט...' },
            { key: 'fontSize', label: 'גודל גופן (px)', type: 'number', default: '16' },
            { key: 'lineHeight', label: 'גובה שורה', type: 'number', default: '1.5' }
        ]
    },

    // --- מדיה ---
    'img': {
        label: '🖼️ תמונה (Image)',
        fields: [
            { key: 'src', label: 'כתובת תמונה (URL)', type: 'text', default: 'https://via.placeholder.com/400x300' },
            { key: 'alt', label: 'תיאור (Alt)', type: 'text', default: 'תמונה לדוגמה' },
            { key: 'width', label: 'רוחב (%)', type: 'number', default: '100' },
            { key: 'borderRadius', label: 'עיגול פינות (px)', type: 'number', default: '8' }
        ]
    },
    'video': {
        label: '🎬 וידאו (Video)',
        fields: [
            { key: 'src', label: 'כתובת וידאו (MP4/WebM)', type: 'text', default: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { key: 'controls', label: 'הצג פקדים (Play/Pause)', type: 'checkbox', default: true },
            { key: 'autoplay', label: 'ניגון אוטומטי', type: 'checkbox', default: false }
        ]
    },

    // --- אינטראקציה ---
    'button': {
        label: '🔘 כפתור (Button)',
        fields: [
            { key: 'text', label: 'טקסט על הכפתור', type: 'text', default: 'לחץ כאן' },
            { key: 'backgroundColor', label: 'צבע רקע', type: 'color', default: '#0078d4' },
            { key: 'color', label: 'צבע טקסט', type: 'color', default: '#ffffff' },
            { key: 'borderRadius', label: 'עגלגלות (px)', type: 'number', default: '4' },
            { key: 'padding', label: 'ריווח פנימי (px)', type: 'text', default: '10px 20px' }
        ]
    },
    'a': {
        label: '🔗 קישור (Link)',
        fields: [
            { key: 'text', label: 'טקסט הקישור', type: 'text', default: 'עבור לאתר' },
            { key: 'href', label: 'כתובת יעד (URL)', type: 'text', default: 'https://google.com' },
            { key: 'target', label: 'פתח בחלון חדש', type: 'checkbox', default: true },
            { key: 'color', label: 'צבע הקישור', type: 'color', default: '#0078d4' }
        ]
    },

    // --- מבנה מתקדם ---
    'div': {
        label: '🔲 קופסה (Container)',
        fields: [
            { key: 'minHeight', label: 'גובה מינימלי (px)', type: 'number', default: '100' },
            { key: 'backgroundColor', label: 'צבע רקע', type: 'color', default: '#f9f9f9' },
            { key: 'padding', label: 'ריווח פנימי', type: 'text', default: '20px' },
            { key: 'border', label: 'מסגרת', type: 'checkbox', default: true }
        ]
    },
    'details': {
        label: '🔻 אקורדיון (Details)',
        fields: [
            { key: 'summary', label: 'כותרת האקורדיון', type: 'text', default: 'לחץ כדי לפתוח' },
            { key: 'content', label: 'תוכן מוסתר', type: 'textarea', default: 'תוכן האקורדיון...' }
        ]
    },
    'card': { // אלמנט מורכב עם תתי-אלמנטים!
        label: '🃏 כרטיס מידע (Card Component)',
        fields: [
            { key: 'imgSrc', label: 'תמונת כרטיס', type: 'text', default: 'https://via.placeholder.com/300x200' },
            { key: 'title', label: 'כותרת הכרטיס', type: 'text', default: 'כותרת הכרטיס' },
            { key: 'desc', label: 'תיאור קצר', type: 'textarea', default: 'תיאור קצר אודות הפריט.' },
            { key: 'btnText', label: 'טקסט כפתור', type: 'text', default: 'קרא עוד' }
        ]
    }
};


// ==========================================
//   בניית הממשק (HTML & Setup)
// ==========================================

const htmlAddElement = /* html */ `
    <h4>הוספת אלמנט חכם</h4>
    
    <label class="design-control">
        <span>סוג האלמנט:</span>
        <select id="elementTypeSelect" style="width: 100%; padding: 8px; margin-top: 5px; font-weight:bold;">
        </select>
    </label>

    <hr style="border: 0; border-top: 1px dashed #ccc; margin: 15px 0;">

    <div id="dynamicFormFields"></div>

    <hr style="border: 0; border-top: 1px dashed #ccc; margin: 15px 0;">

    <label class="design-control">
        <span>מזהה ייחודי - מומלץ:</span>
        <input type="text" id="newElementId" placeholder="למשל: my_section" style="width: 100%; direction:ltr;">
        <span style="font-size:10px; color:#888;">השאר ריק ליצירה אוטומטית</span>
    </label>

    <button id="btnSmartAdd" style="
        background-color: #0078d4; 
        color: white; 
        border: none; 
        padding: 12px; 
        border-radius: 4px; 
        cursor: pointer; 
        margin-top: 15px;
        width: 100%;
        font-weight: bold;
        display: flex; align-items: center; justify-content: center; gap: 8px;">
         הוסף למסמך
    </button>
`;

// טעינת הפאנל לתוך ה-DOM
$('panel-add-element').innerHTML = htmlAddElement;

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

    // כפתור הוספה
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
        wrapper.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.fontSize = '12px';
        label.style.color = '#555';
        label.style.marginBottom = '3px';
        label.textContent = field.label;

        let input;

        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 3;
            input.style.resize = 'vertical';
        } else if (field.type === 'checkbox') {
            input = document.createElement('input');
            input.type = 'checkbox';
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.gap = '10px';
            wrapper.style.marginBottom = '5px';
            label.style.marginBottom = '0';
            // הופכים סדר לצ'קבוקס
            wrapper.appendChild(input);
            wrapper.appendChild(label);
            input.checked = field.default;
            input.id = 'field_' + field.key;
            container.appendChild(wrapper);
            return;
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }

        // הגדרות עיצוב וערכים לכל השדות (חוץ מצ'קבוקס שטופל למעלה)
        input.style.width = '100%';
        input.style.padding = '6px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '3px';
        input.style.boxSizing = 'border-box';

        if (field.default) {
            input.value = field.default;
        }

        input.id = 'field_' + field.key;
        wrapper.appendChild(label);
        wrapper.appendChild(input);
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
    const customId = $('newElementId').value.trim().replace(/\s+/g, '_');

    // 1. איסוף המידע מהטופס
    const data = {};
    config.fields.forEach(field => {
        const input = $('field_' + field.key);
        if (field.type === 'checkbox') {
            data[field.key] = input.checked;
        } else {
            data[field.key] = input.value;
        }
    });

    // 2. קביעת ID ראשי
    let baseId = customId;
    if (!baseId) {
        do {
            baseId = 'auto-' + type + '-' + Math.random().toString(36).substring(2, 9);
        } while ($(baseId))
    } else {
        baseId = createSafeId(baseId);
        if (!baseId) return;
    }

    // 3. בניית המבנה (DOM + Styles)
    // הפונקציה מחזירה גם את האלמנט וגם מפה של סלקטורים ועיצובים
    const result = buildElementStructure(type, data, baseId);

    // 4. הוספה ל-DOM
    let parent = theElement;
    const voidTags = ['IMG', 'INPUT', 'HR', 'BR', 'VIDEO'];
    if (voidTags.includes(parent.tagName)) {
        parent = parent.parentNode;
    }
    parent.appendChild(result.element);

    // 5. יצירת חוקי CSS והחלת העיצובים
    // עוברים על כל החוקים שחזרו מהבנייה (יכול להיות יותר מאחד בקומפוננטות)
    Object.keys(result.rules).forEach(selector => {
        const styleProps = result.rules[selector];

        // יצירת חוק במערכת (Manager.js)
        const rule = createRuleAndRef(selector);

        // החלת המאפיינים
        Object.entries(styleProps).forEach(([prop, value]) => {
            if (value !== undefined && value !== '') {
                // המרה למספר אם צריך (למשל הוספת px)
                if (['width', 'height', 'fontSize', 'borderRadius', 'minHeight', 'padding', 'margin'].includes(prop)) {
                    // אם זה מספר בלבד, נוסיף px. אם יש כבר יחידה (%), נשאיר.
                    if (!isNaN(value)) value += 'px';
                }
                rule.style[prop] = value;
            }
        });
    });

    // 6. סיום
    renderTree();
    updateSelectedElement(result.element);
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

        // 3. תוכן טקסטואלי (עוטף)
        const contentDiv = document.createElement('div');
        contentDiv.id = baseId + '_content';
        el.appendChild(contentDiv);
        rules['#' + baseId + '_content'] = {
            padding: '15px'
        };

        // 4. כותרת
        const h3 = document.createElement('h3');
        h3.id = baseId + '_title';
        h3.innerText = data.title;
        contentDiv.appendChild(h3);
        rules['#' + baseId + '_title'] = {
            margin: '0 0 10px 0',
            fontSize: '18px',
            color: '#333'
        };

        // 5. תיאור
        const p = document.createElement('p');
        p.id = baseId + '_desc';
        p.innerText = data.desc;
        contentDiv.appendChild(p);
        rules['#' + baseId + '_desc'] = {
            fontSize: '14px',
            color: '#666',
            margin: '0 0 15px 0',
            lineHeight: '1.4'
        };

        // 6. כפתור
        const btn = document.createElement('button');
        btn.id = baseId + '_btn';
        btn.innerText = data.btnText;
        contentDiv.appendChild(btn);
        rules['#' + baseId + '_btn'] = {
            backgroundColor: '#0078d4',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
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
    if (data.type) el.type = data.type;

    if (type === 'video') {
        if (data.controls) el.controls = true;
        if (data.autoplay) el.autoplay = true;
        myStyle.maxWidth = '100%';
    }

    if (type === 'details') {
        // טיפול מיוחד באקורדיון (DOM פנימי)
        const summary = document.createElement('summary');
        summary.innerText = data.summary;
        // אי אפשר לתת ID לילדים כאן בצורה פשוטה בלי לסבך, 
        // אז ניתן להם סטייל בסיסי ונשאיר את העיצוב לראשי
        summary.id = baseId + '-summary'
        const p = document.createElement('p');
        p.innerText = data.content;
        p.id = baseId + '_p'
        el.appendChild(summary);
        el.appendChild(p);

        myStyle.border = '1px solid #ccc';
        myStyle.padding = '10px';
        myStyle.borderRadius = '4px';
        myStyle.backgroundColor = '#fafafa';
    }

    // -- CSS Properties Mapping --
    // מיפוי ישיר: אם המפתח קיים ב-data, נעביר אותו לסטייל
    const styleKeys = [
        'color', 'backgroundColor', 'fontSize', 'lineHeight',
        'borderRadius', 'border', 'width', 'minHeight', 'padding'
    ];

    styleKeys.forEach(key => {
        if (data[key]) {
            if (key === 'border' && data[key] === true) {
                myStyle.border = '1px dashed #ccc'; // ברירת מחדל למסגרת
            } else if (!(key === 'border' && data[key] === false)) {
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

    // הוספת החוק לרשימה
    rules['#' + baseId] = myStyle;

    return { element: el, rules: rules };
}


/**
 * יצירת id מאובטח מהשם שהכניס המשתמש
 */
function createSafeId(name) {
    const safeId = name.trim().replace(/\s+/g, '_');

    // בדיקת כפילות ID
    if ($(safeId)) {
        return alert('שגיאה: קיים כבר אלמנט עם השם הזה. אנא בחר שם אחר.');
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