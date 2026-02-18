/**
 * פונקציה ראשית לבניית הקולור פיקר בסרגל הצד
 */
// function createSmartColorPicker(item) {
//     const prop = item.prop;
//     const container = createElement('div', { class: 'ui-smart-picker-group' });
//     const hiddenInput = createElement('input', { type: 'hidden', 'data-property': prop });
//     container.appendChild(hiddenInput);

//     const sourceRow = createElement('div', { class: 'ui-control-row' });
//     sourceRow.appendChild(createElement('span', { class: 'ui-label', text: item.label }));
//     const sourceSelect = createElement('select', { class: 'ui-select' });
//     sourceSelect.innerHTML = `<option value="free">צבע חופשי</option><optgroup label="הטווחים שלי" class="themes-optgroup"></optgroup><option value="gradient">✨ גרדיאנט...</option>`;
//     sourceRow.appendChild(sourceSelect);
//     sourceSelect.oninput = (e) => {
//         const val = sourceSelect.value;
//         if (val === 'free') pass;
//         else if (val.startsWith('theme_')) pass;
//         else openGradientEditor(prop, hiddenInput);
//         e.stopPropagation();
//     }

//     const inputRow = createElement('div', { class: 'ui-control-row' });
//     inputRow.appendChild(createElement('span', { class: 'ui-label', style: 'opacity:0' }));
//     const inputArea = createElement('div', { style: 'flex:1' });
//     inputRow.appendChild(inputArea);

//     container.append(sourceRow, inputRow);

//     const refreshUI = () => {
//         inputArea.innerHTML = '';
//         const val = sourceSelect.value;
//         if (val === 'free') {
//             const cp = createElement('input', { type: 'color', class: 'ui-input', style: 'height:30px' });
//             cp.oninput = (e) => { hiddenInput.value = e.target.value; hiddenInput.sendInput(); };
//             inputArea.appendChild(cp);
//         } else if (val.startsWith('theme_')) {
//             const theme = themeDefinitions.find(t => t.id === val.replace('theme_', ''));
//             inputArea.appendChild(createStyledSlider(theme, (color, percent) => {
//                 saveLink(getActiveSelectorKey(), prop, theme.id, percent);
//                 hiddenInput.value = color; hiddenInput.sendInput();
//             }));
//         } else if (val === 'gradient') {
//             const btn = createElement('button', { class: 'ui-btn ui-btn-primary', text: 'פתח עורך גרדיאנט' });
//             btn.onclick = () => openGradientEditor(prop, hiddenInput);
//             inputArea.appendChild(btn);
//         }
//     };

//     sourceSelect.onchange = refreshUI;
//     container.refreshThemes = () => {
//         const group = sourceSelect.$1('.themes-optgroup');
//         group.innerHTML = '';
//         themeDefinitions.forEach(t => group.appendChild(createElement('option', { value: 'theme_' + t.id, text: t.name })));
//         refreshUI();
//     };

//     container.refreshThemes();
//     return container;
// }

/**
 * עורך גרדיאנטים מתקדם בפופ-אפ
 */
