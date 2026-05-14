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
                input: new UI.input.combinated({ selectToCombinated: UI.unitsOptions, prop: 'borderRadius' })
            }),
            new UI.grid({
                details: { class: 'switch-body g2' },
                children: [
                    new UI.wrapInput({ label: '↖', input: new UI.input.combinated({ prop: 'borderTopLeftRadius', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: '↗', input: new UI.input.combinated({ prop: 'borderTopRightRadius', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: '↘', input: new UI.input.combinated({ prop: 'borderBottomRightRadius', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: '↙', input: new UI.input.combinated({ prop: 'borderBottomLeftRadius', selectToCombinated: UI.unitsOptions }) })
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
            new UI.inputRow({ details: { class: 'switch-body g1' }, label: 'כל הצדדים', input: new UI.input.combinated({ prop: 'padding', selectToCombinated: UI.unitsOptions }) }),
            new UI.grid({
                details: { class: 'switch-body g2' },
                children: [
                    new UI.wrapInput({ label: 'אנכי (↕)', input: new UI.input.combinated({ prop: 'paddingBlock', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: 'אופקי (↔)', input: new UI.input.combinated({ prop: 'paddingInline', selectToCombinated: UI.unitsOptions }) })
                ]
            }),
            new UI.grid({
                details: { class: 'switch-body g3' },
                children: [
                    new UI.wrapInput({ label: 'Top', input: new UI.input.combinated({ prop: 'paddingTop', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: 'Right', input: new UI.input.combinated({ prop: 'paddingRight', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: 'Bottom', input: new UI.input.combinated({ prop: 'paddingBottom', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: 'Left', input: new UI.input.combinated({ prop: 'paddingLeft', selectToCombinated: UI.unitsOptions }) })
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
            new UI.inputRow({ details: { class: 'switch-body g1' }, label: 'כל הצדדים', input: new UI.input.combinated({ prop: 'margin', selectToCombinated: UI.unitsOptions }) }),
            new UI.grid({
                details: { class: 'switch-body g2' },
                children: [
                    new UI.wrapInput({ label: 'אנכי (↕)', input: new UI.input.combinated({ prop: 'marginBlock', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: 'אופקי (↔)', input: new UI.input.combinated({ prop: 'marginInline', selectToCombinated: UI.unitsOptions }) })
                ]
            }),
            new UI.grid({
                details: { class: 'switch-body g3' },
                children: [
                    new UI.wrapInput({ label: 'Top', input: new UI.input.combinated({ prop: 'marginTop', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: 'Right', input: new UI.input.combinated({ prop: 'marginRight', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: 'Bottom', input: new UI.input.combinated({ prop: 'marginBottom', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: 'Left', input: new UI.input.combinated({ prop: 'marginLeft', selectToCombinated: UI.unitsOptions }) })
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
