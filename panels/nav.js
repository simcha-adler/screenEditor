//@ts-check

const htmlNav = /* html */  `

<!--=======תפריט עריכה=========-->
<div class="dropdown-item" data-action="undo">בטל (Undo)</div>
<div class="dropdown-item" data-action="redo">חזור (Redo)</div>
<div class="dropdown-item" data-action="paste">הדבק</div>
<div class="dropdown-item" data-action="selectAll">בחר הכל</div>
<div class="dropdown-item" id="fullscreen">מצב מסך מלא</div>
`

function initHamburgerListeners() {
    // --- לוגיקה של תפריט "קובץ" ---
    $('newDoc').whenClick(restartPage);

    $('saveDoc').whenClick(saveDocInLocalStorage);

    $('upload').whenClick(() => $('fileUploadInput').click());

    $('fileUploadInput').when('change', handleFileUpload);

    $('downloadHTML').whenClick(() => {
        // 3. יצירת מבנה של דף אינטרנט מלא
        const fullDoc = convertToHTMLPage();

        // 4. יצירת ההורדה
        const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'website.html';
        link.click();

        // שחרור זיכרון
        URL.revokeObjectURL(link.href);
        alert('הדף הורד כקובץ HTML.');
    });


    // --- לוגיקה של תפריט "תצוגה" ---
    $('fullscreen').whenClick(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                alert(`שגיאה במעבר למסך מלא: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
}



/*=====================*/




function saveDocInLocalStorage() {
    localStorage.setItem('screenEditor_page', convertToHTMLPage());
}


function convertToHTMLPage() {
    return `
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>האתר שלי</title>
        <style id='user_styles'>             
            ${Style.getCssText()}
        </style>
    </head>
    <body>
        ${editor.outerHTML.replaceAll('contenteditable="true"', '')}
    </body>
    </html>`;
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file || !restartPage()) return;

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
    let newContent = doc.body;
    let hasProblemId = false; // האם יש אלמנט עם מזהה "דף_הבסיס" שאינו עוטף הכל
    const base = newContent.$('דף_הבסיס'); // טיפול במצב שיש id שהמערכת משתמשת בו.
    if (base) {
        if (newContent.children.length === 1 && newContent.children[0] === base)
            newContent = base;
        else
            hasProblemId = true;
    }
    const newStyles = doc.querySelectorAll('style');

    // המעבר על תגיות ה-style שנמצאו בקובץ. 
    // מתבצע לפני המרת האינליין כדי שלא יווצרו 2 חוקים באותו סלקטור וגם האינליין יהיה יותר חלש
    const cssText = Array.from(newStyles).map(st => st.innerHTML).join(' ');
    Style.insertIntoTag(cssText);

    // 3. המרת ה-DOM החדש: מעבר מ-Inline ל-Internal
    // אנחנו עוברים על הילדים של התוכן החדש ומעבדים אותם
    Array.from(newContent.children).forEach(child => {
        if (child.tagName !== 'STYLE' && child.tagName !== 'SCRIPT') {
            // שכפול האלמנט כדי לא להרוס את ה-doc המקורי
            const importedNode = child.cloneNode(true);
            editor.appendChild(importedNode);

            // פונקציה רקורסיבית שעוברת על האלמנט וכל ילדיו
            convertInlineToInternalRecursively(importedNode);
        }
    });
    if (hasProblemId) editor.$('דף_הבסיס').id = 'דף_הבסיס(1)';

    // 4. סיום: רענון העץ והמאזינים
    tree.build.tree();
    Edit.elementSelected(editor); // חזרה לבסיס
    console.log('הקובץ נטען והומר בהצלחה!');
}

/**
 * הפונקציה לוקחת אלמנט, קוראת את ה-style שלו,
 * יוצרת חוק CSS במערכת, ומוחקת את ה-style מהאלמנט.
 * @param {HTMLElement} element 
 */
function convertInlineToInternalRecursively(element) {
    // א. וידוא שיש ID
    const id = ensureElementId(element);

    // ב. אם יש לאלמנט עיצוב אינליין
    if (element.getAttribute('style')) {

        // יצירת הסלקטור
        /** @type {CSSStyleRule} */
        const rule = Style.ensureRule('#' + id);

        // מעבר על כל התכונות ב-style
        for (let i = 0; i < element.style.length; i++) {
            const prop = element.style[i]; // למשל 'color'
            const value = element.style.getPropertyValue(prop); // למשל 'red'

            // המרה לקאמל-קייס (background-color -> backgroundColor) כי המערכת שלך עובדת ככה
            const camelProp = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

            rule.style[camelProp] = value;
        }

        // ג. ניקוי הסטייל האינליין
        element.removeAttribute('style');
    }

    // ד. רקורסיה לילדים
    if (element.children.length > 0) {
        Array.from(element.children).forEach(child => {
            convertInlineToInternalRecursively(child);
        });
    }
}
