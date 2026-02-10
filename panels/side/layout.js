
const layoutSchema = [
    { type: 'title', label: 'פריסת פלקס (Flexbox)' },

    {
        type: 'inputRow', label: 'כיוון',
        inputType: 'select', prop: 'flexDirection',
        options: [
            { value: 'row', text: 'שורה ←' },
            { value: 'column', text: 'טור ↓' },
            { value: 'row-reverse', text: 'שורה הפוכה →' },
            { value: 'column-reverse', text: 'טור הפוך ↑' }
        ]
    },
    {
        type: 'inputRow', label: 'ירידת שורה',
        inputType: 'toggle', prop: 'flexWrap', v: 'wrap', x: 'nowrap'
    },

    { type: 'smallTitle', label: 'מרווח בין פריטים' },

    { type: 'inputRow', inputType: 'number', label: 'רווח בין שורות', prop: 'rowGap', unit: 'px' },
    { type: 'inputRow', inputType: 'number', label: 'רווח בין עמודות', prop: 'columnGap', unit: 'px' },

    { type: 'title', label: 'יישור' },
    {
        type: 'inputRow', label: 'ציר ראשי',
        inputType: 'select', prop: 'justifyContent',
        options: [
            { value: 'flex-start', text: 'התחלה' },
            { value: 'center', text: 'מרכז' },
            { value: 'flex-end', text: 'סוף' },
            { value: 'space-between', text: 'רווח בין' },
            { value: 'space-around', text: 'רווח מסביב' }
        ]
    },
    {
        type: 'inputRow', label: 'ציר משני',
        inputType: 'select', prop: 'alignItems',
        options: [
            { value: 'flex-start', text: 'התחלה' },
            { value: 'center', text: 'מרכז' },
            { value: 'stretch', text: 'מתיחה' },
            { value: 'baseline', text: 'קו בסיס' }
        ]
    },
    {
        type: 'inputRow', label: 'יישור תוכן',
        inputType: 'select', prop: 'alignContent',
        options: [
            { value: 'flex-start', text: 'התחלה' },
            { value: 'center', text: 'מרכז' },
            { value: 'stretch', text: 'מתיחה' },
            { value: 'space-between', text: 'רווח בין' }
        ]
    }
];

