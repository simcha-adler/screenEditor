//@ts-check

import { UI } from "../components/base.js";

export const positionSchema = [
    new UI.title({ label: 'מיקום (Position)' }),

    new UI.inputRow({
        label: 'שיטה',
        input: new UI.input.select({
            prop: 'position',
            options: [
                { value: 'static', text: 'אוטומטי (Static)' },
                { value: 'relative', text: 'יחסי (Relative)' },
                { value: 'absolute', text: 'מוחלט (Absolute)' },
                { value: 'fixed', text: 'קבוע (Fixed)' },
                { value: 'sticky', text: 'דביק (Sticky)' }
            ]
        })
    }),
    new UI.inputRow({
        label: 'שכבה (Z-Index)', input: new UI.input.number({ prop: 'zIndex' })
    }),

    new UI.smallTitle({ label: 'היסט (Offsets)' }),
    new UI.grid({
        children: [
            new UI.wrapInput({ label: 'Top', input: new UI.input.combinated({ prop: 'top', selectToCombinated: UI.unitsOptions }) }),
            new UI.wrapInput({ label: 'Right', input: new UI.input.combinated({ prop: 'right', selectToCombinated: UI.unitsOptions }) }),
            new UI.wrapInput({ label: 'Bottom', input: new UI.input.combinated({ prop: 'bottom', selectToCombinated: UI.unitsOptions }) }),
            new UI.wrapInput({ label: 'Left', input: new UI.input.combinated({ prop: 'left', selectToCombinated: UI.unitsOptions }) })
        ]
    }),

    new UI.title({ label: 'גודל (Size)' }),
    new UI.grid({
        children: [
            new UI.wrapInput({ label: 'רוחב', input: new UI.input.combinated({ prop: 'width', selectToCombinated: UI.unitsOptions }) }),
            new UI.wrapInput({ label: 'גובה', input: new UI.input.combinated({ prop: 'height', selectToCombinated: UI.unitsOptions }) })
        ]
    }),

    new UI.section({
        label: 'הגבלות גודל', collapsed: true,
        children: [
            new UI.grid({
                children: [
                    new UI.wrapInput({ label: 'Min W', input: new UI.input.combinated({ prop: 'minWidth', unit: 'px', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: 'Max W', input: new UI.input.combinated({ prop: 'maxWidth', unit: 'px', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: 'Min H', input: new UI.input.combinated({ prop: 'minHeight', unit: 'px', selectToCombinated: UI.unitsOptions }) }),
                    new UI.wrapInput({ label: 'Max H', input: new UI.input.combinated({ prop: 'maxHeight', unit: 'px', selectToCombinated: UI.unitsOptions }) })
                ]
            })
        ]
    })
];
