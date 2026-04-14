//@ts-check

import { UI } from "../components/base.js";

export const themeSchema = [
    new UI.title({ label: 'מערכת צבעים חכמה' }),

    new UI.div({ details: { id: 'themeItemsList' } }),

    new UI.button({
        label: '+ צור טווח חדש', details: { class: 'btn-primary', style: 'margin-top:10px; width:100%;' },
        onClick: () => openThemeEditor()
    }),

    new UI.div({ details: { id: 'themeEditorOverlay' } })
];
