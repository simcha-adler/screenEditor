//@ts-check

import { UI } from "../components/base.js";

export const settingsSchema = [
    new UI.title({ label: 'הגדרות עורך ונושא' }),

    // --- Theme Settings ---
    new UI.section({
        label: 'גווני האתר', collapsed: false,
        children: [
            new UI.smallTitle({ label: 'צבע ראשי' }),
            new UI.inputRow({ label: 'מצב כהה', input: new UI.input.toggle({ prop: 'darkMod', v: true, x: false }) }),
            new UI.inputRow({ label: 'גוון', input: new UI.input.range({ prop: 'huePrimary', min: 0, max: 360 }) }),
            new UI.inputRow({ label: 'רוויה', input: new UI.input.range({ prop: 'saturationPrimary', min: 0, max: 100 }) }),

            new UI.smallTitle({ label: 'צבע הדגשה' }),
            new UI.inputRow({ label: 'גוון', input: new UI.input.color({ prop: 'accent', defaultValue: '#0078d4', hasGradient: false }) })
        ]
    }),

    // --- System Settings ---
    new UI.section({
        label: 'מערכת', collapsed: true,
        children: [
            new UI.inputRow({ label: 'שמירה אוטומטית', input: new UI.input.toggle({ prop: 'autoSave', v: true, x: false }) }),
            new UI.inputRow({ label: 'הצג גבולות עזר', input: new UI.input.toggle({ prop: 'showOutlines', v: true, x: false }) })
        ]
    }),

    // --- Actions ---
    new UI.button({
        label: 'אפס להגדרות יצרן', details: { class: 'ui-btn-danger' },
        onClick: () => {
            if (confirm('האם לאפס את כל ההגדרות?')) {
                settings.reloadDefault();
            }
        }
    })
];
