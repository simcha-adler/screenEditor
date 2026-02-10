
const designSchema = [
    { type: 'title', label: 'עיצוב טקסט וצבע' },

    {
        type: 'section', label: 'טיפוגרפיה', collapsed: false,
        children: [
            {
                type: 'inputRow', label: 'גופן',
                inputType: 'select', prop: 'fontFamily',
                options: [
                    { value: 'Arial, sans-serif', text: 'Arial' },
                    { value: 'Verdana, sans-serif', text: 'Verdana' },
                    { value: '"Times New Roman", serif', text: 'Times New Roman' },
                    { value: '"Courier New", monospace', text: 'Courier New' },
                    { value: 'system-ui, -apple-system, sans-serif', text: 'System UI' },
                    { value: 'inherit', text: 'מורש (Inherit)' }
                ]
            },

            {
                type: 'inputRow', inputType: 'number', label: 'גודל', prop: 'fontSize', unit: 'px',
            },
            {
                type: 'inputRow', inputType: 'select', label: 'משקל', prop: 'fontWeight',
                options: [
                    { value: '400', text: 'רגיל' },
                    { value: '700', text: 'מודגש' },
                    { value: '300', text: 'דק' },
                    { value: '900', text: 'כבד' }
                ],
            },
            {
                type: 'inputRow', label: 'יישור טקסט',
                inputType: 'select', prop: 'textAlign',
                options: [
                    { value: 'start', text: 'התחלה' },
                    { value: 'center', text: 'מרכז' },
                    { value: 'end', text: 'סוף' },
                    { value: 'justify', text: 'יישור מלא' }
                ]
            }
        ]
    },

    {
        type: 'section', label: 'צבעים ורקע', collapsed: false,
        children: [
            {
                type: 'inputRow', label: 'צבע טקסט',
                inputType: 'color', prop: 'color',
            },
            {
                type: 'inputRow', label: 'צבע רקע',
                inputType: 'color', prop: 'backgroundColor',
            }
        ]
    }
];


function toggleGradient() {
    const hide = $('gradientDiv').style.display === 'none';
    $('gradientDiv').style.display = hide ? 'block' : 'none';
}

// להוסיף את יחידות הגרדיאנט בסכמה, ולצרף את המאזין לשם.
function loadDesignListeners() {
    $('gradientBtn').whenClick(toggleGradient);
}

function buildDesignPanel() {
    const inputs = $$('.color-picker-wrapper')
    // שליחת הסלקטור הנוכחי
    const selector = getActiveSelectorKey(); // (פונקציית עזר שקיימת ב-borders.js וצריך להנגיש אותה)


    inputs.forEach(container => {
        const picker = createColorPicker(selector, 'color');
        container = container.parentNode;
        container.children[1].remove();
        container.appendChild(picker);
    });
}
