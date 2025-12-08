const htmlSidebar = /*html*/ `

<div class="activity-btn" data-panel="panel-tree" title="מבנה העמוד">
    <svg viewBox="0 0 24 24">
        <path
            d="M3 3h6v6H3V3zm12 0h6v6h-6V3zM3 15h6v6H3v-6zm12 0h6v6h-6v-6zM10 6h4v1h-4V6zm0 12h4v1h-4v-1zM6 10v4h1v-4H6zm12 0v4h1v-4h-1z"
            fill="currentColor" />
    </svg>
</div>

<div class="activity-btn" data-panel="panel-add-element" title="הוספת אלמנטים">
    <svg viewBox="0 0 24 24">
        <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
            fill="currentColor" />
    </svg>
</div>

<div class="activity-btn" data-panel="panel-design" title="עיצוב">
    <svg viewBox="0 0 24 24">
        <path
            d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
            fill="currentColor" />
    </svg>
</div>

<div class="activity-btn" data-panel="panel-borders" title="גבולות">
    <svg viewBox="0 0 24 24">
        <path d="M3 3v18h18V3H3zm16 16H5V5h14v14z" fill="currentColor" />
        <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h6v2H7z" fill="currentColor" />
    </svg>
</div>

<div class="activity-btn" data-panel="panel-layout" title="פריסה">
    <svg viewBox="0 0 24 24">
        <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" stroke-width="2" />
        <path d="M4 12h16M12 6v12" stroke="currentColor" stroke-width="2" />
    </svg>
</div>

<div class="activity-btn" data-panel="panel-position" title="מיקום">
    <svg viewBox="0 0 24 24">
        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" fill="currentColor" />
    </svg>
</div>

<div class="activity-btn" data-panel="panel-display" title="תצוגה">
    <svg viewBox="0 0 24 24">
        <path
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            fill="currentColor" />
    </svg>
</div>

<div class="activity-btn" data-panel="panel-classes" title="ניהול קלאסים">
    <svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="none"/>
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="currentColor"/>
    </svg>
</div>
<div class="activity-btn" data-panel="panel-theme" title="צבעי נושא גלובליים">
    <svg viewBox="0 0 24 24">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor" />
    </svg>
</div>
<br>
<br>
<br>
<br>
<div class="activity-btn" data-panel="panel-settings" title="ניהול קלאסים">
    <svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="none"/>
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="currentColor"/>
    </svg>
</div>
`;

htmlSidebar.into(sidebar);


sidebar.whenClick((e) => {
    const btn = e.upTo('.activity-btn');
    if (btn) {
        // לוקח את ה-ID של הפאנל מה-HTML (data-panel)
        toggleActivityPanel(btn);
    }
});

/**
 * פונקציה לצביעת הכפתור הפעיל בלבד
*/
function updateActivityBarState(activeBtn) {
    if (thePanel)
        $1(`.activity-btn[data-panel=${thePanel.id}]`).removeClass('active');
    if (activeBtn)
        activeBtn.addClass('active');
}

/**
 * הפונקציה הראשית לניהול לחיצה על אייקון בסרגל
*/
function toggleActivityPanel(btn) {
    const panelId = btn.dataset.panel;
    const panel = $(panelId);

    // 1. אם לחצו על הפאנל שכבר פתוח -> סגור את אזור הפאנלים
    if (thePanel === panel) {
        panelArea.removeClass('open');
        updateActivityBarState(null); // כיבוי האייקון הפעיל
        updatePanel(null);
    } else {
        // 2. אחרת -> פתח את הפאנל החדש
        panelArea.addClass('open');
        updateActivityBarState(btn);
        updatePanel(panel);
    }
}

function restartPanel(panel) {
    const panelName = panel.id;

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

        case 'panel-classes':
            refreshClassesView();
            break;

        case 'panel-theme':
            fillCorrectTheme();
            break;

        default:
            break;
    }
}
