
// ========== HTML ==========
const htmlView =  /* html */ `

<h4>תצוגה (Display)</h4>
<label class="design-control">
    <span>סוג תצוגה</span>
    <select data-property="display">
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
    <select data-property="visibility">
        <option value="visible">נראה</option>
        <option value="hidden">מוסתר (שומר מקום)</option>
    </select>
</label>
<label class="design-control">
    <span>אטימות (Opacity)</span>
    <input type="number" data-property="opacity" min="0" max="1" step="0.1" value="1" style="width: 60px;">
</label>
<label class="design-control">
    <span>גלישה (Overflow)</span>
    <select data-property="overflow">
        <option value="visible">Visible</option>
        <option value="hidden">Hidden</option>
        <option value="scroll">Scroll</option>
        <option value="auto">Auto</option>
    </select>
</label>
`;

// ========== JavaScript ==========

htmlView.into('#panel-display');

function fillCorrectView() {
    const panel = $('panel-display');
    if (!panel) return;

    panel.$1('[data-property="display"]').value = theStyles.display;
    panel.$1('[data-property="visibility"]').value = theStyles.visibility;
    panel.$1('[data-property="opacity"]').value = theStyles.opacity;
    panel.$1('[data-property="overflow"]').value = theStyles.overflow;
}

