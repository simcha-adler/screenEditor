
// ========== HTML ==========
const htmlView =  /* html */ `
<div id="panel-display" class="design-panel">
    <h4>תצוגה (Display)</h4>
    <label class="design-control">
        <span>סוג תצוגה</span>
        <select data-style-prop="display">
            <option value="block">Block</option>
            <option value="inline">Inline</option>
            <option value="inline-block">Inline-Block</option>
            <option value="flex">Flex</option>
            <option value="grid">Grid</option>
            <option value="none">None (מוסתר)</option>
        </select>
    </label>
    <label class="design-control">
        <span>נראות</span>
        <select data-style-prop="visibility">
            <option value="visible">נראה</option>
            <option value="hidden">מוסתר (שומר מקום)</option>
        </select>
    </label>
    <label class="design-control">
        <span>אטימות (Opacity)</span>
        <input type="number" data-style-prop="opacity" min="0" max="1" step="0.1" value="1" style="width: 60px;">
    </label>
    <label class="design-control">
        <span>גלישה (Overflow)</span>
        <select data-style-prop="overflow">
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
            <option value="scroll">Scroll</option>
            <option value="auto">Auto</option>
        </select>
    </label>
</div>
`;

// ========== JavaScript ==========
function loadViewPanel() {
    editPanel.innerHTML = htmlView;
    fillCorrectView();
}

function fillCorrectView() {
    const panel = $('panel-display');
    if (!panel) return;

    panel.$1('[data-style-prop="display"]').value = theStyles.display;
    panel.$1('[data-style-prop="visibility"]').value = theStyles.visibility;
    panel.$1('[data-style-prop="opacity"]').value = theStyles.opacity;
    panel.$1('[data-style-prop="overflow"]').value = theStyles.overflow;
}

