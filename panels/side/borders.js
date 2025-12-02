let htmlBorders =  /* html */ `

<h4>גבולות (Borders)</h4>
<label for="borderWidthInput" class="design-control">
    <span>עובי (px)</span>
    <input type="number" id="borderWidthInput" data-property="borderWidth" data-unit="px" min="0" max="50"
        value="0" style="width: 50px;">
</label>
<label for="borderStyleInput" class="design-control">
    <span>סגנון</span>
    <select id="borderStyleInput" data-property="borderStyle" style="width: 120px;">
        <option value="none">ללא</option>
        <option value="solid">רציף</option>
        <option value="dotted">מנוקד</option>
        <option value="dashed">מקווקו</option>
        <option value="double">כפול</option>
    </select>
</label>
<label for="borderColorInput" class="design-control">
    <span>צבע גבול</span>
    <input type="color" id="borderColorInput" data-property="borderColor" value="#000000">
</label>

<h4 style="margin-top: 15px;">עיגול פינות</h4>
<label for="borderRadiusInput" class="design-control">
    <span>רדיוס (px)</span>
    <input type="number" id="borderRadiusInput" data-property="borderRadius" data-unit="px" min="0" max="100"
        value="0" style="width: 50px;">
</label>

<h4>ריווח פנימי (Padding)</h4>
<div class="design-control-grid-4">
    <label>למעלה <input type="number" id="paddingTopInput" data-property="paddingTop" data-unit="px" min="0" value="0"></label>
    <label>ימין <input type="number" id="paddingRightInput" data-property="paddingRight" data-unit="px" min="0" value="0"></label>
    <label>למטה <input type="number" id="paddingBottomInput" data-property="paddingBottom" data-unit="px" min="0" value="0"></label>
    <label>שמאל <input type="number" id="paddingLeftInput" data-property="paddingLeft" data-unit="px" min="0" value="0"></label>
</div>

<h4 style="margin-top: 15px;">ריווח חיצוני (Margin)</h4>
<div class="design-control-grid-4">
    <label>למעלה <input type="number" id="marginTopInput" data-property="marginTop" data-unit="px" min="0" value="0"></label>
    <label>ימין <input type="number" id="marginRightInput" data-property="marginRight" data-unit="px" min="0" value="0"></label>
    <label>למטה <input type="number" id="marginBottomInput" data-property="marginBottom" data-unit="px" min="0" value="0"></label>
    <label>שמאל <input type="number" id="marginLeftInput" data-property="marginLeft" data-unit="px" min="0" value="0"></label>
</div>
`

htmlBorders.into('#panel-borders');

function fillCorrectBorders() {
    // --- 2. עדכון פאנל גבולות ---
    $('borderWidthInput').value = parseInt(theStyles.borderWidth, 10) || 0;
    $('borderStyleInput').value = theStyles.borderStyle;
    $('borderColorInput').value = rgbToHex(theStyles.borderColor);
    $('borderRadiusInput').value = parseInt(theStyles.borderRadius, 10) || 0;

    // --- 3. עדכון פאנל פריסה ---
    $('paddingTopInput').value = parseInt(theStyles.paddingTop, 10) || 0;
    $('paddingRightInput').value = parseInt(theStyles.paddingRight, 10) || 0;
    $('paddingBottomInput').value = parseInt(theStyles.paddingBottom, 10) || 0;
    $('paddingLeftInput').value = parseInt(theStyles.paddingLeft, 10) || 0;

    $('marginTopInput').value = parseInt(theStyles.marginTop, 10) || 0;
    $('marginRightInput').value = parseInt(theStyles.marginRight, 10) || 0;
    $('marginBottomInput').value = parseInt(theStyles.marginBottom, 10) || 0;
    $('marginLeftInput').value = parseInt(theStyles.marginLeft, 10) || 0;

}
