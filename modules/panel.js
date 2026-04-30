//@ts-check

let thePanel = null;


/**
 * הפונקציה הראשית לניהול לחיצה על אייקון בסרגל
 * @param {string} panelId; @param {HTMLElement} btn  
*/
function toggleActivityPanel(panelId, btn = null) {
    const panel = $(panelId);
    if (!btn) btn = sidebar.$1(`[data-panel=${panelId}]`);

    if (panelId === 'panel-tree') {
        panelRight.toggleClass('open');
        btn.toggleClass('active');
        return;
    }

    // 1. אם לחצו על הפאנל שכבר פתוח
    if (thePanel === panel) {
        btn.removeClass('active'); // כיבוי האייקון הפעיל
        updatePanel(null);
    } else {
        if (thePanel)
            sidebar.$1(`[data-panel=${thePanel.id}]`).removeClass('active');
        btn.addClass('active');
        updatePanel(panel);
    }
}

function restartPanel(panel) {
    const panelName = panel.id;

    switch (panelName) {
        case 'panel-tree':
        case 'panel-theme':
        case 'panel-settings':
            break;

        case 'panel-classes':
            refreshClassesView();
            break;

        default:
            fillValues.panel(panel);
            break;
    }
}


/**
 * טעינת התוכן לפאנל
*/
function updatePanel(panel) {
    if (thePanel === panel) return;

    // צריך לתמוך במצב פתיחת פאנל, סגירה ויזואלית, והחלפה מיידית
    if (panel) { // פתיחה או החלפה מיידית
        panelLeft.addClass('open');
        if (thePanel) thePanel.addClass('hide');
        panel.removeClass('hide');
        fillValues.panel(panel);
    } else if (thePanel) {
        panelLeft.removeClass('open');
        const temp = thePanel;
        setTimeout(() => {
            if (!panelLeft.classList.contains('open')) //כדי למנוע תקלות בסגירה ופתיחה מיידית
                temp.addClass('hide'); // מסתיר את הפאנל רק אחרי הסגירה באנימציה
        }, 300);
    }
    thePanel = panel;
}


export const Panel = {
    get: () => thePanel,
    update: toggleActivityPanel,
    restart: restartPanel
}

//@ts-ignore
window.Panel = Panel;
