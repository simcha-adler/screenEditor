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

    theElement.classList.forEach(cls => {
        if (styleState['.' + cls]) {
            const tag = createElement('div', {
                class: 'class-tag',
                in: `<span>${cls}</span>
                        <span class="remove-class-btn" data-class="${cls}">×</span>`,
            });
            tag.into(container);
        }
    });

    if (!container.innerHTML) {
        container.innerHTML = '<span style="color:#999; font-size:12px;">אין קלאסים משויכים</span>';
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
            //const cleanName = selector.split(':')[0].substring(1);
            const cleanName = selector.substring(1);
            knownClasses.add(cleanName);
        }
    });

    // גם נבדוק ב-DOM למקרה שיש קלאסים שלא נרשמו ב-state
    // (אופציונלי - כרגע נסתמך על מה שהמשתמש יצר דרכנו)

    knownClasses.forEach(clsName => {
        const item = createElement('div', {
            class: 'system-class-item',
            in: `<span>${clsName}</span> 
                <span style="font-size:10px; color:green;">הוסף +</span>`,
            attrs: { 'data-class': clsName }
        });
        item.into(systemList);
    });

    if (knownClasses.size === 0) {
        systemList.innerHTML = '<div style="padding:10px; color:#999; font-size:12px;">לא נוצרו עדיין קלאסים במערכת</div>';
    }
}

function attachClassesListeners() {
    // הוספת קלאס בלחיצה
    const input = $('classInput');

    function createOrAddClass(toElement = false) {
        const selector = ensureClassName(input.value);
        if (!selector) return;
        // אם לא קיים, להוסיף לרשימת הקלאסים
        if (!styleState[selector])
            createRuleAndRef(selector);
        else if (!toElement) // נשלח להוספה לרשימה וקיים בה כבר
            return alert('עיצוב בשם זה כבר קיים במערכת.');
        if (toElement) theElement.addClass(selector.substring(1));
        input.value = '';
        refreshClassesView();
    };

    $('btnConnectClass').whenClick(() => createOrAddClass(true));

    // הוספת קלאס ב-Enter
    input.when('keypress', (e) => {
        if (e.key === 'Enter') createOrAddClass(true);
    });

    // יצירת חוק CSS חדש
    $('btnCreateRule').whenClick(() => createOrAddClass());

    $('systemClassesList').whenClick((e) => {
        const cls = e.upTo('.system-class-item');
        theElement.addClass(cls.dataset.class);
        refreshClassesView();
    })

    // הסרת קלאס (Event Delegation)
    $('activeClassesList').whenClick((e) => {
        if (e.target.classList.contains('remove-class-btn')) {
            const cls = e.target.dataset.class;
            theElement.removeClass(cls);
            refreshClassesView();
        }
    });
}

function ensureClassName(name) {
    if (!name) {
        alert('אנא כתוב שם לקלאס');
        return '';
    }
    if (!name.startsWith('.')) name = '.' + name;
    const newName = name.replaceAll(' ', '-').trim();
    return newName;
}


loadClassesPanel();