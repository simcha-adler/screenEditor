//@ts-check

import { UI } from "../components/base.js";

export const layoutSchema = [
    new UI.title({ label: 'פריסת פלקס (Flexbox)' }),

    new UI.inputRow({
        label: 'כיוון',
        input: new UI.input.select({
            prop: 'flexDirection',
            options: [
                { value: 'row', text: 'שורה ←' },
                { value: 'column', text: 'טור ↓' },
                { value: 'row-reverse', text: 'שורה הפוכה →' },
                { value: 'column-reverse', text: 'טור הפוך ↑' }
            ]
        })
    }),
    new UI.inputRow({
        label: 'ירידת שורה', input: new UI.input.toggle({ prop: 'flexWrap', v: 'wrap', x: 'nowrap' })
    }),

    new UI.smallTitle({ label: 'מרווח בין פריטים' }),

    new UI.inputRow({ label: 'רווח בין שורות', input: new UI.input.number({ prop: 'rowGap', unit: 'px' }) }),
    new UI.inputRow({ label: 'רווח בין עמודות', input: new UI.input.number({ prop: 'columnGap', unit: 'px' }) }),

    new UI.title({ label: 'יישור' }),
    new UI.inputRow({
        label: 'ציר ראשי',
        input: new UI.input.select({
            prop: 'justifyContent',
            options: [
                { value: 'flex-start', text: 'התחלה' },
                { value: 'center', text: 'מרכז' },
                { value: 'flex-end', text: 'סוף' },
                { value: 'space-between', text: 'רווח בין' },
                { value: 'space-around', text: 'רווח מסביב' }
            ]
        })
    }),
    new UI.inputRow({
        label: 'ציר משני',
        input: new UI.input.select({
            prop: 'alignItems',
            options: [
                { value: 'flex-start', text: 'התחלה' },
                { value: 'center', text: 'מרכז' },
                { value: 'stretch', text: 'מתיחה' },
                { value: 'baseline', text: 'קו בסיס' }
            ]
        })
    }),
    new UI.inputRow({
        label: 'יישור תוכן',
        input: new UI.input.select({
            prop: 'alignContent',
            options: [
                { value: 'flex-start', text: 'התחלה' },
                { value: 'center', text: 'מרכז' },
                { value: 'stretch', text: 'מתיחה' },
                { value: 'space-between', text: 'רווח בין' }
            ]
        })
    })
];
