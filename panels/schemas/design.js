//@ts-check

import { UI } from "../components/base.js";

export const designSchema = [
    new UI.title({ label: 'עיצוב טקסט וצבע' }),

    new UI.section({
        label: 'טיפוגרפיה', collapsed: false,
        children: [
            new UI.inputRow({
                label: 'גופן',
                input: new UI.input.select({
                    prop: 'fontFamily',
                    options: [
                        { value: 'Arial, sans-serif', text: 'Arial' },
                        { value: 'Verdana, sans-serif', text: 'Verdana' },
                        { value: '"Times New Roman", serif', text: 'Times New Roman' },
                        { value: '"Courier New", monospace', text: 'Courier New' },
                        { value: 'Segoe UI', text: 'Segoe UI' },
                        { value: 'Tahoma', text: 'Tahoma' },
                        { value: 'system-ui, -apple-system, sans-serif', text: 'System UI' },
                        { value: 'inherit', text: 'מורש (Inherit)' }
                    ]
                })
            }),
            new UI.inputRow({ label: 'גודל', input: new UI.input.number({ prop: 'fontSize', unit: 'px' }) }),
            new UI.inputRow({
                label: 'משקל',
                input: new UI.input.select({
                    prop: 'fontWeight',
                    options: [
                        { value: '400', text: 'רגיל' },
                        { value: '700', text: 'מודגש' },
                        { value: '300', text: 'דק' },
                        { value: '900', text: 'כבד' }
                    ]
                })
            }),
            new UI.inputRow({
                label: 'יישור טקסט',
                input: new UI.input.select({

                    prop: 'textAlign',
                    options: [
                        { value: 'start', text: 'התחלה' },
                        { value: 'center', text: 'מרכז' },
                        { value: 'end', text: 'סוף' },
                        { value: 'justify', text: 'יישור מלא' }
                    ]
                })
            })
        ]
    }),

    new UI.section({
        label: 'צבעים ורקע', collapsed: false,
        children: [
            new UI.inputRow({ label: 'צבע טקסט', input: new UI.input.color({ prop: 'color', defaultValue: '#000000', hasGradient: false }) }),
            new UI.inputRow({ label: 'צבע רקע', input: new UI.input.color({ prop: 'background', defaultValue: '#ffffff', hasGradient: true }) })
        ]
    })
];
