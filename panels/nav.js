const htmlNav = /* html */  `

<!--=======תפריט קובץ=========-->
<div class="nav-item" id="file-nav">
    <button class="nav-button">קובץ</button>
    <div class="dropdown-menu">
        <div class="dropdown-item" id="newDoc">מסמך חדש</div>
        <div class="dropdown-item" id="upload">העלאת קובץ</div>
        <input type="file" id="fileUploadInput" style="display: none;" accept=".html,.htm">
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
        <div class="dropdown-item" data-panel="design">צבעים וגופנים</div>
        <div class="dropdown-item" data-panel="borders">גבולות ורווחים(Borders)</div>
        <div class="dropdown-item" data-panel="position">גודל ומיקום</div>
        <div class="dropdown-item" data-panel="view">תצוגה</div>
        <div class="dropdown-item" data-panel="layout">פריסה</div>
    </div>
</div>`

nav.innerHTML = htmlNav;
const navItems = $$('.nav-item');


function closeOpenedNav() {
    if (openedMenu) {
        openedMenu.removeClass('active');
        openedMenu = null;
    }
};


navItems.forEach(item => {
    const button = item.$1('.nav-button');
    button.whenClick((event) => {
        const opened = item === openedMenu;
        closeOpenedNav()
        if (!opened) {
            item.addClass('active');
            openedMenu = item;
        }
        event.stopPropagation();
    });
});

// --- לוגיקה של תפריט "עריכה" ---
$('edit-menu-items').whenClick((e) => {
    const action = e.target.dataset.action;
    if (action) {
        applyEditorCommand(action);
    }
});

// --- לוגיקה של תפריט "אלמנטים" ---
$('elements-menu-items').whenClick((e) => {
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
$('newDoc').whenClick(() => {
    restartPage()
});
$('saveDoc').whenClick(() => {
    alert('המסמך נשמר מקומית בדפדפן (פונקציונליות LocalStorage דורשת הטמעה).');
});

$('upload').whenClick(() => $('fileUploadInput').click());

$('fileUploadInput').when('change', handleFileUpload);

$('downloadHTML').whenClick(() => {
    // 1. שליפת ה-CSS הנוכחי שהעורך יצר
    const currentStyles = sheet.innerHTML;

    // 2. שליפת ה-HTML של העורך
    const editorContent = $('editor-downloader').outerHTML;

    // 3. יצירת מבנה של דף אינטרנט מלא
    const fullDoc = `
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
    <meta charset="UTF-8">
            <title>האתר שלי</title>
            <style>
                /* CSS בסיסי לאיפוס */
                body { margin: 0; font-family: sans-serif; }
                
                /* ה-CSS שהמשתמש יצר בעורך */
                ${currentStyles}
            </style>
            </head>
            <body>
            ${editorContent}
            </body>
            </html>`;

    // 4. יצירת ההורדה
    const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'website.html';
    link.click();

    // שחרור זיכרון
    URL.revokeObjectURL(link.href);
    alert('המסמך הורד כקובץ HTML.');
});


// --- לוגיקה של תפריט "תצוגה" ---
$('toggleToolbar').whenClick(() => {
    toolbar.style.display = toolbar.style.display === 'none' ? 'flex' : 'none';
});
$('fullscreen').whenClick(() => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`שגיאה במעבר למסך מלא: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});
$('toggleSidebar').whenClick(() => {
    sidebar.style.display = sidebar.style.display === 'none' ? 'block' : 'none';
});



/*=====================*/

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        processImportedHTML(content);
    };
    reader.readAsText(file);

    // איפוס האינפוט כדי שאפשר יהיה להעלות את אותו קובץ שוב
    event.target.value = '';
}

function processImportedHTML(htmlString) {
    // 1. המרה של הטקסט ל-DOM אמיתי בזיכרון (לא במסך עדיין)
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const newContent = doc.body;
    const newStyles = doc.$1('style');
    // 2. איפוס המערכת הקיימת
    if (!restartPage()) return;
    // 3. המרת ה-DOM החדש: מעבר מ-Inline ל-Internal
    // אנחנו עוברים על הילדים של התוכן החדש ומעבדים אותם
    Array.from(newContent.children).forEach(child => {
        // שכפול האלמנט כדי לא להרוס את ה-doc המקורי
        const importedNode = child.cloneNode(true);
        $('דף_הבסיס').appendChild(importedNode);

        // פונקציה רקורסיבית שעוברת על האלמנט וכל ילדיו
        convertInlineToInternalRecursively(importedNode);
    });

    Array.from(newStyles).forEach(st => createRefRule(st));

    // 4. סיום: רענון העץ והמאזינים
    renderTree();
    updateSelectedElement($('דף_הבסיס')); // חזרה לבסיס
    alert('הקובץ נטען והומר בהצלחה!');
}

/**
 * הפונקציה הקסומה: לוקחת אלמנט, קוראת את ה-style שלו,
 * יוצרת חוק CSS במערכת, ומוחקת את ה-style מהאלמנט.
 */
function convertInlineToInternalRecursively(element) {
    // א. וידוא שיש ID (חובה בשביל המערכת שלך)
    const id = ensureElementId(element);

    // ב. אם יש לאלמנט עיצוב אינליין
    if (element.getAttribute('style')) {

        // יצירת הסלקטור (הנחה: אין state כמו hover בהעלאה רגילה)
        const selector = '#' + id;
        const rule = createRuleAndRef(selector);

        // מעבר על כל התכונות ב-style
        for (let i = 0; i < element.style.length; i++) {
            const prop = element.style[i]; // למשל 'color'
            const value = element.style.getPropertyValue(prop); // למשל 'red'

            // המרה לקאמל-קייס (background-color -> backgroundColor) כי המערכת שלך עובדת ככה
            const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

            rule.style[camelProp] = value;
        }

        // ג. ניקוי הסטייל האינליין (כדי שלא יתנגש ושיהיה "נקי")
        element.removeAttribute('style');
    }

    // ד. רקורסיה לילדים
    if (element.children.length > 0) {
        Array.from(element.children).forEach(child => {
            convertInlineToInternalRecursively(child);
        });
    }
}
