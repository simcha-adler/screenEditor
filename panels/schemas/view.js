//@ts-check

import { UI } from "../components/base.js";

export const viewSchema = [
    new UI.title({ label: 'תצוגה ואפקטים' }),
    new UI.inputRow({
        label: 'סוג תצוגה (Display)',
        input: new UI.input.select({
            prop: 'display',
            options: [
                { value: 'block', text: 'בלוק' },
                { value: 'inline-block', text: 'בלוק בשורה' },
                { value: 'inline', text: 'בתוך השורה' },
                { value: 'flex', text: 'פלקס' },
                { value: 'grid', text: 'גריד' },
                { value: 'none', text: 'מוסתר' }
            ]
        })
    }),
    new UI.section({
        label: 'גלישת תוכן', children: [
            new UI.grid({
                children: [
                    new UI.inputRow({
                        label: 'אופקי (X)',
                        input: new UI.input.select({
                            prop: 'overflowX',
                            options: [
                                { value: 'visible', text: 'רגיל' },
                                { value: 'hidden', text: 'חתוך' },
                                { value: 'scroll', text: 'גלילה' },
                                { value: 'auto', text: 'אוטומטי' }]
                        })
                    }),
                    new UI.inputRow({
                        label: 'אנכי (Y)', input: new UI.input.select({
                            prop: 'overflowY',
                            options: [
                                { value: 'visible', text: 'רגיל' },
                                { value: 'hidden', text: 'חתוך' },
                                { value: 'scroll', text: 'גלילה' },
                                { value: 'auto', text: 'אוטומטי' }
                            ]
                        })
                    }),
                ]
            })
        ]
    }),

    new UI.inputRow({ label: 'נראות', input: new UI.input.toggle({ prop: 'visibility', v: 'visible', x: 'hidden' }) }),
    new UI.inputRow({ label: 'אטימות', input: new UI.input.range({ prop: 'opacity', min: 0, max: 1, step: 0.01 }) }),
    new UI.inputRow({
        label: 'סמן עכבר', input: new UI.input.select({
            prop: 'cursor',
            options: [
                { value: 'auto', text: 'אוטומטי' },
                { value: 'pointer', text: 'אצבע' },
                { value: 'grab', text: 'תפיסה' },
                { value: 'text', text: 'טקסט' },
                { value: 'not-allowed', text: 'חסום' },
                { value: 'crosshair', text: 'כוונת' }
            ]
        })
    })
];
