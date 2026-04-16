
const cls = {
    ensureName: (name) => {
        if (!name) {
            alert('אנא כתוב שם לקלאס');
            return '';
        }
        if (!name.startsWith('.')) name = '.' + name;
        return name.replaceAll(' ', '-').trim();
    }
}


//=========לוגיקה==========

function refreshClassesView() {
    if (!theElement) return;

    // 1. עדכון רשימת הקלאסים הפעילים
    const container = $('activeClassesList');
    container.innerHTML = '';

    theElement.classList.forEach(cls => {
        if (Style.state['.' + cls]) {
            const tag = createElement('div', {
                class: 'ui-class-tag',
                in: `<span>${cls}</span>
                    <span class="ui-remove-class-btn" data-class="${cls}">×</span>
                    <span class="ui-edit-class-btn" data-class="${cls}">✎</span>`,
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
    const knownClasses = new Set();

    Object.keys(Style.state).forEach(selector => {
        if (selector.startsWith('.')) {
            // מציג גם פסאודו סלקטורים
            const cleanName = selector.substring(1);
            if (!theElement.classList.contains(cleanName)) // מציג רק מה שלא משויך
                knownClasses.add(cleanName);
        }
    });

    if (knownClasses.size === 0) {
        systemList.innerHTML = '<div style="padding:10px; color: var(--ui-45); font-size:12px;">אין במערכת קלאסים להוספה</div>';
    } else {

        knownClasses.forEach(clsName => {
            const item = createElement('div', {
                class: 'ui-class-list-item',
                in: `<span>${clsName}</span> <span>
                <span class="connect-class" style="font-size:10px; color:green; cursor:pointer;" data-class="${clsName}">הוסף +</span>
                <span class="ui-edit-class-btn" data-class="${clsName}">✎</span></span>`,
            });
            item.into(systemList);
        });
    }

}

function attachClassesListeners() {
    const input = $('classInput');

    // הוספת קלאס בלחיצה
    const createOrAddClass = (toElement = false) => {
        const selector = cls.ensureName(input.value);
        if (!selector) return;
        // אם לא קיים, להוסיף לרשימת הקלאסים
        if (!Style.state[selector])
            Style.createRule(selector);
        else if (!toElement) // נשלח להוספה לרשימה וקיים בה כבר
            return alert('עיצוב בשם זה כבר קיים במערכת.');
        if (toElement) theElement.addClass(selector.substring(1));
        input.value = '';
        refreshClassesView();
    };

    const editClass = (selector) => {
        // כאן צריכה להיות לוגיקת עריכת הקלאס וסימון האלמנטים המושפעים
        // צריך להפריד את לוגיקת העריכה בפונקציית עדכון האלמנט הנבחר מלוגיקת בחירת האלמנט
        Selector.lock();
    }

    $('btnConnectClass').whenClick(() => createOrAddClass(true));

    // הוספת קלאס ב-Enter
    input.when('keypress', (e) => {
        if (e.key === 'Enter') createOrAddClass(true);
    });

    // יצירת חוק CSS חדש
    $('btnCreateRule').whenClick(() => createOrAddClass());

    $('systemClassesList').whenClick((e) => {
        const cls = e.upTo('.connect-class');
        if (cls) {
            theElement.addClass(cls.dataset.class);
            refreshClassesView();
        } else if (e.upTo('.ui-edit-class-btn')) editClass(e.target.dataset.class);
    })

    // הסרת קלאס (Event Delegation)
    $('activeClassesList').whenClick((e) => {
        if (e.upTo('.ui-remove-class-btn')) {
            const cls = e.target.dataset.class;
            theElement.removeClass(cls);
            refreshClassesView();
        } else if (e.upTo('.ui-edit-class-btn')) editClass(e.target.dataset.class);
    });
}

