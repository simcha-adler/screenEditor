function loadPanel(panelName) {

    switch (panelName) {
        case 'panel-borders':
            loadBorderPanel();
            break;

        case 'panel-design':
            loadDesignPanel();
            break;

        case 'panel-view':
            loadViewPanel();
            break;

        case 'panel-position':
            loadPositionPanel();
            break;

        case 'panel-layout':
            loadLayoutPanel();
            break;

        case 'panel-add':
            loadAddElementPanel();
            break;

        default:
            return false;
    }

    return true;
}


function restartPanel(panelName) {

    switch (panelName) {
        case 'panel-borders':
            fillCorrectBorders();
            break;

        case 'panel-design':
            fillCorrectDesign();
            break;

        case 'panel-view':
            fillCorrectView();
            break;

        case 'panel-position':
            fillCorrectPosition();
            break;

        case 'panel-layout':
            fillCorrectLayout();
            break;

        default:
            break;
    }
}
