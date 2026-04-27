/**
 * ==========================================
 *   מערכת ניהול צבעים חכמה (Color Picker V2)
 * ==========================================
 */

const colorPicker = {
    /**
     * יצירת רכיב הפיקר
     * @param {Object} item - הגדרת האינפוט מהסכימה
     */
    create: (item) => {
        const prop = item.prop;

        // טיפול ייחודי בפיקר שבהגדרות
        if (prop === 'accent') {
            return createElement('input', { type: 'color', 'data-property': prop });
        }

        // מעטפת ראשית
        const group = createElement('div', {
            class: 'ui-smart-color-group', /*'data-property': prop,*/
            'data-defaultValue': item.defaultValue, 'data-gradient': item.hasGradient
        });

        // 1. הסמליל (Trigger) - הכפתור שפותח את הכלים
        const trigger = createElement('button', { class: 'ui-button ui-color-trigger' });
        const circle = createElement('div', { class: 'color-preview-circle' });
        const hiddenPicker = createElement('input', { type: 'color', class: 'hidden-picker' });
        const gradientButton = createElement('i', { class: "ri-magic-line hide", style: "font-size:16px" });

        trigger.append(circle, hiddenPicker, gradientButton);

        // 2. בחירת מקור הצבע (Source Select)
        const sourceSelect = createElement('select', { class: 'ui-select', style: 'width: 110px;' });

        // 3. אינפוט דמו (Hidden) - זה שמתקשר עם manager.js
        const demoInput = createElement('input', {
            type: 'hidden',
            'data-property': prop,
            class: 'color-demo-input'
        });

        group.append(trigger, sourceSelect, demoInput);

        // --- רישום מאזינים פנימיים ---

        // שינוי מקור (סלקט)
        sourceSelect.oninput = () => {
            if (sourceSelect.value === 'free') {
                colorPicker.removeThemeLink(prop);
            }
            colorPicker.refreshUI(group);
        };

        // בחירת צבע חופשי (אינפוט color נסתר)
        hiddenPicker.oninput = (e) => {
            const val = e.target.value;
            circle.style.background = val;
            demoInput.sendInput(val);
        };

        // לחיצה על הכפתור הראשי
        trigger.onclick = (e) => {
            e.stopPropagation();
            const mode = sourceSelect.value;

            if (mode === 'free') {
                hiddenPicker.click();
            } else if (mode.startsWith('theme_')) {
                const themeId = mode.replace('theme_', '');
                const theme = themeDefinitions.find(t => t.id === themeId);
                colorPicker.range.open(trigger, theme, group);
            } else if (mode === 'gradient') {
                colorPicker.gradient.open(prop, group);
            }
        };

        // אתחול ראשוני של האופציות
        colorPicker.refreshSelect(group);

        return group;
    },

    /**
     * רענון ממשק המשתמש
     */
    refreshUI: (group) => {
        const circle = group.$1('.color-preview-circle');
        const magic = group.$1('.ri-magic-line');
        const mode = group.$1('select').value;
        const prop = group.dataset.prop;

        if (mode === 'gradient') {
            circle.addClass('hide');
            magic.removeClass('hide')
        } else {
            circle.removeClass('hide')
            magic.addClass('hide');

            if (mode === 'free') {
                const currentVal = Edit.getStyles() ? Edit.getStyles()[prop] : group.dataset.defaultValue;
                circle.style.background = rgbToHex(currentVal);
            }
            else if (mode.startsWith('theme_')) {
                const themeId = mode.replace('theme_', '');
                const theme = themeDefinitions.find(t => t.id === themeId);
                if (theme) {
                    circle.style.background = `linear-gradient(135deg, ${theme.anchors.join(', ')})`;
                }
            }
        }
    },

    /**
     * מילוי ערכים - מסנכרן את הפיקר עם האלמנט הנבחר
     */
    fill: (group, value) => {
        const prop = group.dataset.prop;
        const sourceSelect = group.$1('select');

        // 1. בדיקה האם קיים קשר לטווח (Theme Link)
        const selector = Selector.get();
        const link = themeLinks.find(l => l.selector === selector && l.prop === prop);

        if (link) {
            sourceSelect.value = `theme_${link.themeId}`;
        }
        // 2. בדיקה האם זה גרדיאנט
        else if (value && (value.includes('gradient'))) {
            sourceSelect.value = 'gradient';
        }
        // 3. צבע חופשי
        else {
            sourceSelect.value = 'free';
            const hex = rgbToHex(value);
            group.$1('.hidden-picker').value = hex;
        }

        colorPicker.refreshUI(group);
    },

    /**
     * ניהול סלקט האופציות
     */
    refreshSelect: (group) => {
        const select = group.$1('select');
        const currentVal = select.value;

        let html = `<option value="free">צבע חופשי</option>`;
        themeDefinitions.forEach(t => {
            html += `<option value="theme_${t.id}">${t.name}</option>`;
        });
        if (group.dataset.gradient === 'true') html += `<option value="gradient">גרדיאנט ✨</option>`;

        select.innerHTML = html;
        select.value = currentVal || 'free';
    },

    /**
     * ניהול טווחי נושא
     */
    range: {
        open: (anchor, theme, group) => {
            const prop = group.dataset.prop;
            const selector = Selector.get();

            // מציאת ערך קיים אם יש
            const link = themeLinks.find(l => l.selector === selector && l.prop === prop);
            const initialVal = link ? link.relativeValue : 50;

            const popover = createElement('div', { class: 'ui-range-popover popup' });
            const slider = createElement('input', {
                type: 'range', min: 0, max: 100, value: initialVal,
                class: 'popover-slider',
                style: `background: linear-gradient(to right, ${theme.anchors.join(', ')})`
            });

            slider.oninput = (e) => {
                const percent = e.target.value;
                const color = colorPicker.range.calculate(theme, percent);

                // שמירת הקשר בזיכרון
                saveLink(selector, prop, theme.id, percent);

                // שליחה לעדכון CSS
                group.$1('.color-demo-input').sendInput(color);
            };

            popover.appendChild(slider);
            document.body.appendChild(popover);

            // מיקום
            const rect = anchor.getBoundingClientRect();
            popover.style.top = (rect.bottom + 8) + 'px';
            popover.style.left = (rect.left - 140) + 'px';
        },

        calculate: (theme, percent) => {
            if (theme.type === '1d' || theme.anchors.length === 2) {
                return Color.mixColors(theme.anchors[0], theme.anchors[1], percent);
            } else {
                if (percent <= 50) return Color.mixColors(theme.anchors[0], theme.anchors[1], percent * 2);
                return Color.mixColors(theme.anchors[1], theme.anchors[2], (percent - 50) * 2);
            }
        }
    },

    /**
     * עורך גרדיאנטים
     */
    gradient: {
        open: (prop, group) => {
            const demoInput = group.$1('.color-demo-input');
            const overlay = createElement('div', { class: 'gradient-modal-overlay' });
            const modal = createElement('div', { class: 'gradient-modal' });
            modal.innerHTML = `<h4 style="margin:0">עורך גרדיאנט</h4>`;

            const preview = createElement('div', { class: 'gradient-preview-big' });
            const settingsGrid = createElement('div', { class: 'ui-grid' });

            // שימוש ב-build ליצירת שדות
            let typeSel = new UI.wrapInput({ label: 'סוג', input: new UI.input.select({ options: [{ value: 'linear', text: 'קווי' }, { value: 'radial', text: 'עגול' }] }) }).build();
            let angleInp = new UI.wrapInput({ label: 'זווית', input: new UI.input.number({ defaultValue: 90 }) }).build();
            settingsGrid.append(typeSel, angleInp);

            typeSel = typeSel.$1('SELECT');
            angleInp = angleInp.$1('INPUT');

            const stopsContainer = createElement('div', { class: 'stops-list' });
            let stops = [{ color: '#ffffff', pos: 0 }, { color: '#0078d4', pos: 100 }];

            const update = () => {
                const type = typeSel.value;
                const angle = angleInp.value;
                const stopsStr = stops.sort((a, b) => a.pos - b.pos).map(s => `${s.color} ${s.pos}%`).join(', ');
                const finalGrad = `${type}-gradient(${type === 'linear' ? angle + 'deg' : 'circle'}, ${stopsStr})`;
                preview.style.background = finalGrad;
                // console.log(finalGrad);
                demoInput.sendInput(finalGrad);
                renderStops();
            };

            const renderStops = () => {
                stopsContainer.innerHTML = '';
                stops.forEach((stop, idx) => {
                    const row = createElement('div', { class: 'grad-stop-row' });
                    const cp = createElement('input', { type: 'color', value: rgbToHex(stop.color), class: 'ui-input', style: 'width:40px; padding:2px' });
                    const pos = createElement('input', { type: 'number', value: stop.pos, class: 'ui-input', style: 'width:50px' });
                    const del = createElement('span', { text: '×', style: 'cursor:pointer; color:red; font-weight:bold; padding:0 5px' });

                    cp.oninput = (e) => { stops[idx].color = e.target.value; update(); };
                    pos.oninput = (e) => { stops[idx].pos = e.target.value; update(); };
                    del.onclick = () => { if (stops.length > 2) { stops.splice(idx, 1); renderStops(); update(); } };

                    row.append(cp, pos, createElement('span', { text: '%' }), del);
                    stopsContainer.appendChild(row);
                });
            };

            const addBtn = createElement('button', { class: 'ui-btn btn-add-stop', text: '+ הוסף צבע' });
            addBtn.onclick = () => { stops.push({ color: '#000000', pos: 100 }); update(); };

            const closeBtn = createElement('button', { class: 'ui-btn ui-btn-primary', text: 'סגור', style: 'width:25%; ' });
            closeBtn.onclick = () => overlay.remove();
            const closeBtnWrapper = createElement('div', { style: 'display: flex; justify-content: end; margin-top: 10px' })
            closeBtnWrapper.appendChild(closeBtn);

            typeSel.oninput = angleInp.oninput = update;
            modal.append(preview, settingsGrid, stopsContainer, addBtn, closeBtnWrapper);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            update();
        }
    },

    /**
     * פונקציות עזר לניהול הקשרים
     */
    removeThemeLink: (prop) => {
        const selector = Selector.get();
        removeLink(selector, prop);
    }
};

/**
 * פונקציות גלובליות שנקראות משאר חלקי המערכת
 */
function createSmartColorPicker(item) {
    return colorPicker.create(item);
}

// נקרא מ-sidebar.js או manager.js בעת שינוי טווחים
const refreshThemes = () => {
    $$('.ui-smart-color-group').forEach(group => {
        colorPicker.refreshSelect(group);
        colorPicker.refreshUI(group);
    });
};

// עדכון כל האלמנטים המקושרים לטווח ששונה (נקרא מ-theme.js)
function updateAllLinkedElements(themeId) {
    const theme = themeDefinitions.find(t => t.id === themeId);
    if (!theme) return;

    themeLinks.forEach(link => {
        if (link.themeId === themeId) {
            const finalColor = colorPicker.range.calculate(theme, link.relativeValue);
            Style.update(link.selector, link.prop, finalColor);

            // אם האלמנט הנבחר כרגע הוא זה שמתעדכן, נרענן לו את ה-UI של הפיקר
            const activeSelector = Selector.get();
            if (link.selector === activeSelector) {
                const group = $1(`.ui-smart-color-group[data-prop="${link.prop}"]`);
                if (group) colorPicker.refreshUI(group);
            }
        }
    });
}