const bordersSchema = [
    { type: 'title', label: 'גבולות וריווח' },

    // --- Section: Border (מסגרת) ---
    {
        type: 'section', label: 'מסגרת', collapsed: true,
        children: [
            {
                type: 'inputRow', label: 'סגנון',
                inputType: 'select', prop: 'borderStyle',
                options: [
                    { value: 'none', text: 'ללא' },
                    { value: 'solid', text: 'רציף' },
                    { value: 'dashed', text: 'מקווקו' },
                    { value: 'dotted', text: 'מנוקד' },
                    { value: 'double', text: 'כפול' }
                ]
            },
            { type: 'input', label: 'צבע', inputType: 'color', prop: 'borderColor' },
            { type: 'inputRow', label: 'עובי', inputType: 'number', prop: 'borderWidth', unit: 'px' }
        ]
    },

    // --- Section: Radius (פינות) ---
    {
        type: 'section', label: 'פינות עגולות', collapsed: true,
        children: [
            {
                type: 'switcher',
                options: [
                    { label: '▢', value: '1', class: 'show' }, // הכל
                    { label: '⛶', value: '2' } // נפרד
                ]
            },
            // מצב 1: הכל ביחד
            {
                type: 'inputRow', class: 'switch-body g1',
                label: 'כל הפינות',
                inputType: 'number', prop: 'borderRadius', unit: 'px'
            },
            // מצב 2: נפרד
            {
                type: 'grid', class: 'switch-body g2',
                children: [
                    { type: 'input', inputType: 'number', label: '↖', prop: 'borderTopLeftRadius', unit: 'px' },
                    { type: 'input', inputType: 'number', label: '↗', prop: 'borderTopRightRadius', unit: 'px' },
                    { type: 'input', inputType: 'number', label: '↘', prop: 'borderBottomRightRadius', unit: 'px' },
                    { type: 'input', inputType: 'number', label: '↙', prop: 'borderBottomLeftRadius', unit: 'px' }
                ]
            }
        ]
    },

    // --- Section: Padding (ריווח פנימי) ---
    {
        type: 'section', label: 'ריווח פנימי (Padding)', collapsed: true,
        children: [
            {
                type: 'switcher',
                options: [
                    { label: '▢', value: '1', class: 'show' },
                    { label: '║═', value: '2' },
                    { label: '⛶', value: '3' }
                ]
            },
            // מצב 1: הכל
            {
                type: 'inputRow', class: 'switch-body g1',
                label: 'כל הצדדים',
                inputType: 'number', prop: 'padding', unit: 'px'
            },
            // מצב 2: צירים
            {
                type: 'grid', class: 'switch-body g2',
                children: [
                    { type: 'input', inputType: 'number', label: 'אנכי (↕)', prop: 'paddingBlock', unit: 'px' },
                    { type: 'input', inputType: 'number', label: 'אופקי (↔)', prop: 'paddingInline', unit: 'px' }
                ]
            },
            // מצב 3: נפרד
            {
                type: 'grid', class: 'switch-body g3',
                children: [
                    { type: 'input', inputType: 'number', label: 'Top', prop: 'paddingTop', unit: 'px' },
                    { type: 'input', inputType: 'number', label: 'Right', prop: 'paddingRight', unit: 'px' },
                    { type: 'input', inputType: 'number', label: 'Bottom', prop: 'paddingBottom', unit: 'px' },
                    { type: 'input', inputType: 'number', label: 'Left', prop: 'paddingLeft', unit: 'px' }
                ]
            }
        ]
    },

    // --- Section: Margin (ריווח חיצוני) ---
    {
        type: 'section', label: 'ריווח חיצוני (Margin)', collapsed: true,
        children: [
            {
                type: 'switcher',
                options: [
                    { label: '▢', value: '1', class: 'show' },
                    { label: '║═', value: '2' },
                    { label: '⛶', value: '3' }
                ]
            },
            // מצב 1: הכל
            {
                type: 'inputRow', class: 'switch-body g1',
                label: 'כל הצדדים', inputType: 'number', prop: 'margin', unit: 'px'
            },
            // מצב 2: צירים
            {
                type: 'grid', class: 'switch-body g2',
                children: [
                    { type: 'input', inputType: 'number', label: 'אנכי (↕)', prop: 'marginBlock', unit: 'px' },
                    { type: 'input', inputType: 'number', label: 'אופקי (↔)', prop: 'marginInline', unit: 'px' }
                ]
            },
            // מצב 3: נפרד
            {
                type: 'grid', class: 'switch-body g3',
                children: [
                    { type: 'input', inputType: 'number', label: 'Top', prop: 'marginTop', unit: 'px' },
                    { type: 'input', inputType: 'number', label: 'Right', prop: 'marginRight', unit: 'px' },
                    { type: 'input', inputType: 'number', label: 'Bottom', prop: 'marginBottom', unit: 'px' },
                    { type: 'input', inputType: 'number', label: 'Left', prop: 'marginLeft', unit: 'px' }
                ]
            }
        ]
    },

    {
        type: 'section', label: 'הצללה ועומק', collapsed: true, id: 'shadow', prop: 'boxShadow',
        children: [
            {
                type: 'grid',
                children: [
                    { type: 'input', inputType: 'number', label: 'הזזה לימין', prop: 'boxShadowX', unit: 'px', default: 0 },
                    { type: 'input', inputType: 'number', label: 'הזזה למטה', prop: 'boxShadowY', unit: 'px', default: 4 }
                ]
            },
            {
                type: 'grid',
                children: [
                    { type: 'input', inputType: 'number', label: 'טשטוש', prop: 'boxShadowBlur', unit: 'px', default: 10 },
                    { type: 'input', inputType: 'number', label: 'גודל', prop: 'boxShadowSpread', unit: 'px', default: 0 }
                ]
            },
            { type: 'input', inputType: 'color', label: 'צבע הצל', prop: 'boxShadowColor' },
            {
                type: 'inputRow', label: 'סוג', inputType: 'select', prop: 'boxShadowInset',
                options: [
                    { value: ' ', text: 'חיצוני (רגיל)' },
                    { value: 'inset', text: 'פנימי' }
                ]
            }
        ]
    }
];

