let htmlBorders = `<div id="panel-borders" class="design-panel" style="display: block;">
    <h4>גבולות (Borders)</h4>
    <label for="borderWidthInput" class="design-control">
        <span>עובי (px)</span>
        <input type="number" id="borderWidthInput" data-style-prop="borderWidth" data-unit="px" min="0" max="50"
            value="0" style="width: 50px;">
    </label>
    <label for="borderStyleInput" class="design-control">
        <span>סגנון</span>
        <select id="borderStyleInput" data-style-prop="borderStyle" style="width: 120px;">
            <option value="none">ללא</option>
            <option value="solid">רציף</option>
            <option value="dotted">מנוקד</option>
            <option value="dashed">מקווקו</option>
            <option value="double">כפול</option>
        </select>
    </label>
    <label for="borderColorInput" class="design-control">
        <span>צבע גבול</span>
        <input type="color" id="borderColorInput" data-style-prop="borderColor" value="#000000">
    </label>

    <h4 style="margin-top: 15px;">עיגול פינות</h4>
    <label for="borderRadiusInput" class="design-control">
        <span>רדיוס (px)</span>
        <input type="number" id="borderRadiusInput" data-style-prop="borderRadius" data-unit="px" min="0" max="100"
            value="0" style="width: 50px;">
    </label>
</div>

<div id="panel-layout" class="design-panel" style="display: block;">
    <h4>ריווח פנימי (Padding)</h4>
    <div class="design-control-grid-4">
        <label>למעלה <input type="number" data-style-prop="paddingTop" data-unit="px" min="0" value="0"></label>
        <label>ימין <input type="number" data-style-prop="paddingRight" data-unit="px" min="0" value="0"></label>
        <label>למטה <input type="number" data-style-prop="paddingBottom" data-unit="px" min="0" value="0"></label>
        <label>שמאל <input type="number" data-style-prop="paddingLeft" data-unit="px" min="0" value="0"></label>
    </div>

    <h4 style="margin-top: 15px;">ריווח חיצוני (Margin)</h4>
    <div class="design-control-grid-4">
        <label>למעלה <input type="number" data-style-prop="marginTop" data-unit="px" min="0" value="0"></label>
        <label>ימין <input type="number" data-style-prop="marginRight" data-unit="px" min="0" value="0"></label>
        <label>למטה <input type="number" data-style-prop="marginBottom" data-unit="px" min="0" value="0"></label>
        <label>שמאל <input type="number" data-style-prop="marginLeft" data-unit="px" min="0" value="0"></label>
    </div>
</div>`

function borderPanel() {
    editPanel.innerHTML = htmlBorders;
    fillCorrectBorders();
}

function fillCorrectBorders() {
    // --- 2. עדכון פאנל גבולות (חדש) ---
    const borderWidthInput = $('#borderWidthInput');
    const borderStyleInput = $('#borderStyleInput');
    const borderColorInput = $('#borderColorInput');
    const borderRadiusInput = $('#borderRadiusInput');

    if (borderWidthInput) borderWidthInput.value = parseInt(styles.borderWidth, 10) || 0;
    if (borderStyleInput) borderStyleInput.value = styles.borderStyle;
    if (borderColorInput) borderColorInput.value = rgbToHex(styles.borderColor);
    if (borderRadiusInput) borderRadiusInput.value = parseInt(styles.borderRadius, 10) || 0;

    // --- 3. עדכון פאנל פריסה (חדש) ---
    // (אנו משתמשים ב-querySelector כדי למצוא לפי data-style-prop)
    const paddingTopInput = $(`#panel-layout [data-style-prop="paddingTop"]`);
    const paddingRightInput = $(`#panel-layout [data-style-prop="paddingRight"]`);
    const paddingBottomInput = $(`#panel-layout [data-style-prop="paddingBottom"]`);
    const paddingLeftInput = $(`#panel-layout [data-style-prop="paddingLeft"]`);

    if (paddingTopInput) paddingTopInput.value = parseInt(styles.paddingTop, 10) || 0;
    if (paddingRightInput) paddingRightInput.value = parseInt(styles.paddingRight, 10) || 0;
    if (paddingBottomInput) paddingBottomInput.value = parseInt(styles.paddingBottom, 10) || 0;
    if (paddingLeftInput) paddingLeftInput.value = parseInt(styles.paddingLeft, 10) || 0;

    const marginTopInput = $(`#panel-layout [data-style-prop="marginTop"]`);
    const marginRightInput = $(`#panel-layout [data-style-prop="marginRight"]`);
    const marginBottomInput = $(`#panel-layout [data-style-prop="marginBottom"]`);
    const marginLeftInput = $(`#panel-layout [data-style-prop="marginLeft"]`);

    if (marginTopInput) marginTopInput.value = parseInt(styles.marginTop, 10) || 0;
    if (marginRightInput) marginRightInput.value = parseInt(styles.marginRight, 10) || 0;
    if (marginBottomInput) marginBottomInput.value = parseInt(styles.marginBottom, 10) || 0;
    if (marginLeftInput) marginLeftInput.value = parseInt(styles.marginLeft, 10) || 0;
}
