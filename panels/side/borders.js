// ========== פונקציות עזר מקומיות (Helpers) ==========

function createSmartInputHTML(prop, label, defaultUnit = 'px') {
    return /*html*/`
    <div class="smart-input-group design-control">
        <span class="input-label-small" style="font-size:12px; color:#666; min-width: 40px;">${label}</span>
        <div style="display:flex; gap:2px; flex:1;">
            <input type="number" data-prop="${prop}" placeholder="-" style="width: 100%; flex:1;">
            <select class="unit-select" style="width: 50px; padding:0; font-size:11px;">
                <option value="px" ${defaultUnit === 'px' ? 'selected' : ''}>px</option>
                <option value="%" ${defaultUnit === '%' ? 'selected' : ''}>%</option>
                <option value="em" ${defaultUnit === 'em' ? 'selected' : ''}>em</option>
                <option value="rem" ${defaultUnit === 'rem' ? 'selected' : ''}>rem</option>
                <option value="vh" ${defaultUnit === 'vh' ? 'selected' : ''}>vh</option>
                <option value="vw" ${defaultUnit === 'vw' ? 'selected' : ''}>vw</option>
                <option value="" ${defaultUnit === '' ? 'selected' : ''}>-</option>
            </select>
        </div>
    </div>`;
}

function parseUnit(value) {
    if (!value) return { value: '', unit: 'px' };
    const match = value.match(/^([\d\.\-]+)([a-z%]*)$/);
    if (match) {
        return { value: match[1], unit: match[2] || 'px' };
    }
    return { value: value, unit: 'px' };
}

function getActiveSelectorKey() {
    if (!theElement) return '';
    const state = $('dropdown-states').value || '';
    return '#' + theElement.id + state;
}


// ========== HTML ==========

const htmlBorders = /* html */ `
    
    <style>
        .panel-section { border-bottom: 1px solid #eee; margin-bottom: 5px; padding-bottom: 10px; }
        .section-header { cursor: pointer; font-weight: bold; font-size: 13px; color: #333; padding: 8px 5px; display: flex; justify-content: space-between; align-items: center; }
        .section-header:hover { background-color: #f0f0f0; }
        .section-header::after { content: '▼'; font-size: 10px; color: #999; }
        .panel-section.collapsed .section-content { display: none; }
        .panel-section.collapsed .section-header::after { content: '◀'; }
        
        .inputs-grid { display: grid; gap: 8px; margin-top: 8px; }
        .grid-1 { grid-template-columns: 1fr; }
        .grid-2 { grid-template-columns: 1fr 1fr; }
        .grid-4 { grid-template-columns: 1fr 1fr; }

        .mode-switcher { display: flex; background: #e0e0e0; border-radius: 4px; padding: 2px; gap: 2px; margin-bottom: 8px;}
        .mode-btn { flex: 1; border: none; background: transparent; cursor: pointer; font-size: 12px; padding: 4px; border-radius: 3px; }
        .mode-btn:hover { background: rgba(255,255,255,0.5); }
        .mode-btn.active { background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.1); font-weight: bold; }
    </style>

    <div class="panel-section">
        <div class="section-header">קו גבול (Border)</div>
        <div class="section-content">
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                 <div style="flex:1;">
                    <span class="input-label-small">סגנון</span>
                    <select id="borderStyleInput" style="width:100%; padding:5px;">
                        <option value="none">ללא</option>
                        <option value="solid">קו רציף (Solid)</option>
                        <option value="dashed">מקווקו (Dashed)</option>
                        <option value="dotted">מנוקד (Dotted)</option>
                        <option value="double">כפול (Double)</option>
                    </select>
                 </div>
                 <div style="width:40px;">
                    <span class="input-label-small">צבע</span>
                    <input type="color" id="borderColorInput" style="width:100%; height:30px; padding:0; border:none;">
                 </div>
            </div>
            ${createSmartInputHTML('borderWidth', 'עובי הקו', 'px')}
        </div>
    </div>

    <div class="panel-section collapsed"> 
        <div class="section-header">פינות עגולות</div>
        <div class="section-content" id="radiusContainer"></div>
    </div>

    <div class="panel-section">
        <div class="section-header">ריווח פנימי (Padding)</div>
        <div class="section-content" id="paddingContainer"></div>
    </div>

    <div class="panel-section">
        <div class="section-header">ריווח חיצוני (Margin)</div>
        <div class="section-content" id="marginContainer"></div>
    </div>
`;

function generateSpacingControl(type) {
    const iconAll = '⬛';
    const iconAxis = '◫';
    const icon4 = '⚃';

    return /*html*/ `
    <div class="spacing-control" data-spacing-type="${type}">
        <div class="mode-switcher">
            <button class="mode-btn active" data-mode="all" title="אחיד לכולם">${iconAll}</button>
            <button class="mode-btn" data-mode="axis" title="אנכי / אופקי">${iconAxis}</button>
            <button class="mode-btn" data-mode="sides" title="כל צד בנפרד">${icon4}</button>
        </div>
        
        <div class="inputs-grid grid-1" data-mode-content="all">
            ${createSmartInputHTML(type, 'כל הצדדים')}
        </div>
        
        <div class="inputs-grid grid-2" data-mode-content="axis" style="display:none;">
            ${createSmartInputHTML(type + (type === 'borderRadius' ? 'TopLeft' : 'Top'), type === 'borderRadius' ? 'אלכסון 1' : 'אנכי')} 
            ${createSmartInputHTML(type + (type === 'borderRadius' ? 'TopRight' : 'Right'), type === 'borderRadius' ? 'אלכסון 2' : 'אופקי')}
        </div>

        <div class="inputs-grid grid-4" data-mode-content="sides" style="display:none;">
            ${createSmartInputHTML(type + (type === 'borderRadius' ? 'TopLeft' : 'Top'), 'למעלה')}
            ${createSmartInputHTML(type + (type === 'borderRadius' ? 'TopRight' : 'Right'), 'ימין')}
            ${createSmartInputHTML(type + (type === 'borderRadius' ? 'BottomRight' : 'Bottom'), 'למטה')}
            ${createSmartInputHTML(type + (type === 'borderRadius' ? 'BottomLeft' : 'Left'), 'שמאל')}
        </div>
    </div>
    `;
}

