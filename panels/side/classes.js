const htmlClasses = /* html */ `

    <h4>ניהול קלאסים (CSS Classes)</h4>
    
    <div class="control-group">
        <label>קלאסים משויכים לאלמנט:</label>
        <div id="activeClassesList" class="tags-container">
            <span style="color:#999; font-size:12px;">אין קלאסים משויכים</span>
        </div>
    </div>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

    <div class="control-group">
        <label>הוסף קלאס (חדש או קיים):</label>
        <div style="display: flex; gap: 5px;">
            <input type="text" id="classInput" placeholder="שם הקלאס (למשל: my-btn)..." style="flex-grow: 1; padding: 5px;">
            <button id="btnConnectClass" class="action-btn">שייך</button>
        </div>
        <button id="btnCreateRule" class="secondary-btn" style="margin-top:5px; width:100%; font-size:11px;">🛠️ צור חוק CSS חדש לקלאס זה</button>
    </div>

    <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">

    <div class="control-group">
        <label>קלאסים קיימים במערכת:</label>
        <div id="systemClassesList" class="list-container">
            </div>
    </div>


<style>
    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 5px;
        min-height: 30px;
        padding: 5px;
        background: #f9f9f9;
        border: 1px solid #eee;
        border-radius: 4px;
    }
    .class-tag {
        background-color: #e1f0fa;
        color: #005a9e;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .remove-class-btn {
        cursor: pointer;
        font-weight: bold;
        color: #005a9e;
    }
    .remove-class-btn:hover { color: red; }
    
    .list-container {
        max-height: 150px;
        overflow-y: auto;
        border: 1px solid #eee;
        background: #fff;
    }
    .system-class-item {
        padding: 5px 10px;
        font-size: 13px;
        border-bottom: 1px solid #f5f5f5;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
    }
    .system-class-item:hover { background-color: #f0f0f0; }
    
    .action-btn { background: #0078d4; color: white; border: none; border-radius: 3px; cursor: pointer; }
    .secondary-btn { background: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; cursor: pointer; color: #333; }
</style>
`;

htmlClasses.into('#panel-classes');


function loadClassesPanel() {
    refreshClassesView();
    attachClassesListeners();
}

function refreshClassesView() {
    if (!theElement) return;

    // 1. עדכון רשימת הקלאסים הפעילים
    const container = $('activeClassesList');
    container.innerHTML = '';

    if (theElement.classList.length === 0) {
        container.innerHTML = '<span style="color:#999; font-size:12px;">אין קלאסים משויכים</span>';
    } else {
        theElement.classList.forEach(cls => {
            const tag = document.createElement('div');
            tag.className = 'class-tag';
            tag.innerHTML = `<span>.${cls}</span> <span class="remove-class-btn" data-class="${cls}">×</span>`;
            container.appendChild(tag);
        });
    }

    // 2. עדכון רשימת הקלאסים הקיימים במערכת (מתוך ה-StyleSheet)
    const systemList = $('systemClassesList');
    systemList.innerHTML = '';

    // סריקת ה-styles כדי למצוא קלאסים קיימים
    const knownClasses = new Set();

    // נבדוק ב-styleState שלנו
    Object.keys(styleState).forEach(selector => {
        if (selector.startsWith('.')) {
            // ניקוי פסאודו-סלקטורים כמו .btn:hover -> .btn
            const cleanName = selector.split(':')[0].substring(1);
            knownClasses.add(cleanName);
        }
    });

    // גם נבדוק ב-DOM למקרה שיש קלאסים שלא נרשמו ב-state
    // (אופציונלי - כרגע נסתמך על מה שהמשתמש יצר דרכנו)

    knownClasses.forEach(clsName => {
        const item = document.createElement('div');
        item.className = 'system-class-item';
        item.innerHTML = `<span>.${clsName}</span> <span style="font-size:10px; color:green;">הוסף +</span>`;
        item.onclick = () => addClassToElement(clsName);
        systemList.appendChild(item);
    });

    if (knownClasses.size === 0) {
        systemList.innerHTML = '<div style="padding:10px; color:#999; font-size:12px;">לא נוצרו עדיין קלאסים במערכת</div>';
    }
}

function attachClassesListeners() {
    // הוספת קלאס בלחיצה
    const btnConnect = $('btnConnectClass');
    const input = $('classInput');

    const handleAdd = () => {
        const val = input.value.trim().replace('.', ''); // הסרת נקודה אם המשתמש הקליד
        if (val) {
            addClassToElement(val);
            input.value = '';
        }
    };

    btnConnect.whenClick(handleAdd);

    // הוספת קלאס ב-Enter
    input.when('keypress', (e) => {
        if (e.key === 'Enter') handleAdd();
    });

    // יצירת חוק CSS חדש
    $('btnCreateRule').whenClick(() => {
        const val = input.value.trim().replace('.', '');
        if (!val) {
            alert('אנא כתוב שם לקלאס');
            return;
        }

        const selector = '.' + val;
        // בדיקה אם קיים
        if (!styleState[selector]) {
            createRefRule(selector); // הפונקציה הקיימת שלך מ-manager.js
            alert(`נוצר חוק חדש עבור ${selector}. כעת ניתן להוסיף אותו לאלמנטים.`);
            refreshClassesView();
        } else {
            alert('חוק זה כבר קיים במערכת.');
        }
    });

    // הסרת קלאס (Event Delegation)
    $('activeClassesList').whenClick((e) => {
        if (e.target.classList.contains('remove-class-btn')) {
            const cls = e.target.dataset.class;
            theElement.classList.remove(cls);
            refreshClassesView();
        }
    });
}

function addClassToElement(className) {
    if (theElement) {
        theElement.classList.add(className);
        refreshClassesView();
    }
}

loadClassesPanel();