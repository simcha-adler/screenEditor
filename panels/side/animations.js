animationsSchema = [
    { type: 'title', label: 'אנימציות ותנועה' },

    // ---  בחירת האנימציה  --- 
    {
        type: 'section', label: 'הגדרת האנימציה', collapsed: false,
        children: [
            {
                type: 'inputRow', label: 'סוג',
                inputType: 'select', prop: 'animationName',
                options: [
                    { value: 'none', text: 'ללא' },
                    { value: 'fadeIn', text: 'הופעה' },
                    { value: 'fadeInUp', text: 'הופעה מלמטה' },
                    { value: 'fadeInDown', text: 'הופעה מלמעלה' },
                    { value: 'fadeInLeft', text: 'הופעה משמאל' },
                    { value: 'fadeInRight', text: 'הופעה מימין' },
                    { value: 'zoomIn', text: 'זום פנימה' },
                    { value: 'zoomOut', text: 'זום החוצה' },
                    { value: 'bounce', text: 'קפיצה' },
                    { value: 'pulse', text: 'פעימה' },
                    { value: 'shake', text: 'רעידה' },
                    { value: 'rotateIn', text: 'סיבוב וכניסה' },
                    { value: 'flipInX', text: 'היפוך אנכי' }
                ]
            }
        ]
    },

    // --- תזמון --- 
    {
        type: 'section', label: 'תזמון', collapsed: false,
        children: [
            {
                type: 'inputRow', label: 'משך האנימציה בשניות', id: 'animationDuration',
                inputType: 'number', prop: 'animationDuration', unit: 's',
                step: 0.1, min: 0
            },
            {
                type: 'inputRow', label: 'השהייה',
                inputType: 'number', prop: 'animationDelay', unit: 's',
                step: 0.1, min: 0
            },
            {
                type: 'inputRow', label: 'קצב האנימציה',
                inputType: 'select', prop: 'animationTimingFunction',
                options: [
                    { value: 'ease', text: 'רגיל' },
                    { value: 'linear', text: 'לינארי' },
                    { value: 'ease-in', text: 'האצה' },
                    { value: 'ease-out', text: 'האטה' },
                    { value: 'ease-in-out', text: 'האצה והאטה' },
                    { value: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', text: 'קפיצי' }
                ]
            }
        ]
    },

    // --- הגדרות מתקדמות --- 
    {
        type: 'section', label: 'מתקדם', collapsed: true,
        children: [
            {
                type: 'inputRow', label: 'חזרה',
                inputType: 'select', prop: 'animationIterationCount',
                options: [
                    { value: '1', text: 'פעם אחת' },
                    { value: '2', text: 'פעמיים' },
                    { value: '3', text: '3 פעמים' },
                    { value: 'infinite', text: 'אינסופי' }
                ]
            },
            {
                type: 'inputRow', label: 'מצב סיום',
                inputType: 'select', prop: 'animationFillMode',
                options: [
                    { value: 'both', text: 'שמור מצב סופי' },
                    { value: 'forwards', text: 'נתקע בסוף' },
                    { value: 'backwards', text: 'חזור להתחלה' },
                    { value: 'none', text: 'ללא' }
                ]
            }
        ]
    }
];

// שינוי קצב האנימציה אוטומטית אם אין קצב, כדי שהאנימציה תופעל
$('panel-animations').when('input', (e) => {
    if ($('animationDuration').value === '0' && e.target.id !== 'animationDuration') {
        $('animationDuration').value = '1';
        updateStyle('#' + theElement.id + $('dropdown-states').value, 'animationDuration', '1s');
    }
});
