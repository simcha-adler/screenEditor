
const viewSchema = [
    { type: 'title', label: 'תצוגה ואפקטים' },

    {
        type: 'inputRow', label: 'סוג תצוגה',
        inputType: 'select', prop: 'display',
        options: [
            { value: 'block', text: 'בלוק' },
            { value: 'inline', text: 'בתוך השורה' },
            { value: 'inline-block', text: 'בלוק בשורה' },
            { value: 'flex', text: 'פלקס' },
            { value: 'grid', text: 'גריד' },
            { value: 'none', text: 'מוסתר' }
        ]
    },

    { type: 'smallTitle', label: 'גלישת תוכן' },

    {
        type: 'grid',
        children: [
            {
                type: 'input', inputType: 'select', label: 'אופקי', prop: 'overflowX',
                options: [
                    { value: 'visible', text: 'רגיל' },
                    { value: 'hidden', text: 'חתוך' },
                    { value: 'scroll', text: 'גלילה' },
                    { value: 'auto', text: 'אוטומטי' }
                ]
            },
            {
                type: 'input', inputType: 'select', label: 'אנכי', prop: 'overflowY',
                options: [
                    { value: 'visible', text: 'רגיל' },
                    { value: 'hidden', text: 'חתוך' },
                    { value: 'scroll', text: 'גלילה' },
                    { value: 'auto', text: 'אוטומטי' }
                ]
            }
        ]
    },

    { type: 'title', label: 'נראות ועכבר' },

    {
        type: 'inputRow', label: 'נראות',
        inputType: 'toggle', prop: 'visibility',
        v: 'visible', x: 'hidden'
    },

    {
        type: 'inputRow', label: 'אטימות',
        inputType: 'range', prop: 'opacity',
        min: 0, max: 1, step: 0.01
    },

    {
        type: 'inputRow', label: 'סמן עכבר',
        inputType: 'select', prop: 'cursor',
        options: [
            { value: 'auto', text: 'אוטומטי' },
            { value: 'pointer', text: 'אצבע' },
            { value: 'text', text: 'טקסט' },
            { value: 'not-allowed', text: 'חסום' },
            { value: 'grab', text: 'תפיסה' },
            { value: 'crosshair', text: 'כוונת' }
        ]
    }
];

