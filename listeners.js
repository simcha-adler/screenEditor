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
    document.whenClick(closeNavs);
}

function loadPanelListeners(panelName) {
    // מאזין 'input' פועל לרוב הפקדים (טקסט, מספר, צבע)
    sidebar.when('input' || 'change', (e) => {
        if (!theElement) return;

        const prop = e.target.dataset.styleProp;
        const unit = e.target.dataset.unit || ''; // למשל 'px'

        if (prop)
            theElement.style[prop] = e.target.value + unit;
    });

    if (panelName === 'panel-design') {
        $('gradientBtn').whenClick(toggleGradient);
        $('gradientDiv').when('input', () => {
            const gr = `linear-gradient(90deg, ${$('gradient1').value}, ${$('gradient2').value})`;
            theElement.style.background = gr;
        })
    }

}