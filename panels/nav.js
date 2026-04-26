const htmlNav = /* html */  `

<!--=======תפריט עריכה=========-->
<div class="dropdown-item" data-action="undo">בטל (Undo)</div>
<div class="dropdown-item" data-action="redo">חזור (Redo)</div>
<div class="dropdown-item" data-action="paste">הדבק</div>
<div class="dropdown-item" data-action="selectAll">בחר הכל</div>
<div class="dropdown-item" id="fullscreen">מצב מסך מלא</div>
`

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
    const cssText = Style.getCssText();

    // 2. שליפת ה-HTML של העורך
    const editorContent = $('canvas-scroller').innerHTML;
    editorContent.replace('contenteditable="true"', 'contenteditable="false"');

    // 3. יצירת מבנה של דף אינטרנט מלא
    const fullDoc = `
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
    <meta charset="UTF-8">
            <title>האתר שלי</title>
            <style id='styles'>             
                ${cssText}
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


// // --- לוגיקה של תפריט "תצוגה" ---
// $('fullscreen').whenClick(() => {
//     if (!document.fullscreenElement) {
//         document.documentElement.requestFullscreen().catch(err => {
//             alert(`שגיאה במעבר למסך מלא: ${err.message}`);
//         });
//     } else {
//         document.exitFullscreen();
//     }
// });




/*=====================*/

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!restartPage()) return;

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
    const base = newContent.$('דף_הבסיס'); // טיפול במצב שיש id שהמערכת משתמשת בו.
    //  צריך לטפל גם בשאר ה-id's אבל כרגע רק זה קריטי כי כשמורידים את האתר המוכן, זה הבסיס שלו.
    if (base) {
        if (newContent.children.length === 1 && newContent.children[0] === base)
            newContent = base;
        else
            base.id = 'דף_הבסיס(1)'
    }
    const newStyles = doc.querySelectorAll('style');

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

    // המעבר על תגיות ה-style שנמצאו בקובץ
    // newStyles.forEach(st => importCSSRulesFromText(st.textContent));
    newStyles.forEach(st => $('styles').innerHTML += st.innerHTML);
    Style.refreshSheet(); // רענון הרפרנס כך שיקלוט גם את הסטיילים החדשים

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
        const selector = '#' + id;
        /** @type {CSSStyleRule} */
        const rule = Style.ensureRule(selector);

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


/**
 * פונקציה שמקבלת טקסט של CSS, מפרקת אותו לחוקים,
 * ומכניסה אותם למערכת ה-Style.
 */
function importCSSRulesFromText(cssText) {
    // טריק: יצירת אלמנט style זמני כדי שהדפדפן יפרסר את ה-CSS עבורנו
    const iframe = document.createElement('iframe');
    iframe.addClass('hide');
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    const style = doc.createElement('style');
    style.textContent = cssText;
    doc.head.appendChild(style);

    // עכשיו יש לנו גישה ל-rules המפורסרים
    const rules = doc.styleSheets[0].cssRules;

    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];

        // אנחנו מטפלים כרגע רק בחוקי סגנון רגילים (type 1)
        if (rule.type === 1) { // CSSStyleRule
            const selector = rule.selectorText;

            // יצירת החוק
            const newSystemRule = Style.ensureRule(selector);
            newSystemRule.cssText = rule.cssText

        }
    }

    // ניקוי
    document.body.removeChild(iframe);
}