// ========== JavaScript (Logic) ==========

htmlBorders.into('#panel-borders');

$('radiusContainer').innerHTML = generateSpacingControl('borderRadius');
$('paddingContainer').innerHTML = generateSpacingControl('padding');
$('marginContainer').innerHTML = generateSpacingControl('margin');

function attachBorderListeners() {

    // ניהול אקורדיונים
    $$('#panel-borders .section-header').whenClick((e) => {
        const section = e.target.closest('.panel-section');
        section.toggleClass('collapsed');
    });

    // מתגי מצבים
    const switchers = $$('#panel-borders .mode-btn');
    switchers.forEach(btn => {
        btn.whenClick((e) => {
            const parent = btn.closest('.spacing-control');
            parent.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const mode = btn.dataset.mode;
            parent.querySelectorAll('[data-mode-content]').forEach(div => div.style.display = 'none');
            const targetDiv = parent.querySelector(`[data-mode-content="${mode}"]`);
            if (targetDiv) targetDiv.style.display = 'grid';
        });
    });

    // אינפוטים חכמים
    const inputs = $$('#panel-borders .smart-input-group input, #panel-borders .smart-input-group select');
    inputs.forEach(el => {
        el.when('input', handleSmartInput);
        el.when('change', handleSmartInput);
    });

    // פקדים רגילים
    $('borderStyleInput').when('change', (e) => updateStyle(getActiveSelectorKey(), 'borderStyle', e.target.value));
    $('borderColorInput').when('input', (e) => updateStyle(getActiveSelectorKey(), 'borderColor', e.target.value));
}

function handleSmartInput(e) {
    if (!theElement) return;

    const wrapper = e.target.closest('.smart-input-group');
    const valInput = wrapper.querySelector('input');
    const unitSelect = wrapper.querySelector('.unit-select');

    const value = valInput.value;
    const unit = unitSelect.value;
    // אם אנחנו במצב "All", ה-prop יהיה פשוט 'margin' או 'padding' בזכות ה-HTML שיצרנו
    // אם אנחנו במצב "Sides", ה-prop יהיה 'marginTop' וכו'.
    const prop = valInput.dataset.prop;

    if (value === '') return;

    const finalValue = value + unit;
    const selector = getActiveSelectorKey();

    // בדיקה אם אנחנו במצב "צירים" (Axis) - היחיד שדורש התערבות ידנית
    const activeModeBtn = e.target.closest('.spacing-control')?.querySelector('.mode-btn.active');
    const mode = activeModeBtn ? activeModeBtn.dataset.mode : null;
    const spacingType = e.target.closest('.spacing-control')?.dataset.spacingType;

    if (mode === 'axis' && (spacingType === 'margin' || spacingType === 'padding')) {
        // פיצול ידני לצירים - כי אין shorthand לציר ב-CSS
        if (prop.includes('Top')) { // הנחה: האינפוט העליון
            updateStyle(selector, spacingType + 'Top', finalValue);
            updateStyle(selector, spacingType + 'Bottom', finalValue);
        } else { // האינפוט התחתון
            updateStyle(selector, spacingType + 'Right', finalValue);
            updateStyle(selector, spacingType + 'Left', finalValue);
        }
    } else {
        // בכל שאר המצבים (All / Sides / Radius) - סומכים על הדפדפן!
        // אם prop הוא 'margin', הדפדפן יעדכן את כל הצדדים.
        // אם prop הוא 'marginTop', הדפדפן יעדכן רק למעלה.
        updateStyle(selector, prop, finalValue);
    }
}

function fillCorrectBorders() {
    if (!theElement) return;
    const selector = getActiveSelectorKey();

    // סגנון וצבע
    const borderStyle = getStyle(selector, 'borderStyle') || theStyles.borderStyle;
    if (borderStyle) $('borderStyleInput').value = borderStyle;

    const borderColor = getStyle(selector, 'borderColor') || theStyles.borderColor;
    if (borderColor) $('borderColorInput').value = rgbToHex(borderColor);

    // מילוי פקדים חכמים
    const inputs = $$('#panel-borders .smart-input-group input');

    inputs.forEach(input => {
        const prop = input.dataset.prop;

        // 1. נסה לשלוף מהחוקים שיצרנו (Shorthand או Longhand)
        // אם מוגדר margin: 10px, הקריאה ל-marginTop תחזיר 10px אוטומטית ע"י הדפדפן
        let val = getStyle(selector, prop);

        // 2. אם אין בחוק, שלוף מה-Computed
        if (!val && theStyles[prop]) {
            val = theStyles[prop];
        }

        if (val) {
            const parsed = parseUnit(val);
            input.value = parsed.value;
            const unitSel = input.parentElement.querySelector('.unit-select');
            if (unitSel) unitSel.value = parsed.unit;
        } else {
            input.value = '';
        }
    });
}

attachBorderListeners();







