const htmlNav = `

<!--=======תפריט קובץ=========-->
<div class="nav-item" id="file-nav">
    <button class="nav-button">קובץ</button>
    <div class="dropdown-menu">
        <div class="dropdown-item" id="newDoc">מסמך חדש</div>
        <div class="dropdown-item" id="saveDoc">שמור</div>
        <div class="dropdown-item" id="downloadHTML">הורד כ-HTML</div>
    </div>
</div>

<!--=======תפריט עריכה=========-->
<div class="nav-item">
<button class="nav-button">עריכה</button>
<div class="dropdown-menu" id="edit-menu-items">
<div class="dropdown-item" data-action="undo">בטל (Undo)</div>
<div class="dropdown-item" data-action="redo">חזור (Redo)</div>
<div class="dropdown-item" data-action="paste">הדבק</div>
<div class="dropdown-item" data-action="selectAll">בחר הכל</div>
</div>
</div>

<!--=======תפריט אלמנטים=========-->
        <div class="nav-item">
<button class="nav-button">אלמנטים</button>
<div class="dropdown-menu" id="elements-menu-items">
        <div class="dropdown-item" id="insertImage">הוסף תמונה (URL)</div>
        <div class="dropdown-item" id="createLink">הוסף קישור (URL)</div>
        <div class="dropdown-item" data-action="insertHorizontalRule">קו מפריד</div>
    </div>
    </div>
    
<!--=======תפריט תצוגה=========-->
    <div class="nav-item" id="view-nav">
    <button class="nav-button">תצוגה</button>
    <div class="dropdown-menu">
    <div class="dropdown-item" id="toggleToolbar">הצג/הסתר סרגל כלים</div>
    <div class="dropdown-item" id="fullscreen">מצב מסך מלא</div>
    <div class="dropdown-item" id="toggleSidebar">הצג/הסתר סרגל צד</div>
    </div>
    </div>
    
<!--=======תפריט עיצוב=========-->
<div class="nav-item" id="design-nav">
    <button class="nav-button">עיצוב</button>
    <div class="dropdown-menu" id="design-menu-items">
        <div class="dropdown-item" data-panel="colors">צבעים וגופנים</div>
        <div class="dropdown-item" data-panel="borders">גבולות ורווחים(Borders)</div>
    </div>
</div>`

nav.innerHTML = htmlNav;
const navItems = $$('.nav-item');


function closeNavs() {
    navItems.forEach(item => {
        item.removeClass('active');
    });
};


navItems.forEach(item => {
    const button = item.querySelector('.nav-button');
    button.whenClick((event) => {
        const wasActive = item.classList.contains('active');
        closeNavs();
        if (!wasActive) {
            item.addClass('active');
        }
        event.stopPropagation();
    });
});

// --- לוגיקה של תפריט "עריכה" ---
$('#edit-menu-items').whenClick((e) => {
    const action = e.target.dataset.action;
    if (action) {
        applyEditorCommand(action);
    }
});

// --- לוגיקה של תפריט "אלמנטים" ---
$('#elements-menu-items').whenClick((e) => {
    const action = e.target.id || e.target.dataset.action;
    editor.focus();
    switch (action) {
        case 'insertImage':
            const imageUrl = prompt('הכנס את כתובת ה-URL של התמונה:');
            if (imageUrl) {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.style.maxWidth = '100%';
                insertNodeAtCursor(img);
            }
            break;
        case 'createLink':
            const linkUrl = prompt('הכנס את כתובת ה-URL של הקישור:');
            if (linkUrl) {
                const selection = window.getSelection();
                if (selection.rangeCount === 0) return;
                const range = selection.getRangeAt(0);
                const a = document.createElement('a');
                a.href = linkUrl;
                if (range.collapsed) {
                    a.textContent = linkUrl;
                    range.insertNode(a);
                } else {
                    try {
                        range.surroundContents(a);
                    } catch (e) {
                        console.error("נכשל ביצירת קישור:", e);
                    }
                }
            }
            break;
        case 'insertHorizontalRule':
            insertNodeAtCursor(document.createElement('hr'));
            break;
    }
});

// --- לוגיקה של תפריט "קובץ" ---
$('#newDoc').whenClick(() => {
    if (confirm('האם אתה בטוח שברצונך להתחיל מסמך חדש? השינויים הנוכחיים לא יישמרו.')) {
        editor.innerHTML = '<h1>מסמך חדש</h1><p>התחל לכתוב...</p>';
    }
});
$('#saveDoc').whenClick(() => {
    alert('המסמך נשמר מקומית בדפדפן (פונקציונליות LocalStorage דורשת הטמעה).');
});
$('#downloadHTML').whenClick(() => {
    const htmlContent = editor.outerHTML;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'המסמך_שלי.html';
    link.click();
    URL.revokeObjectURL(link.href);
    alert('המסמך הורד כקובץ HTML.');
});


// --- לוגיקה של תפריט "תצוגה" ---
$('#toggleToolbar').whenClick(() => {
    toolbar.style.display = toolbar.style.display === 'none' ? 'flex' : 'none';
});
$('#fullscreen').whenClick(() => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`שגיאה במעבר למסך מלא: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});
$('#toggleSidebar').whenClick(() => {
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
});


