const htmlDesign = /* html */ `
<div id="panel-colors" class="design-panel" style="display: block;">
    <h4>צבע וטיפוגרפיה</h4>

    <label for="fontFamilyInput" class="design-control">
        <span>גופן</span>
        <select id="fontFamilyInput" data-property="fontFamily" style="width: 120px;">
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Verdana, sans-serif">Verdana</option>
        </select>
    </label>

    <label for="fontSizeInput" class="design-control">
        <span>גודל גופן (px)</span>
        <input type="number" id="fontSizeInput" data-property="fontSize" data-unit="px" min="8" max="120" value="16"
            style="width: 50px; text-align: left;">
    </label>

    <label for="colorInput" class="design-control">
        <span>צבע טקסט</span>
        <input type="color" id="colorInput" data-property="color" value="#000000">
    </label>

    <label for="bgColorInput" class="design-control">
        <span>צבע רקע (סימון)</span>
        <input type="color" id="bgColorInput" data-property="backgroundColor" value="#ffff00">
    </label>

    <button id="gradientBtn">גרדיאנט</button>
    <div id="gradientDiv" style="display: none;">
        <label for="bgColorInput" class="design-control">            
            <span>זווית</span>
            <input type="number" id="deg" data-property="gradient" value="0"  style="width: 50px; text-align: center;">
            <span>צבע 1</span>
            <input type="color" id="gradient1" data-property="gradient" value="#ffffff">
            <span>צבע 2</span>
            <input type="color" id="gradient2" data-property="gradient" value="#ffffff">
        </label>
    </div>
</div>`;

function loadDesignPanel() {
    editPanel.innerHTML = htmlDesign;
    fillCorrectDesign();
    loadDesignListeners();
}

function fillCorrectDesign() {
    // --- 1. עדכון פאנל צבע וטיפוגרפיה ---
    const mainFont = theStyles.fontFamily.split(',')[0].replace(/"/g, '').trim();
    let found = Array.from(fontFamilyInput.options).find(opt => opt.value.includes(mainFont));

    $('colorInput').value = rgbToHex(theStyles.color);
    $('bgColorInput').value = rgbToHex(theStyles.backgroundColor);
    $('fontSizeInput').value = parseInt(theStyles.fontSize, 10);
    $('fontFamilyInput').value = found ? found.value : 'Arial, sans-serif';

}

function toggleGradient() {
    const hide = $('gradientDiv').style.display === 'none';
    $('gradientDiv').style.display = hide ? 'block' : 'none';
}

function loadDesignListeners() {
    $('gradientBtn').whenClick(toggleGradient);
}


