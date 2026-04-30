// --- ניהול הגדרות משתמש ---


const defaultData = {
    colorMod: true,
    darkMod: false,
    showOutlines: false,  // האם להציג גבולות לכל האלמנטים בדף (לעזרה בעיצוב)
    autoSave: true,       // האם לשמור אוטומטית
    language: 'he',       // שפת ממשק
    huePrimary: 240,
    saturationPrimary: 100,
    accent: 'hwb(0 0% 0%)',
};

let data = {};

function init() {
    // טעינה מ-LocalStorage
    const saved = localStorage.getItem('screenEditor_settings');
    if (saved) {
        // מיזוג ההגדרות השמורות עם ברירות המחדל (למקרה שהוספנו פיצ'רים חדשים)
        data = { ...defaultData, ...JSON.parse(saved) };
        apply();
        save();
    } else {
        reloadDefault();
    }
};

function reloadDefault() {
    data = { ...defaultData };
    apply();
    save();
    fillValues(); // עבור כפתור אתחול. לא נפתח פאנל ולא משתנה אלמנט, ולכן צריך מילוי במיוחד
};

function save() {
    localStorage.setItem('screenEditor_settings', JSON.stringify(data));
};

function apply() {
    const body = document.body;

    // --- יישום מצב כהה ---
    if (data.darkMod === true) {
        body.addClass('editor-dark-mode');
    } else {
        body.removeClass('editor-dark-mode');
    }

    // --- יישום מצב צבעוני ---
    if (data.colorMod === true) {
        body.addClass('color');
    } else {
        body.removeClass('color');
    }

    document.documentElement.style.setProperty('--h', data.huePrimary);
    document.documentElement.style.setProperty('--c', data.saturationPrimary);
    document.documentElement.style.setProperty('--ui-accent', data.accent);
    // canvasDoc.documentElement.style.setProperty('--ui-accent', data.accent);
    // --- יישום גבולות עזר ---
    // מוסיף קלאס לקונטיינר של העורך
    if (data.showOutlines) {
        editor.addClass('show-outlines');
    } else {
        editor.removeClass('show-outlines');
    }
};

function update(key, value) {
    data[key] = value;
    apply();
    save();
};

function fillValues() {
    // מוצא את כל האינפוטים שיש להם שיוך ל-CSS Property
    const inputs = $('panel-settings').$$('[data-property]');

    inputs.forEach(input => {
        const prop = input.dataset.property;
        const value = data[prop]
        if (input.type === 'checkbox') {
            input.checked = value;
        } else { input.value = value; }
    });
};

function listener(e) {
    const input = e.upTo('input');
    if (!input) return;

    const prop = input.dataset.property;
    if (!prop) return;

    const val = input.type === 'checkbox' ? input.checked : input.value;
    update(prop, val);
};

function loadPanel() {
    UI.buildPanel('panel-settings', schemas.settings, listener);
    init();
    // מילוי הגוון הנכון באקצנט. הוא חריג מכל אינפוטי הצבע ולכן נכתב במיוחד
    $('panel-settings').$1('[data-property="accent"]').value = data.accent;
};

export const settings = {
    reloadDefault: reloadDefault,
    fillValues: fillValues,
    loadPanel: loadPanel,
}

window.settings = settings;