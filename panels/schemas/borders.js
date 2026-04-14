//@ts-check

import { UI } from "../components/base.js";

export const bordersSchema = [
    new UI.title({ label: 'גבולות וריווח' }),

    // --- Section: Border (מסגרת) ---
    new UI.section({
        label: 'מסגרת', collapsed: true,
        children: [
            new UI.inputRow({
                label: 'סגנון',
                input: new UI.input.select({
                    prop: 'borderStyle',
                    options: [
                        { value: 'none', text: 'ללא' },
                        { value: 'solid', text: 'רציף' },
                        { value: 'dashed', text: 'מקווקו' },
                        { value: 'dotted', text: 'מנוקד' },
                        { value: 'double', text: 'כפול' }
                    ]
                })
            }),
            new UI.inputRow({
                label: 'צבע',
                input: new UI.input.color({
                    prop: 'borderColor',
                    defaultValue: '#000000', hasGradient: false
                })
            }),
            new UI.inputRow({
                label: 'עובי',
                input: new UI.input.number({ unit: 'px', prop: 'borderWidth' })
            })
        ]
    }),

    // --- Section: Radius (פינות) ---
    new UI.section({
        label: 'פינות עגולות', collapsed: true,
        children: [
            new UI.switcher({
                options: [
                    { label: '▢', value: '1', class: 'show' },
                    { label: '⛶', value: '2' }
                ]
            }),
            new UI.inputRow({
                details: { class: 'switch-body g1' }, label: 'כל הפינות',
                input: new UI.input.number({ unit: 'px', prop: 'borderRadius' })
            }),
            new UI.grid({
                details: { class: 'switch-body g2' },
                children: [
                    new UI.wrapInput({ label: '↖', input: new UI.input.number({ prop: 'borderTopLeftRadius', unit: 'px' }) }),
                    new UI.wrapInput({ label: '↗', input: new UI.input.number({ prop: 'borderTopRightRadius', unit: 'px' }) }),
                    new UI.wrapInput({ label: '↘', input: new UI.input.number({ prop: 'borderBottomRightRadius', unit: 'px' }) }),
                    new UI.wrapInput({ label: '↙', input: new UI.input.number({ prop: 'borderBottomLeftRadius', unit: 'px' }) })
                ]
            })
        ]
    }),

    // --- Section: Padding (ריווח פנימי) ---
    new UI.section({
        label: 'ריווח פנימי (Padding)', collapsed: true,
        children: [
            new UI.switcher({
                options: [
                    { label: '▢', value: '1', class: 'show' },
                    { label: '║═', value: '2' },
                    { label: '⛶', value: '3' }
                ]
            }
            ),
            new UI.inputRow({ details: { class: 'switch-body g1' }, label: 'כל הצדדים', input: new UI.input.number({ prop: 'padding', unit: 'px' }) }),
            new UI.grid({
                details: { class: 'switch-body g2' },
                children: [
                    new UI.wrapInput({ label: 'אנכי (↕)', input: new UI.input.number({ prop: 'paddingBlock', unit: 'px' }) }),
                    new UI.wrapInput({ label: 'אופקי (↔)', input: new UI.input.number({ prop: 'paddingInline', unit: 'px' }) })
                ]
            }),
            new UI.grid({
                details: { class: 'switch-body g3' },
                children: [
                    new UI.wrapInput({ label: 'Top', input: new UI.input.number({ prop: 'paddingTop', unit: 'px' }) }),
                    new UI.wrapInput({ label: 'Right', input: new UI.input.number({ prop: 'paddingRight', unit: 'px' }) }),
                    new UI.wrapInput({ label: 'Bottom', input: new UI.input.number({ prop: 'paddingBottom', unit: 'px' }) }),
                    new UI.wrapInput({ label: 'Left', input: new UI.input.number({ prop: 'paddingLeft', unit: 'px' }) })
                ]
            })
        ]
    }),

    // --- Section: Margin (ריווח חיצוני) ---
    new UI.section({
        label: 'ריווח חיצוני (Margin)', collapsed: true,
        children: [
            new UI.switcher({
                options: [
                    { label: '▢', value: '1', class: 'show' },
                    { label: '║═', value: '2' },
                    { label: '⛶', value: '3' }
                ]
            }),
            new UI.inputRow({ details: { class: 'switch-body g1' }, label: 'כל הצדדים', input: new UI.input.number({ prop: 'margin', unit: 'px' }) }),
            new UI.grid({
                details: { class: 'switch-body g2' },
                children: [
                    new UI.wrapInput({ label: 'אנכי (↕)', input: new UI.input.number({ prop: 'marginBlock', unit: 'px' }) }),
                    new UI.wrapInput({ label: 'אופקי (↔)', input: new UI.input.number({ prop: 'marginInline', unit: 'px' }) })
                ]
            }),
            new UI.grid({
                details: { class: 'switch-body g3' },
                children: [
                    new UI.wrapInput({ label: 'Top', input: new UI.input.number({ prop: 'marginTop', unit: 'px' }) }),
                    new UI.wrapInput({ label: 'Right', input: new UI.input.number({ prop: 'marginRight', unit: 'px' }) }),
                    new UI.wrapInput({ label: 'Bottom', input: new UI.input.number({ prop: 'marginBottom', unit: 'px' }) }),
                    new UI.wrapInput({ label: 'Left', input: new UI.input.number({ prop: 'marginLeft', unit: 'px' }) })
                ]
            })
        ]
    }),

    new UI.section({
        label: 'הצללה ועומק', collapsed: true, details: { id: 'shadow' }, prop: 'boxShadow',
        children: [
            new UI.grid({
                children: [
                    new UI.wrapInput({ label: 'הזזה לימין', input: new UI.input.number({ prop: 'boxShadowX', unit: 'px', defaultValue: 0 }) }),
                    new UI.wrapInput({ label: 'הזזה למטה', input: new UI.input.number({ prop: 'boxShadowY', unit: 'px', defaultValue: 4 }) })
                ]
            }),
            new UI.grid({
                children: [
                    new UI.wrapInput({ label: 'טשטוש', input: new UI.input.number({ prop: 'boxShadowBlur', unit: 'px', defaultValue: 10 }) }),
                    new UI.wrapInput({ label: 'גודל', input: new UI.input.number({ prop: 'boxShadowSpread', unit: 'px', defaultValue: 0 }) })
                ]
            }),
            new UI.inputRow({ label: 'צבע הצל', input: new UI.input.color({ prop: 'boxShadowColor', defaultValue: '#000000', hasGradient: false }) }),
            new UI.inputRow({
                label: 'סוג',
                input: new UI.input.select({
                    prop: 'boxShadowInset',
                    options: [
                        { value: ' ', text: 'חיצוני (רגיל)' },
                        { value: 'inset', text: 'פנימי' }
                    ],
                })
            })
        ]
    })
];
