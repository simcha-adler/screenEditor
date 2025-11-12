function loadPanel(panelName) {

    if (panelName === 'panel-borders') {
        loadBorderPanel();
    } else if (panelName === 'panel-design') {
        loadDesignPanel();
    } else {
        return false;
    }
    return true;
}

function restartPanel(panelName) {
    if (!panelName) return;

    if (panelName === 'panel-borders')
        fillCorrectBorders();
    else if (panelName === 'panel-design')
        fillCorrectDesign();
}

function loadDefaultPanel() {
    editPanel.innerHTML = `<div id="panel-default" class="design-panel" style="display: block;">
        <p style="font-size: 13px; color: #777;">בחר אפשרות מתוך תפריט "עיצוב" כדי לטעון כאן הגדרות.</p>
        </div>`;
}
