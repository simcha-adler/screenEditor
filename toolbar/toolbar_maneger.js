const htmlToolbar = `<button data-action="bold" title="מודגש"><b>B</b></button>
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
//alert(toolbar);

toolbar.whenClick((e) => {
    const button = e.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    if (!action) return;
    editor.focus();

    switch (action) {
        case 'bold':
            wrapSelection('b', 'fontWeight', 'bold');
            break;
        case 'italic':
            wrapSelection('i', 'fontStyle', 'italic');
            break;
        case 'underline':
            wrapSelection('u', 'textDecoration', 'underline');
            break;

        case 'justifyRight':
        case 'justifyCenter':
        case 'justifyLeft':
            // עדיין משתמש ב-execCommand. נוכל לשדרג את זה בהמשך.
            applyEditorCommand(action);
            updateSelectedElement(getSelectedElement());
            break;

        case 'insertUnorderedList':
        case 'insertOrderedList':
            applyEditorCommand(action);
            break;
    }
});

// --- לוגיקה של סרגל הכלים (Toolbar) ---

$('#formatBlock').when('change', (e) => {
    changeBlockTag(e.target.value);
});
