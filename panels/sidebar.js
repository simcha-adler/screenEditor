const htmlSidebar = /*html*/ `

<div class="activity-btn" data-panel="panel-tree" title="מבנה העמוד">
    <i class="ri-node-tree"></i>
</div>

<div class="activity-btn" data-panel="panel-add-element" title="הוספת אלמנטים">
    <i class="ri-add-circle-line"></i>
</div>

<div class="activity-btn" data-panel="panel-design" title="עיצוב (צבעים וטקסט)">
    <i class="ri-brush-line"></i>
</div>

<div class="activity-btn" data-panel="panel-borders" title="גבולות וריווח">
    <i class="ri-layout-line"></i>
</div>

<div class="activity-btn" data-panel="panel-layout" title="פריסה (Flex/Grid)">
    <i class="ri-layout-masonry-line"></i>
</div>

<div class="activity-btn" data-panel="panel-position" title="מיקום (Position)">
    <i class="ri-drag-move-2-line"></i>
</div>

<div class="activity-btn" data-panel="panel-display" title="תצוגה ואפקטים">
    <i class="ri-eye-line"></i>
</div>

<div class="activity-btn" data-panel="panel-animations" title="אנימציות">
    <i class="ri-movie-line"></i>
</div>

<div class="activity-btn" data-panel="panel-classes" title="ניהול קלאסים">
    <i class="ri-code-s-slash-line"></i>
</div>

<div class="activity-btn" data-panel="panel-theme" title="ערכת נושא">
    <i class="ri-palette-line"></i>
</div>

<div class="spacer" style="flex-grow: 1;"></div>

<div class="activity-btn" data-panel="panel-settings" title="הגדרות">
    <i class="ri-settings-3-line"></i>
</div>
`;

htmlSidebar.into(sidebar);


sidebar.whenClick((e) => {
    const btn = e.upTo('.activity-btn');
    if (btn) toggleActivityPanel(btn);
});

/**
 * פונקציה לצביעת הכפתור הפעיל בלבד
*/
function updateActivityBarState(activeBtn) {
    if (thePanel) // לא נוגע בכפתור של פאנל עץ
        $1(`.activity-btn[data-panel=${thePanel.id}]`).removeClass('active');
    activeBtn?.addClass('active');
}

/**
 * הפונקציה הראשית לניהול לחיצה על אייקון בסרגל
*/
function toggleActivityPanel(btn) {
    const panelId = btn.dataset.panel;
    const panel = $(panelId);

    if (panelId === 'panel-tree') {
        panelRight.toggleClass('open');
        btn.toggleClass('active');
    }

    else {
        // 1. אם לחצו על הפאנל שכבר פתוח -> סגור את אזור הפאנלים
        if (thePanel === panel) {
            panelLeft.removeClass('open');
            updateActivityBarState(null); // כיבוי האייקון הפעיל
            updatePanel(null);
        } else {
            // 2. אחרת -> פתח את הפאנל החדש
            panelLeft.addClass('open');
            updateActivityBarState(btn);
            updatePanel(panel);
        }
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
            fillValues.panel(panelName);
            break;
    }
}
