/*const help = {
    input: [
        'text' = { placeholder? },
        'textarea' = { placeholder?, rows? },
        'number' = { unit?, max?, min?, step? },
        'range' = { unit?, max?, min?, step? },
        'toggle' = { v, x },
        'button' = { v, x },
        'combinated' = { more input data... , options = [] }
    ],

    כל האלמנטים יכולים להכיל id, קלאס או סטייל.
    panel: [panelName, schema, onInput = () => { settings || allDesigns || classes || addElement }],
    title: [type, label],
    smallTitle: [type, label],
    label: [type, label],
    section: [type, label, collapsed?, children = [{}, {}]],
    grid: [type, label?, children = [{}, {}]],
    input-row: [type, label, inputType, prop?, more input data...],
    input: [type, label?, inputType, prop?, more input data...]
    button: [type, label, class?, onClick],
    div: [type, id?, class?, style?],
    switcher: [type, options = [{label, class?, selected?, targetId}, {}]]
    dynamic: [type, children = [switcher, grids / inputs]]
}*/

const build = {
    router: (item) => {
        const type = item.type;
        let element;
        if (type === 'input') element = build.input.manager(item);
        else element = build[type](item);

        if (item.id && type !== 'inputRow') element.id = item.id;
        if (item.class) item.class.split(' ').forEach(cls => element.addClass(cls));
        if (item.style) element.style.cssText = item.style;

        return element;
    },

    fillChildren: (parent, children) => {
        children.forEach(child => parent.appendChild(build.router(child)));
    },

    panel: (panelName, schema, listener) => {
        const panel = $(panelName);
        panel.innerHTML = '';
        build.fillChildren(panel, schema);
        if (listener) {
            panel.when('input', (e) => listener(e));
        }
    },

    section: (item) => {
        const section = createElement('div', { class: 'ui-section' });
        if (item.collapsed) section.addClass('collapsed');

        const head = createElement('div', {
            class: 'ui-section-head', text: item.label,
        });
        head.onclick = () => section.toggleClass('collapsed');

        const body = createElement('div', { class: 'ui-section-body' });
        build.fillChildren(body, item.children);
        //body.$1('.show')?.click();

        section.append(head, body);
        return section;
    },

    // מסתיר/מציג אלמנטים לפי ID
    switcher: (item) => {
        const container = createElement('div', { class: 'ui-switcher' });

        item.options.forEach(opt => {
            const btn = createElement('button', {
                class: 'ui-btn ' + (opt.class ?? ''),
                text: opt.label
            });

            btn.onclick = () => {
                // מציאת ההורה
                const parent = container.closest('.ui-section-body');

                // הסתרת כל הקבוצות הקשורות
                parent.$$('.switch-body').addClass('hide');

                // הצגת הקבוצה שנבחרה
                let open = parent.$1(`.g${opt.value}`);
                // טלאי על בעיה צדדית. באינפוט ה-id נמצא על האינפוט עצמו ולא על המעטפת, ובקולור אין בכלל מעטפת.
                if (open.tagName === 'INPUT' && open.type !== 'color') open = open.closest('.ui-control-row');
                open.removeClass('hide');

                // עדכון כפתור פעיל
                container.$$('.ui-btn').removeClass('active');
                btn.addClass('active');
            };
            container.appendChild(btn);
        });
        return container;
    },

    grid: (item) => {
        const grid = createElement('div', { class: 'ui-grid' });

        item.children.forEach(child => {
            const element = build.input.manager(child);
            grid.appendChild(element);
        });

        return grid;
    },

    inputRow: (item) => {
        const element = createElement('div', { class: 'ui-control-row' });

        element.appendChild(build.label(item));
        element.appendChild(build.input.manager(item));
        // if (item.inputType === 'color') element.addClass('flex-col')

        return element;
    },

    button: (item) => {
        const btn = createElement('button', { class: 'ui-btn', text: item.label });
        btn.onclick = item.onClick;
        return btn;
    },

    label: (item) => createElement('span', { class: 'ui-label', text: item.label }),

    div: () => createElement('div'),

    title: (item) => createElement('div', { class: 'ui-title', text: item.label }),

    smallTitle: (item) => createElement('span', { class: 'ui-title small', text: item.label }),

    input: {
        manager: (item) => {
            // בניית האינפוט עצמו
            let element;
            // בדיקה האם זה קלט משולב
            if (item.options && item.inputType !== 'select')
                element = build.input.combinated(item);
            else element = build.input[item.inputType](item);

            // הוספת פרטים
            if (item.id) element.id = item.id;
            if (item.prop) {
                if (element.tagName !== 'LABEL')
                    element.dataset.property = item.prop;
                else
                    element.$1('input').dataset.property = item.prop;
            }

            // עטיפה והוספת תווית מעל אם זה לא inputRow
            if (item.type === 'input' && item.label) return build.input.wrapper(element, item);

            return element;
        },

        color: (item) => createSmartColorPicker(item),

        wrapper: (element, item) => {
            const wrapper = createElement('div', { class: item.label.length > 1 ? 'flex-col' : 'ui-control-row' });
            const label = createElement('span', { class: 'ui-label', text: item.label });
            wrapper.append(label, element);
            return wrapper;
        },

        toggle: (item) => {
            const switchLabel = createElement('label', { class: 'ui-switch' });
            const input = createElement('input', { type: 'checkbox', 'data-v': item.v, 'data-x': item.x });
            const slider = createElement('span', { class: 'ui-slider' });
            switchLabel.append(input, slider);
            return switchLabel;
        },

        select: (item) => {
            const select = createElement('select', { class: 'ui-select' });
            item.options.forEach(opt => {
                const o = createElement('option', { value: opt.value, text: opt.text });
                select.appendChild(o);
                if (opt.selected) o.selected = true;
            });
            return select;
        },

        combinated: (item) => {
            const wrapper = createElement('div', { class: 'ui-input-group' });
            const valInput = build.input[item.inputType](item);
            const unitInput = build.input.select(item);
            const demoInput = createElement('input', { type: 'hidden', 'data-property': item.prop });

            wrapper.when('input', (e) => {
                if (e.target === demoInput) return;
                e.stopPropagation();

                const num = valInput.value;
                const unit = unitInput.value;
                let value;

                // רשימת מילים שמותר להן להופיע לבד
                const standaloneKeywords = ['auto', 'none', 'inherit', 'initial', 'unset', 'normal'];

                // 1. תרחיש א': מילת מפתח בודדת (כמו auto)
                if (standaloneKeywords.includes(unit)) {
                    value = unit;
                    // if (num) numInput.value = ''; // ניקוי המספר כדי למנוע בלבול ויזואלי
                    valInput.style.opacity = '0.1'; // חיווי ויזואלי שהמספר לא רלוונטי
                } else if (num === '') {  // 2. תרחיש ב': יחידה ללא מספר (למשל 'px' כשהשדה ריק)
                    return; // ערך שגוי. תתעלם.
                } else {  // 3. תרחיש ג' (המצב התקין): מספר + יחידה
                    value = num + unit;
                    valInput.style.opacity = '1';
                }
                demoInput.value = value;
                demoInput.sendInput();
            });

            wrapper.append(valInput, unitInput, demoInput);
            return wrapper;
        },

        text: (item) => {
            const input = createElement('input', { type: 'text', class: 'ui-input' })
            if (item.placeholder) input.placeholder = item.placeholder;
            return input;
        },

        textarea: (item) => {
            const input = createElement('input', { type: 'textarea', class: 'ui-textarea' });
            if (item.rows) input.rows = item.rows;
            if (item.placeholder) input.placeholder = item.placeholder;
            return input;
        },

        number: (item) => {
            const input = createElement('input', { type: 'number', class: 'ui-input' });
            return build.input.addValues(input, item);
        },

        range: (item) => {
            const input = createElement('input', { type: 'range', class: 'ui-range' });
            return build.input.addValues(input, item);
        },

        addValues: (input, item) => {
            if (item.unit) input.unit = item.unit;
            if (item.min) input.min = item.min;
            if (item.max) input.max = item.max;
            if (item.step) input.step = item.step;
            if (item.value) input.value = item.value;
            return input;
        },

        checkbox: (item) => createElement('input', { type: 'checkbox', class: 'ui-checkbox', 'data-v': item.v, 'data-x': item.x }),
    }
}

/**
 * יש אינפוט שורה ויש אינפוט
 * אם אינפוט שורה - עטוף בשורה והוסף לייבל (חובה), ושלח את הכל לאינפוט
 * אם אינפוט, אם לייבל, עטוף עם קלאס טור, בכל מקרה, שלח הכל לאינפוט
 * באינפוט מנהל, נתב לפי אינפוט טייפ בלבד!
 */