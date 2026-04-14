//@ts-check

import { UI } from "../components/base.js";

export const classesSchema = [
    new UI.title({ label: 'ניהול קלאסים (CSS Classes)' }),

    // --- אזור קלאסים פעילים ---
    new UI.smallTitle({ label: 'קלאסים משויכים:' }),
    new UI.div({
        details: {
            id: 'activeClassesList',
            class: 'ui-tags-container',
            style: 'min-height: 35px; padding: 5px; background: var(--ui-5); border: 1px solid var(--ui-10); border-radius: 4px; display: flex; flex-wrap: wrap; gap: 5px;'
        }
    }),

    // --- אזור הוספה ---
    new UI.smallTitle({ label: 'הוסף קלאס חדש' }),
    //@ts-ignore
    new UI.wrapInput({ input: new UI.input.text({ placeholder: 'לדוגמה: my-button', details: { id: 'classInput' } }) }),
    new UI.button({ label: 'שייך', details: { id: 'btnConnectClass', class: 'ui-btn-primary' }, onClick: () => { } }),
    new UI.button({
        label: '🛠️ צור הגדרה חדשה לקלאס זה', details: {
            id: 'btnCreateRule',
            class: 'ui-btn-full', style: 'margin-bottom: 15px; font-size: 11px;'
        }, onClick: () => { }
    }),

    // --- ספריית קלאסים ---
    new UI.title({ label: 'ספריית קלאסים' }),
    new UI.div({
        details: {
            id: 'systemClassesList',
            class: 'ui-class-list-container',
            style: 'max-height: 150px; overflow-y: auto; border: 1px solid var(--ui-10); border-radius: 4px; background: var(--ui-base); padding: 5px;'
        }
    })
];
