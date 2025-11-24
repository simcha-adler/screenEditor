const htmlAddElement = /* html */ `
<div id="panel-add-element" class="design-panel" style="display: block;">
    <h4>הוספת אלמנט חדש</h4>
    
    <div class="design-control-grid-4" style="grid-template-columns: 1fr; gap: 15px;">
        
        <label class="design-control" style="display:block;">
            <span>בחר מה להוסיף:</span>
            <select id="newElementType" style="width: 100%; padding: 8px; margin-top: 5px;">
                <option value="div">🔲 קופסה / אזור תוכן</option>
                <option value="h2">🇹 כותרת</option>
                <option value="p">📝 טקסט רגיל (פסקה)</option>
                <option value="button">🔘 כפתור לחיץ</option>
                <option value="img">🖼️ תמונה</option>
                <option value="input">⌨️ שדה כתיבה (Input)</option>
                <option value="hr">➖ קו מפריד</option>
            </select>
        </label>

        <label class="design-control" style="display:block;">
            <span>תן שם לאלמנט (באנגלית או עברית):</span>
            <input type="text" id="newElementName" placeholder="לדוגמה: הכפתור_שלי" style="width: 100%; padding: 8px; margin-top: 5px;">
            <span style="font-size: 11px; color: #888;">הרווחים יהפכו למקפים תחתונים באופן אוטומטי.</span>
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
</div>
`;

function loadAddElementPanel() {
    editPanel.innerHTML = htmlAddElement;
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

            if (!rawName) {
                alert('אנא בחר שם לאלמנט החדש');
                return;
            }

            // שליחה למנהל (הלוגיקה נמצאת שם)
            addNewBlock(type, rawName);

            // איפוס השדה לאחר ההוספה
            nameInput.value = '';
        });
    }
}

function addNewBlock(type, rawName) {
    // 1. יצירת ID תקין: מחליף רווחים במקף תחתון
    // מסיר תווים מיוחדים שעלולים לשבור קוד, משאיר עברית/אנגלית/מספרים
    const safeId = rawName.trim().replace(/\s+/g, '_');

    // בדיקה אם ה-ID כבר קיים (למנוע כפילויות)
    if (document.getElementById(safeId)) {
        alert('שגיאה: קיים כבר אלמנט עם השם הזה. אנא בחר שם אחר.');
        return;
    }

    // 2. יצירת האלמנט
    const el = document.createElement(type);
    el.id = safeId;

    // 3. הגדרת ערכי ברירת מחדל (לפי דרישת "אנשים ללא ידע בעיצוב")
    //    applyDefaultSettings(el, type);

    // 4. הוספה ל-DOM
    // אם יש אלמנט נבחר והוא יכול להכיל ילדים (כמו DIV) - נוסיף לתוכו
    // אחרת, נוסיף אחריו (או לעורך הראשי)
    let targetContainer = theElement;

    // מקרים שבהם אי אפשר להכניס לתוך האלמנט (למשל אם בחרנו תמונה או אינפוט)
    const voidElements = ['IMG', 'INPUT', 'HR', 'BR'];

    if (!targetContainer || voidElements.includes(targetContainer.tagName)) {
        targetContainer = editor; // ברירת מחדל - הוסף לדף הראשי
    }

    targetContainer.appendChild(el);

    // 5. בחירת האלמנט החדש ופתיחת פאנל העיצוב
    updateSelectedElement(el);
    toggleActivityPanel('panel-design'); // מעבר אוטומטי לעיצוב
}

/**
 * פונקציית עזר שנותנת לאלמנטים מראה התחלתי
 */
function applyDefaultSettings(el, type) {
    switch (type) {
        case 'div':
            el.style.width = '100%';
            el.style.minHeight = '100px';
            el.style.padding = '20px';
            el.style.backgroundColor = '#f9f9f9';
            el.style.border = '1px dashed #ccc';
            el.innerText = 'אזור תוכן חדש (גרירה ושחרור אלמנטים לכאן)';
            break;

        case 'h2':
            el.innerText = 'כותרת חדשה';
            el.style.color = '#333';
            break;

        case 'p':
            el.innerText = 'זוהי פסקה חדשה. לחץ כאן כדי לערוך את הטקסט.';
            el.style.lineHeight = '1.6';
            break;

        case 'button':
            el.innerText = 'לחץ עלי';
            el.style.padding = '10px 20px';
            el.style.backgroundColor = '#0078d4';
            el.style.color = '#fff';
            el.style.border = 'none';
            el.style.borderRadius = '4px';
            el.style.cursor = 'pointer';
            break;

        case 'img':
            el.src = 'https://via.placeholder.com/300x200?text=Image';
            el.style.maxWidth = '100%';
            el.style.borderRadius = '8px';
            break;

        case 'input':
            el.placeholder = 'הקלד כאן...';
            el.style.padding = '8px';
            el.style.border = '1px solid #ccc';
            el.style.borderRadius = '4px';
            break;

        case 'hr':
            el.style.margin = '20px 0';
            el.style.border = '0';
            el.style.borderTop = '1px solid #eee';
            break;
    }
}

