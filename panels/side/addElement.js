const htmlAddElement = /* html */ `
<h4>הוספת אלמנט חדש</h4>

<div class="design-control-grid-4" style="grid-template-columns: 1fr; gap: 15px;">
    
    <label class="design-control" style="display:block;">
        <span>בחר מה להוסיף:</span>
        <select id="newElementType" style="width: 100%; padding: 8px; margin-top: 5px;">
            <option value="div">🔲 קופסה / אזור תוכן</option>
            <option value="h2">T כותרת</option>
            <option value="p">📝 טקסט רגיל (פסקה)</option>
            <option value="button">🔘 כפתור לחיץ</option>
            <option value="img">🖼️ תמונה</option>
            <option value="input">⌨️ שדה כתיבה (Input)</option>
            <option value="hr">➖ קו מפריד</option>
        </select>
    </label>

    <label class="design-control" style="display:block;">
        <span>תן שם לאלמנט:</span>
        <input type="text" id="newElementName" placeholder="חובה להזין שם!" style="width: 100%; padding: 8px; margin-top: 5px;">
    </label>

    <button id="btnAddElementAction" style="
        background-color: #0078d4; 
        color: white; 
        border: none; 
        padding: 10px; 
        border-radius: 4px; 
        cursor: pointer; 
        margin-top: 10px;
        width: 100%;">
        הוסף למסמך
    </button>

</div>
`;

function loadAddElementPanel() {
    htmlAddElement.into('#panel-add-element');
    attachAddElementListeners();
}

function attachAddElementListeners() {
    const btn = $('btnAddElementAction');
    const typeSelect = $('newElementType');
    const nameInput = $('newElementName');

    if (btn) {
        btn.whenClick(() => {
            const type = typeSelect.value;
            const rawName = nameInput.value;
            const newDomEl = addElementmanager(type, rawName);
            if (newDomEl) {
                // איפוס השדה לאחר ההוספה
                nameInput.value = '';
                updateSelectedElement(newDomEl);
                toggleActivityPanel($1('.activity-btn[data-panel="panel-design"]'));
            }
        });
    }
}

function addElementmanager(type, rawName) {
    if (!rawName) return alert('אנא בחר שם לאלמנט החדש');

    // יצירת האלמנטים (בזיכרון בלבד)
    const safeId = createSafeId(rawName);
    if (!safeId) return;// נכשל ביצירה (למשל שם כפול)
    const newDomEl = createElement(type, { id: safeId });
    const newTreeEl = createTreeNode(newDomEl);

    const parentTree = tree.$1(`.tree-node[data-editor-id="${theElement.id}"]`);

    insertElementmanager(newTreeEl, parentTree, newDomEl, theElement);
    createRuleAndRef('#' + safeId);
    // החלת עיצוב בסיסי
    applyDefaultSettings(newDomEl);

    return newDomEl;
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

/**
 * פונקציית עזר שנותנת לאלמנטים מראה התחלתי
 */
function applyDefaultSettings(el) {
    const selector = '#' + el.id;
    const type = el.tagName.toLowerCase();

    switch (type) {
        case 'div':
            setInitialStyles(selector, {
                width: '100%',
                minHeight: '100px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                border: '1px dashed #ccc'
            });
            el.innerText = 'אזור תוכן חדש';
            break;

        case 'h2':
            setInitialStyles(selector, {
                color: '#333'
            });
            el.innerText = 'כותרת חדשה';
            break;

        case 'p':
            setInitialStyles(selector, {
                lineHeight: '1.6',
                marginBottom: '10px'
            });
            el.innerText = 'זוהי פסקה חדשה...';
            break;

        case 'button':
            setInitialStyles(selector, {
                padding: '10px 20px',
                backgroundColor: '#0078d4',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            });
            el.innerText = 'לחץ עלי';
            break;

        case 'img':
            setInitialStyles(selector, {
                maxWidth: '100%',
                borderRadius: '8px',
                display: 'block' // מונע רווחים מוזרים בתמונות
            });
            el.src = 'https://via.placeholder.com/300x200?text=Image';
            break;

        case 'input':
            setInitialStyles(selector, {
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
            });
            el.placeholder = 'הקלד כאן...';
            break;

        case 'hr':
            setInitialStyles(selector, {
                margin: '20px 0',
                border: 'none', // איפוס
                borderTop: '1px solid #eee'
            });
            break;
    }
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

loadAddElementPanel();