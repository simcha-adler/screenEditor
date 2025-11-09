function replacePanel(panelId) {
    treeContainer.style.display = 'none';
    toggleTree.innerHTML = '&#127795;';
    updateSelectedElement();

    if (panelId === 'panel-borders')
        borderPanel();
    if (panelId === 'panel-colors')
        designPanel();
}

function restartPanel(panelId) {
    if (panelId === 'panel-borders')
        fillCorrectBorders();
    if (panelId === 'panel-colors')
        fillCorrectDesign();
}


$('#design-menu-items').whenClick((e) => {
    const panelId = "panel-" + e.target.dataset.panel;
    if (panelId) {
        replacePanel(panelId);
    }
});
