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
        const offset = e.target.dataset.offset || '';
        let value = e.target.value;
        const aa = editor.offsetLeft;
        const ab = editor.offsetTop;
        if (offset) {
            value = parseInt(value)
            if (offset === 'h')
                value += parseInt(editor.offsetLeft);
            else if (offset === 'v')
                value += parseInt(editor.offsetTop);
            value = value.toString();
        }

        //  קבע את הסלקטור
        const state = $('dropdown-states').value; // ':hover', ':focus' או ""
        const selector = '#' + theElement.id + state; // '#כותרת-לדוגמא:hover'

        if (prop && selector)
            updateStyle(selector, prop, value + unit);
    });

    if (panelName === 'panel-design') {
        $('gradientBtn').whenClick(toggleGradient);
        $('gradientDiv').when('input', () => {
            const gr = `linear-gradient(90deg, ${$('gradient1').value}, ${$('gradient2').value})`;
            const selector = '#' + theElement.id + $('dropdown-states').value;
            updateStyle(selector, 'background', gr);
        })
    }

}