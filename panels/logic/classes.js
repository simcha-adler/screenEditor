
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
        if (styleState['.' + cls]) {
            const tag = createElement('div', {
                class: 'ui-class-tag',
                in: `<span>${cls}</span>
                    <span class="ui-remove-class-btn" data-class="${cls}">×</span>`,
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

    Object.keys(styleState).forEach(selector => {
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
                in: `<span>${clsName}</span> 
                <span style="font-size:10px; color:green; cursor:pointer;">הוסף +</span>`,
                'data-class': clsName
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
        const cls = e.upTo('.ui-class-list-item');
        if (cls) {
            theElement.addClass(cls.dataset.class);
            refreshClassesView();
        }
    })

    // הסרת קלאס (Event Delegation)
    $('activeClassesList').whenClick((e) => {
        if (e.target.classList.contains('ui-remove-class-btn')) {
            const cls = e.target.dataset.class;
            theElement.removeClass(cls);
            refreshClassesView();
        }
    });
}

