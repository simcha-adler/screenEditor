//@ts-check

import { UI } from "../components/base.js";
import { elementsList } from "./elementList.js";

export const addElementSchema = [
    new UI.title({ label: 'הוספת אלמנט' }),

    new UI.inputRow({
        label: 'בחר סוג אלמנט',
        input: new UI.input.select({
            details: { id: 'elementTypeSelect' },
            options: Object.keys(elementsList).map(k => ({ value: k, text: elementsList[k].label })),
            oninput: (e) => renderDynamicFields(e.target.value),
            prop: ''
        }),
    }),

    new UI.div({
        details: {
            id: 'dynamicFormFields',
            style: 'display: flex; flex-direction: column; gap: 20px; border-top: 1px solid var(--ui-10); padding-top: 15px;'
        }
    }),

    new UI.inputRow({
        label: 'מזהה ייחודי (ID)', input: new UI.input.text({ placeholder: 'מומלץ לקרוא שם לאלמנט', prop: '', details: { id: 'newElementId' } })
    }),

    new UI.button({
        details: { id: 'btnAdd', class: 'ui-btn-primary' }, label: '+ הוסף למסמך', onClick: executeAdd
    })
];
