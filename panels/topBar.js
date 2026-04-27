// --- 1. ניהול טולבאר "הפעלות עריכה" ---
const editBar = $('topBar');
const toggleBtn = $('btnToggleEditBar');

toggleBtn.whenClick(() => {
    editBar.toggleClass('collapsed');
    toggleBtn.toggleClass('active');
});

// --- 2. כפתורי גודל מסך (Viewport) ---
const artboard = $1('.canvas-window');
const vpBtns = $$('.vp-btn');

vpBtns.forEach(btn => {
    btn.whenClick(() => {
        vpBtns.removeClass('active');
        btn.addClass('active');

        artboard.style.width = btn.dataset.width;
    });
});

// --- 3. הפעלות עריכה (הקלדה חופשית / גרירה) ---
$('toggleContentEditable').when('change', (e) => {
    const isEditable = e.target.checked;
    artboard.setAttribute('contenteditable', isEditable);
    if (isEditable) {
        artboard.focus();
        // הערה: כדאי לבטל את ה-Drag כשההקלדה פעילה למניעת התנגשויות
        $('toggleDragDrop').checked = false;
        // כאן תקרא לפונקציה שמבטלת גרירה
    }
});

$('toggleDragDrop').when('change', (e) => {
    const isDraggable = e.target.checked;
    // כאן נכנסת הלוגיקה שלך שמפעילה/מבטלת את ה-draggable ב-Services.js
    // למשל: globalDragMode = isDraggable;

    if (isDraggable) {
        // ביטול הקלדה חופשית
        $('toggleContentEditable').checked = false;
        artboard.setAttribute('contenteditable', 'false');
        artboard.addClass('drag-mode-active'); // לקלאס CSS שמראה גבולות
    } else {
        artboard.removeClass('drag-mode-active');
    }
});

// --- 4. זום (Zoom) ---
const zoomRange = $('zoomRange');
const zoomValue = $('zoomValue');
const base = $('דף_הבסיס');

zoomRange.when('input', (e) => {
    const scale = e.target.value / 100;
    base.style.transform = `scale(${scale})`;
    base.style.transformOrigin = 'top center'; // הזום מתחיל מלמעלה
    zoomValue.textContent = e.target.value + '%';
});