function openGradientEditor(prop, targetHiddenInput) {
    const overlay = createElement('div', { class: 'gradient-modal-overlay' });
    const modal = createElement('div', { class: 'gradient-modal' });
    modal.innerHTML = `<h4 style="margin-top:0">עורך גרדיאנט</h4>`;

    const preview = createElement('div', { class: 'gradient-preview-big' });
    const settingsGrid = createElement('div', { class: 'ui-grid', style: 'margin-bottom:15px' });
    const typeSel = build.input.manager({ label: 'סוג', inputType: 'select', options: [{ value: 'linear', text: 'קווי' }, { value: 'radial', text: 'עגול' }] });
    const angleInp = build.input.manager({ label: 'זווית', inputType: 'number', value: 90 });
    settingsGrid.append(typeSel, angleInp);

    const stopsContainer = createElement('div', { class: 'stops-list' });
    let stops = [{ color: '#ffffff', pos: 0 }, { color: '#0078d4', pos: 100 }];

    const renderStops = () => {
        stopsContainer.innerHTML = '';
        stops.forEach((stop, idx) => {
            const row = createElement('div', { class: 'grad-stop-row' });
            const cp = createElement('input', { type: 'color', value: rgbToHex(stop.color), class: 'ui-input', style: 'width:40px; height:30px; padding:2px' });
            const pos = createElement('input', { type: 'number', value: stop.pos, class: 'ui-input', style: 'width:50px', min: 0, max: 100 });
            const del = createElement('span', { text: '×', style: 'cursor:pointer; color:red; font-weight:bold; font-size:18px', title: 'הסר' });

            cp.oninput = (e) => { stops[idx].color = e.target.value; update(); };
            pos.oninput = (e) => { stops[idx].pos = e.target.value; update(); };
            del.onclick = () => { if (stops.length > 2) { stops.splice(idx, 1); renderStops(); update(); } };

            row.append(cp, pos, createElement('span', { text: '%' }), del);
            stopsContainer.appendChild(row);
        });
    };

    const update = () => {
        const type = typeSel.value;
        const angle = angleInp.value;
        const stopsStr = stops.sort((a, b) => a.pos - b.pos).map(s => `${s.color} ${s.pos}%`).join(', ');
        const finalGrad = `${type}-gradient(${type === 'linear' ? angle + 'deg' : 'circle'}, ${stopsStr})`;
        preview.style.background = finalGrad;
        targetHiddenInput.value = finalGrad;
        targetHiddenInput.sendInput();
    };

    const addBtn = createElement('button', { class: 'btn-add-stop', text: '+ הוסף צבע נוסף' });
    addBtn.onclick = () => { stops.push({ color: '#000000', pos: 100 }); renderStops(); update(); };

    const okBtn = createElement('button', { class: 'ui-btn-primary', text: 'סיום וסגירה', style: 'width:100%' });
    okBtn.onclick = () => overlay.remove();

    typeSel.oninput = angleInp.oninput = update;
    modal.append(preview, settingsGrid, stopsContainer, addBtn, okBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    renderStops(); update();
}



function createSmartColorPicker(item) {
    const prop = item.prop;

    // מעטפת ראשית שתחזיק את ה-data-property
    const group = createElement('div', {
        class: 'ui-smart-color-group',
        'data-property': prop
    });

    // 1. הסמליל (הטריגר)
    const trigger = createElement('div', { class: 'ui-color-trigger' });

    // 2. הדרופדאון (המקור)
    const sourceSelect = createElement('select', { class: 'ui-select', style: 'width: 100px;' });

    // פונקציית עזר לעדכון המערכת
    const sendValue = (finalColor) => {
        group.value = finalColor; // עדכון הערך על המעטפת
        group.sendInput(); // שליחת אירוע input (מה-short.js שלך)
    };

    const refreshUI = () => {
        const mode = sourceSelect.value;
        trigger.innerHTML = ''; // ניקוי סמליל

        if (mode === 'free') {
            // סמליל צבע פשוט
            const circle = createElement('div', {
                class: 'color-preview-circle',
                style: `background: ${theStyles ? theStyles[prop] : '#000'}`
            });
            trigger.appendChild(circle);

            // לחיצה פותחת פיקר נסתר
            const hiddenPicker = createElement('input', { type: 'color', style: 'display:none' });
            hiddenPicker.oninput = (e) => {
                circle.style.background = e.target.value;
                sendValue(e.target.value);
            };
            trigger.onclick = () => hiddenPicker.click();
        }
        else if (mode.startsWith('theme_')) {
            const themeId = mode.replace('theme_', '');
            const theme = themeDefinitions.find(t => t.id === themeId);

            // סמליל גרדיאנט של הטווח
            const circle = createElement('div', {
                class: 'color-preview-circle',
                style: `background: linear-gradient(135deg, ${theme.anchors.join(', ')})`
            });
            trigger.appendChild(circle);

            // לחיצה פותחת חלונית סליידר צפה
            trigger.onclick = (e) => {
                e.stopPropagation();
                openRangePopover(trigger, theme, (color, percent) => {
                    saveLink(getActiveSelectorKey(), prop, theme.id, percent);
                    sendValue(color);
                });
            };
        }
        else if (mode === 'gradient') {
            trigger.innerHTML = '<i class="ri-magic-line"></i>';
            trigger.onclick = () => openGradientEditor(prop, group); // קריאה לפונקציה הקיימת שלך
        }
    };

    // מילוי אופציות לסלקט
    const updateOptions = () => {
        let html = `<option value="free">צבע חופשי</option>`;
        themeDefinitions.forEach(t => html += `<option value="theme_${t.id}">${t.name}</option>`);
        html += `<option value="gradient">גרדיאנט ✨</option>`;
        sourceSelect.innerHTML = html;
    };

    sourceSelect.onchange = refreshUI;
    group.append(trigger, sourceSelect);

    // חשיפת פונקציית רענון חיצונית (עבור fillValues)
    group.refreshThemes = () => { updateOptions(); refreshUI(); };

    updateOptions();
    setTimeout(refreshUI, 0);

    return group;
}

const refreshThemes = () => { $$('.ui-smart-color-group').forEach(input => input.refreshThemes()) };
// const refreshThemes = () => { updateOptions(); refreshUI(); };


/**
 * פתיחת חלונית צפה עם סליידר רחב
 */
function openRangePopover(anchor, theme, onUpdate) {
    // ניקוי חלוניות קודמות
    const old = $1('.ui-range-popover');
    if (old) old.remove();

    const popover = createElement('div', { class: 'ui-range-popover' });
    const slider = createElement('input', {
        type: 'range', min: 0, max: 100, value: 50,
        class: 'popover-slider',
        style: `background: linear-gradient(to right, ${theme.anchors.join(', ')})`
    });

    slider.oninput = (e) => {
        const color = Color.mixColors(theme.anchors[0], theme.anchors[1], e.target.value);
        onUpdate(color, e.target.value);
    };

    popover.appendChild(slider);
    document.body.appendChild(popover);

    // מיקום חכם ליד הסמליל
    const rect = anchor.getBoundingClientRect();
    popover.style.top = (rect.bottom + 8) + 'px';
    popover.style.left = (rect.left - 170) + 'px'; // הזחה שמאלה כדי שיבלוט לכיוון הקנבס

    // סגירה בלחיצה בחוץ
    const close = (e) => {
        if (!popover.contains(e.target) && e.target !== anchor) {
            popover.remove();
            document.removeEventListener('mousedown', close);
        }
    };
    document.addEventListener('mousedown', close);
}
