const htmlDesign = `<div id="panel-colors" class="design-panel" style="display: block;">
    <h4>צבע וטיפוגרפיה</h4>

    <label for="fontFamilyInput" class="design-control">
        <span>גופן</span>
        <select id="fontFamilyInput" data-style-prop="fontFamily" style="width: 120px;">
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Verdana, sans-serif">Verdana</option>
        </select>
    </label>

    <label for="fontSizeInput" class="design-control">
        <span>גודל גופן (px)</span>
        <input type="number" id="fontSizeInput" data-style-prop="fontSize" data-unit="px" min="8" max="120" value="16"
            style="width: 50px; text-align: left;">
    </label>

    <label for="colorInput" class="design-control">
        <span>צבע טקסט</span>
        <input type="color" id="colorInput" data-style-prop="color" value="#000000">
    </label>

    <label for="bgColorInput" class="design-control">
        <span>צבע רקע (סימון)</span>
        <input type="color" id="bgColorInput" data-style-prop="backgroundColor" value="#ffff00">
    </label>

    <button id="gradientBtn">גרדיאנט</button>
    <div id="gradientDiv" style="display: none;">
    <label for="bgColorInput" class="design-control">
    
    <span>צבע 1</span>
        <input type="color" id="gradient1" value="#ffffff">
        <span>צבע 2</span>
        <input type="color" id="gradient2" value="#ffffff">
    
        </label>
    </div>
</div>`;

function loadDesignPanel() {
    editPanel.innerHTML = htmlDesign;
    fillCorrectDesign();
}

function fillCorrectDesign() {
    // --- 1. עדכון פאנל צבע וטיפוגרפיה ---
    const colorInput = $('colorInput');
    const bgColorInput = $('bgColorInput');
    const fontSizeInput = $('fontSizeInput');
    const fontFamilyInput = $('fontFamilyInput');

    if (colorInput) colorInput.value = rgbToHex(theStyles.color);
    if (bgColorInput) bgColorInput.value = rgbToHex(theStyles.backgroundColor);
    if (fontSizeInput) fontSizeInput.value = parseInt(theStyles.fontSize, 10);
    if (fontFamilyInput) {
        const mainFont = theStyles.fontFamily.split(',')[0].replace(/"/g, '').trim();
        let found = Array.from(fontFamilyInput.options).find(opt => opt.value.includes(mainFont));
        fontFamilyInput.value = found ? found.value : 'Arial, sans-serif';
    }
}

function toggleGradient() {
    const gradientDisplay = $('gradientDiv').style.display;
    $('gradientDiv').style.display = gradientDisplay === 'block' ? 'none' : 'block';
}

