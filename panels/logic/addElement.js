
/**
 * מרנדר את השדות של האלמנט הנבחר
 */
function renderDynamicFields(type) {
    const config = schemas.elementsList[type];
    if (config && config.fields) {
        build.panel('dynamicFormFields', config.fields);
    }
}

/**
 * פונקציית הביצוע המרכזית
 */
function executeAdd() {
    const type = $('elementTypeSelect').value;
    const blueprint = schemas.elementsList[type];

    // 1. יצירת ID בטוח
    let baseId = createSafeId($('newElementId').value, type);
    if (!baseId) return;

    // 2. איסוף נתונים מהטופס
    const formData = {};
    $('dynamicFormFields').$$('[data-property]').forEach(input => {
        formData[input.dataset.property] = input.value;
    });

    // הוספת ה-ID לנתונים שמועברים ל-Template
    const data = { ...formData, id: baseId };

    // 3. הזרקת CSS ישירות לתגית הסטייל (הדפדפן יפרסר לבד)
    const rawCss = blueprint.css(data);
    $('styles').innerHTML += rawCss;

    // רענון רפרנס ה-sheet כדי שיכיר את החוקים החדשים
    Style.refreshSheet();

    // 4. יצירת ה-HTML והזרקה לעץ (דרך ה-Dual Manager שלך)
    const rawHtml = blueprint.html(data);
    const temp = createElement('div');
    temp.innerHTML = rawHtml.trim();
    const newEl = temp.firstElementChild;

    // הוספה ל-DOM ולעץ הויזואלי
    tree.dual.add(newEl, theElement || editor, false);

    // 5. ניקוי וסגירה
    $('newElementId').value = '';
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

