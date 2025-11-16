
// ========== HTML ==========
const htmlLayout =  /* html */ `
<div id="panel-layout" class="design-panel">
    <h4>פריסת פלקס (Flex Container)</h4>
    <p style="font-size: 12px; margin-top: 0;">הגדרות אלו רלוונטיות אם התצוגה היא 'Flex'</p>
    
    <label class="design-control">
        <span>כיוון (Direction)</span>
        <select data-style-prop="flexDirection">
            <option value="row">שורה (Row)</option>
            <option value="column">טור (Column)</option>
            <option value="row-reverse">שורה הפוכה</option>
            <option value="column-reverse">טור הפוך</option>
        </select>
    </label>
    <label class="design-control">
        <span>יישור ציר ראשי (Justify)</span>
        <select data-style-prop="justifyContent">
            <option value="flex-start">התחלה</option>
            <option value="center">מרכז</option>
            <option value="flex-end">סוף</option>
            <option value="space-between">רווח-ביניהם</option>
            <option value="space-around">רווח-מסביב</option>
        </select>
    </label>
    <label class="design-control">
        <span>יישור ציר משני (Align)</span>
        <select data-style-prop="alignItems">
            <option value="flex-start">התחלה</option>
            <option value="center">מרכז</option>
            <option value="flex-end">סוף</option>
            <option value="stretch">מתיחה (Stretch)</option>
            <option value="baseline">קו בסיס</option>
        </select>
    </label>
    <label class="design-control">
        <span>גלישת שורות (Wrap)</span>
        <select data-style-prop="flexWrap">
            <option value="nowrap">ללא גלישה</option>
            <option value="wrap">גלישה</option>
            <option value="wrap-reverse">גלישה הפוכה</option>
        </select>
    </label>
</div>
`;

// ========== JavaScript ==========
function loadLayoutPanel() {
    editPanel.innerHTML = htmlLayout;
    fillCorrectLayout();
}

function fillCorrectLayout() {
    const panel = $('panel-layout');
    if (!panel) return;

    panel.$1('[data-style-prop="flexDirection"]').value = theStyles.flexDirection;
    panel.$1('[data-style-prop="justifyContent"]').value = theStyles.justifyContent;
    panel.$1('[data-style-prop="alignItems"]').value = theStyles.alignItems;
    panel.$1('[data-style-prop="flexWrap"]').value = theStyles.flexWrap;
}

