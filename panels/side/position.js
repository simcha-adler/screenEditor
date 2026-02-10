// מערך יחידות לשימוש חוזר
const unitsOptions = [
    { value: 'px', text: 'px' },
    { value: '%', text: '%' },
    { value: 'vw', text: 'vw' },
    { value: 'vh', text: 'vh' },
    { value: 'auto', text: 'auto' }
];

const positionSchema = [
    { type: 'title', label: 'מיקום (Position)' },

    {
        type: 'inputRow', label: 'שיטה',
        inputType: 'select', prop: 'position',
        options: [
            { value: 'static', text: 'אוטומטי (Static)' },
            { value: 'relative', text: 'יחסי (Relative)' },
            { value: 'absolute', text: 'מוחלט (Absolute)' },
            { value: 'fixed', text: 'קבוע (Fixed)' },
            { value: 'sticky', text: 'דביק (Sticky)' }
        ]
    },
    { type: 'inputRow', label: 'שכבה (Z-Index)', inputType: 'number', prop: 'zIndex' },

    { type: 'smallTitle', label: 'היסט (Offsets)' },
    {
        type: 'grid',
        children: [
            { type: 'input', inputType: 'number', label: 'Top', prop: 'top', unit: 'px' },
            { type: 'input', inputType: 'number', label: 'Right', prop: 'right', unit: 'px' },
            { type: 'input', inputType: 'number', label: 'Bottom', prop: 'bottom', unit: 'px' },
            { type: 'input', inputType: 'number', label: 'Left', prop: 'left', unit: 'px' }
        ]
    },

    { type: 'title', label: 'גודל (Size)' },
    {
        type: 'grid',
        children: [
            // שימוש ב-options מפעיל את ה-combinated input בבנאי
            { type: 'input', inputType: 'number', label: 'רוחב', prop: 'width', options: unitsOptions },
            { type: 'input', inputType: 'number', label: 'גובה', prop: 'height', options: unitsOptions }
        ]
    },

    {
        type: 'section', label: 'הגבלות גודל', collapsed: true,
        children: [
            {
                type: 'grid',
                children: [
                    { type: 'input', inputType: 'number', label: 'Min W', prop: 'minWidth', unit: 'px', options: unitsOptions },
                    { type: 'input', inputType: 'number', label: 'Max W', prop: 'maxWidth', unit: 'px', options: unitsOptions },
                    { type: 'input', inputType: 'number', label: 'Min H', prop: 'minHeight', unit: 'px', options: unitsOptions },
                    { type: 'input', inputType: 'number', label: 'Max H', prop: 'maxHeight', unit: 'px', options: unitsOptions }
                ]
            }
        ]
    }
];



