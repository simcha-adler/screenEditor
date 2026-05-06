
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
    const theElement = Edit.getElement();
    if (!theElement) return;

    // 1. עדכון רשימת הקלאסים הפעילים
    const container = $('activeClassesList');
    container.innerHTML = '';

    Style.getElementClasses(theElement).forEach(cls => {
        const tag = createElement('div', {
            class: 'ui-class-tag',
            in: `<span>${cls}</span>
                <span class="ui-remove-class-btn" data-class="${cls}">×</span>
                <span class="ui-edit-class-btn" data-class="${cls}">✎</span>`,
        });
        tag.into(container);
    });

    if (!container.innerHTML) {
        container.innerHTML = '<span style="color:#999; font-size:12px;">אין קלאסים משויכים</span>';
    }


    // 2. עדכון רשימת הקלאסים הקיימים במערכת (מתוך ה-StyleSheet)
    const systemList = $('systemClassesList');
    systemList.innerHTML = '';

    const classesList = Array.from(Style.getAllClasses()).filter(cls => !theElement.classList.contains(cls));
    const knownClasses = new Set(classesList); // להצגת ייחודיים בלבד

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
        if (!Style.hasRule(selector))
            Style.ensureRule(selector);
        else if (!toElement) // נשלח להוספה לרשימה וקיים בה כבר
            return alert('עיצוב בשם זה כבר קיים במערכת.');
        if (toElement) Edit.getElement().addClass(selector.substring(1));
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
        const cls = e.upTo('.connect-class');
        if (cls) {
            Edit.getElement().addClass(cls.dataset.class);
            refreshClassesView();
        } else if (e.upTo('.ui-edit-class-btn')) Edit.classSelected(e.target.dataset.class);
    })

    // הסרת קלאס (Event Delegation)
    $('activeClassesList').whenClick((e) => {
        if (e.upTo('.ui-remove-class-btn')) {
            const cls = e.target.dataset.class;
            Edit.getElement().removeClass(cls);
            refreshClassesView();
        } else if (e.upTo('.ui-edit-class-btn')) Edit.classSelected(e.target.dataset.class);
    });
}

