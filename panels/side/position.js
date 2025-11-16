
// ========== HTML ==========
const htmlPosition =  /* html */ `
<div id="panel-position" class="design-panel">
    <h4>מיקום (Position)</h4>
    <label class="design-control">
        <span>סוג מיקום</span>
        <select data-style-prop="position">
            <option value="static">סטטי (ברירת מחדל)</option>
            <option value="relative">יחסי</option>
            <option value="absolute">מוחלט</option>
            <option value="fixed">קבוע</option>
            <option value="sticky">דביק</option>
        </select>
    </label>
    <div class="design-control-grid-4">
        <label>למעלה <input type="text" data-style-prop="top" data-offset="v" data-unit="px"></label>
        <label>ימין <input type="text" data-style-prop="right" data-offset="h" data-unit="px"></label>
        <label>למטה <input type="text" data-style-prop="bottom" data-offset="v" data-unit="px"></label>
        <label>שמאל <input type="text" data-style-prop="left" data-offset="h" data-unit="px"></label>
    </div>
    <label class="design-control">
        <span>Z-Index</span>
        <input type="number" data-style-prop="zIndex" style="width: 60px;">
    </label>

    <h4 style="margin-top: 15px;">גודל (Size)</h4>
    <div class="design-control-grid-4">
        <label>רוחב <input type="text" data-style-prop="width"></label>
        <label>גובה <input type="text" data-style-prop="height"></label>
        <label>רוחב מינ' <input type="text" data-style-prop="minWidth"></label>
        <label>גובה מינ' <input type="text" data-style-prop="minHeight"></label>
    </div>
</div>
`;

// ========== JavaScript ==========
function loadPositionPanel() {
    editPanel.innerHTML = htmlPosition;
    fillCorrectPosition();
}

function fillCorrectPosition() {
    // מילוי ערכים מ-theStyles
    const panel = $('panel-position');
    if (!panel) return;

    panel.$1('[data-style-prop="position"]').value = theStyles.position;
    panel.$1('[data-style-prop="top"]').value = theStyles.top;
    panel.$1('[data-style-prop="right"]').value = theStyles.right;
    panel.$1('[data-style-prop="bottom"]').value = theStyles.bottom;
    panel.$1('[data-style-prop="left"]').value = theStyles.left;
    panel.$1('[data-style-prop="zIndex"]').value = theStyles.zIndex;

    panel.$1('[data-style-prop="width"]').value = theStyles.width;
    panel.$1('[data-style-prop="height"]').value = theStyles.height;
    panel.$1('[data-style-prop="minWidth"]').value = theStyles.minWidth;
    panel.$1('[data-style-prop="minHeight"]').value = theStyles.minHeight;
}


