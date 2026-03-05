// --- ניהול הגדרות משתמש ---

const settings = {

    defaultData: {
        darkMod: false,
        showOutlines: false,  // האם להציג גבולות לכל האלמנטים בדף (לעזרה בעיצוב)
        autoSave: true,       // האם לשמור אוטומטית
        language: 'he',       // שפת ממשק
        huePrimary: 300,
        saturationPrimary: 0,
        accent: 'hwb(220 0% 0%)',
    },

    data: {},

    init: () => {
        // טעינה מ-LocalStorage
        const saved = localStorage.getItem('screenEditor_settings');
        if (saved) {
            // מיזוג ההגדרות השמורות עם ברירות המחדל (למקרה שהוספנו פיצ'רים חדשים)
            settings.data = { ...settings.defaultData, ...JSON.parse(saved) };
            settings.apply();
            settings.save();
        } else {
            settings.reloadDefault();
        }
    },

    reloadDefault: () => {
        settings.data = { ...settings.defaultData };
        settings.apply();
        settings.save();
    },

    save: () => {
        localStorage.setItem('screenEditor_settings', JSON.stringify(settings.data));
    },

    apply: () => {
        const body = document.body;

        // --- יישום מצב כהה ---
        if (settings.data.darkMod === true) {
            body.addClass('editor-dark-mode');
        } else {
            body.removeClass('editor-dark-mode');
        }

        document.documentElement.style.setProperty('--h', settings.data.huePrimary);
        document.documentElement.style.setProperty('--c', settings.data.saturationPrimary);
        document.documentElement.style.setProperty('--ui-accent', settings.data.accent);
        // --- יישום גבולות עזר ---
        // מוסיף קלאס לקונטיינר של העורך
        if (settings.data.showOutlines) {
            editor.addClass('show-outlines');
        } else {
            editor.removeClass('show-outlines');
        }
    },

    update: (key, value) => {
        settings.data[key] = value;
        settings.apply();
        settings.save();
    },

    fillValues: () => {
        // מוצא את כל האינפוטים שיש להם שיוך ל-CSS Property
        const inputs = $('panel-settings').$$('[data-property]');

        inputs.forEach(input => {
            const prop = input.dataset.property;
            const value = settings.data[prop]
            if (input.type === 'checkbox') {
                input.checked = value;
            } else { input.value = value; }
        });
    },

    listener: (e) => {
        const input = e.upTo('input');
        if (!input) return;

        const prop = input.dataset.property;
        if (!prop) return;

        const val = input.type === 'checkbox' ? input.checked : input.value;
        settings.update(prop, val);
    },

    loadPanel: () => {
        build.panel('panel-settings', settingsSchema, settings.listener);
        settings.init();
        // מילוי הגוון הנכון באקצנט. הוא חריג מכל אינפוטי הצבע ולכן נכתב במיוחד
        $('panel-settings').$1('[data-property="accent"]').value = settings.data.accent;
    }
}



const settingsSchema = [
    { type: 'title', label: 'הגדרות עורך ונושא' },

    // --- Theme Settings ---
    {
        type: 'section', label: 'גווני האתר', collapsed: false,
        children: [
            { type: 'smallTitle', label: 'צבע ראשי' },
            {
                type: 'inputRow', label: 'מצב כהה',
                inputType: 'toggle', prop: 'darkMod', v: true, x: false
            },
            {
                type: 'inputRow', label: 'גוון',
                inputType: 'range', prop: 'huePrimary', min: 0, max: 360
            },
            {
                type: 'inputRow', label: 'רוויה',
                inputType: 'range', prop: 'saturationPrimary', min: 0, max: 100
            },

            { type: 'smallTitle', label: 'צבע הדגשה' },
            {
                type: 'inputRow', label: 'גוון', inputType: 'color',
                prop: 'accent', defaultValue: '#0078d4', hasGradient: false
            }
        ]
    },

    // --- System Settings ---
    {
        type: 'section', label: 'מערכת', collapsed: true,
        children: [
            {
                type: 'inputRow', label: 'שמירה אוטומטית',
                inputType: 'toggle', prop: 'autoSave', v: true, x: false
            },
            {
                type: 'inputRow', label: 'הצג גבולות עזר',
                inputType: 'toggle', prop: 'showOutlines', v: true, x: false
            }
        ]
    },

    // --- Actions ---
    {
        type: 'button', label: 'אפס להגדרות יצרן', class: 'ui-btn-danger',
        onClick: () => {
            if (confirm('האם לאפס את כל ההגדרות?')) {
                settings.reloadDefault();
            }
        }
    }
];

