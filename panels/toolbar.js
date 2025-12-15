const htmlToolbar =  /* html */ `
<button data-action="bold" title="מודגש"><b>B</b></button>
<button data-action="italic" title="נטוי"><i>I</i></button>
<button data-action="underline" title="קו תחתון"><u>U</u></button>
<button data-action="justifyRight" title="יישור לימין">➡</button>
<button data-action="justifyCenter" title="יישור למרכז">↔</button>
<button data-action="justifyLeft" title="יישור לשמאל">⬅</button>
<button data-action="insertUnorderedList" title="רשימה עם תבליטים">⚫</button>
<button data-action="insertOrderedList" title="רשימה ממוספרת">🔢</button>
<select id="formatBlock">
    <option value="p">טקסט רגיל</option>
    <option value="h1">כותרת 1</option>
    <option value="h2">כותרת 2</option>
    <option value="h3">כותרת 3</option>
    <option value="pre">קוד/טקסט קבוע</option>
</select>`

toolbar.innerHTML = htmlToolbar;

toolbar.whenClick((e) => {
    const button = e.upTo('button');
    if (!button) return;
    const action = button.dataset.action;
    if (!action) return;

    editor.focus();

    // שימוש בפקודה המובנית שיודעת לטפל ב-Toggle (הוספה/הסרה)
    applyEditorCommand(action);

    // עדכון מיידי של מצב הכפתורים לאחר הלחיצה
    updateToolbarButtonStates();
});

// --- לוגיקה של סרגל הכלים (Toolbar) ---

$('formatBlock').when('change', (e) => {
    changeBlockTag(e.target.value);
});

/**
 * פונקציה חדשה שבודקת את מצב העורך ומדגישה/מבטלת הדגשה
 * של כפתורי סרגל הכלים.
 */
function updateToolbarButtonStates() {
    // רשימת הפקודות שברצוננו לבדוק
    const commands = [
        'bold',
        'italic',
        'underline',
        'justifyRight',
        'justifyCenter',
        'justifyLeft',
        'insertUnorderedList',
        'insertOrderedList'
    ];

    commands.forEach(command => {
        const button = $1(`#toolbar button[data-action="${command}"]`);
        if (button) {
            try {
                // document.queryCommandState בודק אם הפקודה פעילה כרגע במיקום הסמן
                const isActive = document.queryCommandState(command);
                button.toggleClass('active', isActive);
            } catch (error) {
                console.error(`Error querying state for command: ${command}`, error);
            }
        }
    });

    // טיפול מיוחד ב-formatBlock (רשימת ה-select)
    const formatSelect = $('formatBlock');
    if (formatSelect) {
        // queryCommandValue מחזיר את סוג הבלוק הנוכחי (למשל 'h1', 'p')
        let blockTag = document.queryCommandValue('formatBlock').toLowerCase();
        if (blockTag === 'div' || blockTag === '') blockTag = 'p'; // Normalization
        formatSelect.value = blockTag;
    }
}