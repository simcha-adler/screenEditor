function loadDocumentListeners() {

    /**
 * מאזין האירועים הראשי לזיהוי האלמנט הנבחר.
 */
    document.when('selectionchange', () => {
        if (document.activeElement === editor || editor.contains(window.getSelection().anchorNode)) {
            updateSelectedElement();
        }
    });

    $('selectedElement').when('input', (e) => { updateSelectedElement($(`${e.target.value}`)) });

    $('design-menu-items').whenClick((e) => {
        const panelId = "panel-" + e.target.dataset.panel;
        if (panelId) {
            updatePanel(panelId);
        }
    });

    // מאזין 'input' פועל לרוב הפקדים (טקסט, מספר, צבע)
    sidePanel.when('input' || 'change', (e) => {
        if (!theElement) return;

        const prop = e.target.dataset.styleProp;
        const unit = e.target.dataset.unit || ''; // למשל 'px'
        let value = e.target.value;

        //  קבע את הסלקטור
        const state = $('dropdown-states').value; // ':hover', ':focus' או ""
        const selector = '#' + theElement.id + state; // '#כותרת-לדוגמא:hover'

        if (prop && selector)
            updateStyle(selector, prop, value + unit);
    });

    document.whenClick(closeOpenedNav);
}

function loadPanelListeners(panelName) {

    if (panelName === 'panel-design') {
        $('gradientBtn').whenClick(toggleGradient);
        $('gradientDiv').when('input', () => {
            const gr = `linear-gradient(90deg, ${$('gradient1').value}, ${$('gradient2').value})`;
            const selector = '#' + theElement.id + $('dropdown-states').value;
            updateStyle(selector, 'background', gr);
        })
    }

}