// @ts-check

import { UI } from "../components/base.js";

export const animationsSchema = [
    new UI.title({ label: 'אנימציות ותנועה' }),

    // ---  בחירת האנימציה  --- 
    new UI.section({
        label: 'הגדרת האנימציה', collapsed: false,
        children: [
            new UI.inputRow({
                label: 'סוג',
                input: new UI.input.select({
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
                    ],
                    prop: 'animationName'
                })
            })
        ]
    }),
    // --- תזמון --- 
    new UI.section({
        label: 'תזמון', collapsed: false,
        children: [
            new UI.inputRow({
                label: 'משך האנימציה בשניות',
                input: new UI.input.number({ prop: 'animationDuration', unit: 's', step: 0.1, min: 0, details: { id: 'animationDuration' }, })
            }),
            new UI.inputRow({
                label: 'השהייה',
                input: new UI.input.number({ prop: 'animationDelay', unit: 's', step: 0.1, min: 0 })
            }),
            new UI.inputRow({
                label: 'קצב האנימציה',
                input: new UI.input.select({
                    prop: 'animationTimingFunction',
                    options: [
                        { value: 'ease', text: 'רגיל' },
                        { value: 'linear', text: 'לינארי' },
                        { value: 'ease-in', text: 'האצה' },
                        { value: 'ease-out', text: 'האטה' },
                        { value: 'ease-in-out', text: 'האצה והאטה' },
                        { value: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)', text: 'קפיצי' }
                    ]

                })
            })
        ]
    }),

    // --- הגדרות מתקדמות --- 
    new UI.section({
        label: 'מתקדם', collapsed: true,
        children: [
            new UI.inputRow({
                label: 'חזרה',
                input: new UI.input.select({
                    prop: 'animationIterationCount',
                    options: [
                        { value: '1', text: 'פעם אחת' },
                        { value: '2', text: 'פעמיים' },
                        { value: '3', text: '3 פעמים' },
                        { value: 'infinite', text: 'אינסופי' }
                    ]
                })
            }),
            new UI.inputRow({
                label: 'מצב סיום',
                input: new UI.input.select({
                    prop: 'animationFillMode',
                    options: [
                        { value: 'both', text: 'שמור מצב סופי' },
                        { value: 'forwards', text: 'נתקע בסוף' },
                        { value: 'backwards', text: 'חזור להתחלה' },
                        { value: 'none', text: 'ללא' }
                    ]
                })
            })
        ]
    })
];

