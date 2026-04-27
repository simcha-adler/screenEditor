//@ts-check

import { UI } from "../components/base.js";

// הגדרת הסוגים של התיבות
const boxSubTypes = [
    { text: '📦 Div פשוט', value: '' },
    { text: '📄 Section (סקיצה רחבה)', value: 'min-height: 200px; width: 100%;' },
    { text: '↔ Flex Row (צד לצד)', value: 'display: flex; flex-direction: row; gap: 10px;' },
    { text: '↕ Flex Col (אחד מעל השני)', value: 'display: flex; flex-direction: column; gap: 10px;' },
    { text: '🔳 קונטיינר מרכזי', value: 'max-width: 1200px; margin: 0 auto; width: 100%;' }
];

export const elementsList = {

    // --- כותרות (Headers) ---
    'h1': {
        label: '🇹 כותרת ראשית (H1)',
        fields: [
            new UI.inputRow({ label: 'תוכן', input: new UI.input.text({ prop: 'text', placeholder: 'כותרת גדולה' }) }),
            new UI.inputRow({ label: 'צבע', input: new UI.input.color({ prop: 'color', defaultValue: '#222222', hasGradient: false }) })
        ],
        html: (d) => `<h1 id="${d.id}">${d.text}</h1>`,
        css: (d) => `#${d.id} { color: ${d.color}; font-size: 42px; margin-bottom: 20px; font-weight: 800; line-height: 1.2; }`
    },
    'h2': {
        label: '🇹 כותרת משנית (H2)',
        fields: [
            new UI.inputRow({ label: 'תוכן', input: new UI.input.text({ prop: 'text', placeholder: 'כותרת משנה' }) }),
            new UI.inputRow({ label: 'צבע', input: new UI.input.color({ prop: 'color', defaultValue: '#444444', hasGradient: false }) })
        ],
        html: (d) => `<h2 id="${d.id}">${d.text}</h2>`,
        css: (d) => `#${d.id} { color: ${d.color}; font-size: 30px; margin-bottom: 15px; font-weight: 600; }`
    },
    // --- מדיה וקישורים ---
    'video': {
        label: '🎬 וידאו (Video)',
        fields: [
            new UI.inputRow({ label: 'כתובת וידאו (URL)', input: new UI.input.text({ prop: 'src', placeholder: 'https://www.w3schools.com/html/mov_bbb.mp4' }) }),
            new UI.inputRow({ label: 'הצג פקדים', input: new UI.input.toggle({ prop: 'controls', v: true, x: false }) }),
            new UI.inputRow({ label: 'ניגון אוטומטי', input: new UI.input.toggle({ prop: 'autoplay', v: true, x: false }) })
        ],
        // שימוש בתנאי בתוך ה-Template כדי להוסיף attributes
        html: (d) => `<video id="${d.id}" src="${d.src}" ${d.controls ? 'controls' : ''} ${d.autoplay ? 'autoplay' : ''}></video>`,
        css: (d) => `#${d.id} { width: 100%; max-width: 800px; border-radius: 12px; display: block; }`
    },
    'link': {
        label: '🔗 קישור (Link)',
        fields: [
            new UI.inputRow({ label: 'טקסט', input: new UI.input.text({ prop: 'text', placeholder: 'לחץ כאן למעבר' }) }),
            new UI.inputRow({ label: 'כתובת (URL)', input: new UI.input.text({ prop: 'href', placeholder: 'https://google.com' }) }),
            new UI.inputRow({ label: 'צבע', input: new UI.input.color({ prop: 'color', defaultValue: '#0078d4', hasGradient: false }) })
        ],
        html: (d) => `<a id="${d.id}" href="${d.href}" target="_blank">${d.text}</a>`,
        css: (d) => `
            #${d.id} { color: ${d.color}; text-decoration: none; font-weight: 500; }
            #${d.id}:hover { text-decoration: underline; }
        `
    },
    // --- מבנה ותוכן ---
    'div': {
        label: '🔲 קופסה (Container)',
        fields: [
            new UI.inputRow({ label: 'גובה מינימלי', input: new UI.input.number({ prop: 'minH', defaultValue: 100, unit: 'px' }) }),
            new UI.inputRow({ label: 'צבע רקע', input: new UI.input.color({ prop: 'bg', defaultValue: '#f0f0f0', hasGradient: true }) }),
            new UI.inputRow({ label: 'ריווח פנימי', input: new UI.input.number({ prop: 'pad', defaultValue: 20, unit: 'px' }) }),
            new UI.inputRow({ label: 'סוג הקופסא', input: new UI.input.select({ prop: 'cssType', options: boxSubTypes }) })
        ],
        html: (d) => `<div id="${d.id}"></div>`, // קונטיינר ריק שניתן להכניס לתוכו דברים
        css: (d) => `#${d.id} { 
                min-height: ${d.minH}px; 
                background-color: ${d.bg}; 
                padding: ${d.pad}px; 
                border: 1px dashed #ccc; 
                ${d.cssType}
            }
        `
    },
    'details': {
        label: '🔻 אקורדיון (Details)',
        fields: [
            new UI.inputRow({
                label: 'כותרת גלויה', input: new UI.input.text({ prop: 'summary', placeholder: 'לחצו לפתיחת פרטים' })
            }),
            new UI.inputRow({ label: 'תוכן מוסתר', input: new UI.input.text({ prop: 'content', placeholder: 'כאן מופיע המידע המפורט שנחשף בלחיצה...' }) })
        ],
        html: (d) => `
            <details id="${d.id}">
                <summary id="${d.id}_sum">${d.summary}</summary>
                <div id="${d.id}_body">
                    <p id="${d.id}_p">${d.content}</p>
                </div>
            </details>
        `,
        css: (d) => `
            #${d.id} { border: 1px solid #ddd; border-radius: 8px; background: white; overflow: hidden; }
            #${d.id} summary { padding: 15px; cursor: pointer; font-weight: bold; outline: none; background: #f9f9f9; }
            #${d.id} summary:hover { background: #f0f0f0; }
            #${d.id}_body { padding: 15px; border-top: 1px solid #eee; }
            #${d.id}_p { margin: 0; color: #555; line-height: 1.5; }
        `
    },

    // --- אלמנטים בסיסיים ---
    'text_block': {
        label: '📝 פסקה מעוצבת',
        fields: [
            new UI.inputRow({ label: 'תוכן', input: new UI.input.text({ prop: 'content', placeholder: 'כתבו כאן את הטקסט שלכם...' }) }),
            new UI.inputRow({ label: 'גודל פונט', input: new UI.input.number({ prop: 'size', defaultValue: 16, unit: 'px' }) }),
            new UI.inputRow({ label: 'צבע', input: new UI.input.color({ prop: 'color', defaultValue: '#333333', hasGradient: false }) })
        ],
        html: (d) => `<p id="${d.id}">${d.content}</p>`,
        css: (d) => `#${d.id} { font-size: ${d.size}px; color: ${d.color}; line-height: 1.6; margin-bottom: 15px; }`
    },

    'button': {
        label: '🔘 כפתור',
        fields: [
            new UI.inputRow({ label: 'טקסט', input: new UI.input.text({ prop: 'text', placeholder: 'לחצו כאן' }) }),
            new UI.inputRow({ label: 'צבע רקע', input: new UI.input.color({ prop: 'bg', defaultValue: '#0078d4', hasGradient: true }) }),
            new UI.inputRow({ label: 'עיגול פינות', input: new UI.input.number({ prop: 'radius', defaultValue: 8, unit: 'px' }) })
        ],
        html: (d) => `<button id="${d.id}">${d.text}</button>`,
        css: (d) => `
            #${d.id} { 
                background-color: ${d.bg}; 
                color: white; 
                padding: 12px 24px; 
                border: none; 
                border-radius: ${d.radius}px; 
                cursor: pointer; 
                font-weight: 600;
                transition: transform 0.2s;
            }
            #${d.id}:hover { transform: scale(1.05); }
        `
    },

    'image': {
        label: '🖼️ תמונה עם מסגרת',
        fields: [
            new UI.inputRow({
                label: 'URL', input: new UI.input.text({ prop: 'url', placeholder: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600' })
            }),
            new UI.inputRow({ label: 'עיגול', input: new UI.input.number({ prop: 'radius', defaultValue: 12, unit: 'px' }) }),
            new UI.inputRow({ label: 'צל', input: new UI.input.toggle({ prop: 'shadow', v: '0 10px 20px rgba(0,0,0,0.1)', x: 'none' }) })
        ],
        html: (d) => `<img id="${d.id}" src="${d.url}" alt="image">`,
        css: (d) => `#${d.id} { width: 100%; border-radius: ${d.radius}px; box-shadow: ${d.shadow}; display: block; }`
    },

    // --- רכיבים מורכבים (Components) ---
    'hero': {
        label: '🚀 אזור פתיחה (Hero)',
        fields: [
            new UI.inputRow({ label: 'כותרת', input: new UI.input.text({ prop: 'h1', placeholder: 'העתיד מתחיל כאן' }) }),
            new UI.inputRow({ label: 'תת כותרת', input: new UI.input.text({ prop: 'h2', placeholder: 'בנו אתר מדהים בתוך דקות' }) }),
            new UI.inputRow({ label: 'צבע טקסט', input: new UI.input.color({ prop: 'color', defaultValue: '#ffffff', hasGradient: false }) }),
            new UI.inputRow({ label: 'רקע', input: new UI.input.color({ prop: 'bg', defaultValue: '#1a1a1a', hasGradient: true }) })
        ],
        html: (d) => `
            <section id="${d.id}">
                <h1 id="${d.id}_h1">${d.h1}</h1>
                <p id="${d.id}_p">${d.h2}</p>
                <button id="${d.id}_btn">בואו נתחיל</button>
            </section>
        `,
        css: (d) => `
            #${d.id} { 
                background: ${d.bg}; 
                padding: 80px 20px; 
                text-align: center; 
                border-radius: 15px; 
                color: ${d.color}; 
            }
            #${d.id}_h1 { font-size: 48px; margin-bottom: 20px; }
            #${d.id}_p { font-size: 20px; opacity: 0.9; margin-bottom: 30px; }
            #${d.id}_btn { padding: 15px 40px; border-radius: 50px; border: none; cursor: pointer; background: white; color: black; font-weight: bold; }
        `
    },

    'card': {
        label: '🃏 כרטיס שירות',
        fields: [
            new UI.inputRow({ label: 'כותרת', input: new UI.input.text({ prop: 'title', placeholder: 'עיצוב גרפי' }) }),
            new UI.inputRow({ label: 'תיאור', input: new UI.input.text({ prop: 'desc', placeholder: 'שירותי עיצוב ברמה הגבוהה ביותר' }) }),
            new UI.inputRow({ label: 'אייקון (Emoji)', input: new UI.input.text({ prop: 'icon', placeholder: '🎨' }) })
        ],
        html: (d) => `
            <div id="${d.id}" class="ui-card">
                <div id="${d.id}_icon" style="font-size: 40px; margin-bottom: 15px;">${d.icon}</div>
                <h3 id="${d.id}_title">${d.title}</h3>
                <p id="${d.id}_desc">${d.desc}</p>
            </div>
        `,
        css: (d) => `
            #${d.id} { 
                background: white; 
                border: 1px solid #eee; 
                padding: 30px; 
                border-radius: 20px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
                transition: 0.3s;
                text-align: center;
                width: 250px;
            }
            #${d.id}:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
            #${d.id}_title { margin: 0 0 10px 0; font-size: 20px; }
            #${d.id}_desc { font-size: 14px; color: #777; margin: 0; }
        `
    },

    'contact_simple': {
        label: '📧 טופס יצירת קשר',
        fields: [
            new UI.inputRow({
                label: 'כותרת', input: new UI.input.text({ prop: 'title', placeholder: 'צרו איתנו קשר' })
            }),
            new UI.inputRow({ label: 'צבע כפתור', input: new UI.input.color({ prop: 'btnBg', defaultValue: '#2ecc71', hasGradient: true }) })
        ],
        html: (d) => `
            <div id="${d.id}">
                <h2 id="${d.id}_h2">${d.title}</h2>
                <input type="text" placeholder="שם מלא" style="width:100%; margin-bottom:10px; padding:10px; border:1px solid #ddd; border-radius:4px;">
                <input type="email" placeholder="אימייל" style="width:100%; margin-bottom:10px; padding:10px; border:1px solid #ddd; border-radius:4px;">
                <button id="${d.id}_btn" style="width:100%; padding:12px; background:${d.btnBg}; color:white; border:none; border-radius:4px; cursor:pointer;">שלח הודעה</button>
            </div>
        `,
        css: (d) => `
            #${d.id} { background: #f9f9f9; padding: 40px; border-radius: 12px; max-width: 400px; }
            #${d.id}_h2 { margin-top: 0; margin-bottom: 25px; text-align: center; }
        `
    },

    'navbar': {
        label: '📂 תפריט ניווט (Navbar)',
        fields: [
            new UI.inputRow({ label: 'שם הלוגו', input: new UI.input.text({ prop: 'logo', placeholder: 'MySite' }) }),
            new UI.inputRow({ label: 'צבע רקע', input: new UI.input.color({ prop: 'bg', defaultValue: '#ffffff', hasGradient: true }) })
        ],
        html: (d) => `
            <nav id="${d.id}">
                <div id="${d.id}_logo" style="font-weight: bold; font-size: 20px;">${d.logo}</div>
                <ul id="${d.id}_links" style="display: flex; gap: 20px; list-style: none; margin: 0; padding: 0;">
                    <li>דף הבית</li>
                    <li>אודות</li>
                    <li>שירותים</li>
                    <li>צור קשר</li>
                </ul>
            </nav>
        `,
        css: (d) => `
            #${d.id} { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 15px 40px; 
                background: ${d.bg}; 
                border-bottom: 1px solid #eee; 
                width: 100%;
            }
        `
    },

    // --- טיפוגרפיה וטקסט ---
    'section_title': {
        label: '🏷️ כותרת עם קו תחתי',
        fields: [
            new UI.inputRow({ label: 'טקסט', input: new UI.input.text({ prop: 'text', placeholder: 'השירותים שלנו' }) }),
            new UI.inputRow({ label: 'צבע קו', input: new UI.input.color({ prop: 'lineColor', defaultValue: '#0078d4', hasGradient: false }) })
        ],
        html: (d) => `<div id="${d.id}" class="s-title"><h2>${d.text}</h2><div class="line"></div></div>`,
        css: (d) => `#${d.id} { text-align: center; margin: 40px 0; } #${d.id} h2 { margin: 0; } #${d.id} .line { width: 50px; height: 3px; background: ${d.lineColor}; margin: 10px auto; }`
    },
    'blockquote': {
        label: '❞ ציטוט מעוצב',
        fields: [
            new UI.inputRow({ label: 'ציטוט', input: new UI.input.text({ prop: 'text', placeholder: 'אל תחכה להזדמנות, צור אותה.' }) }),
            new UI.inputRow({ label: 'מקור', input: new UI.input.text({ prop: 'author', placeholder: 'אלמוני' }) })
        ],
        html: (d) => `<blockquote id="${d.id}"><p>"${d.text}"</p><cite>- ${d.author}</cite></blockquote>`,
        css: (d) => `#${d.id} { border-right: 5px solid #0078d4; padding: 20px; background: #f0f7ff; font-style: italic; } #${d.id} cite { display: block; margin-top: 10px; font-weight: bold; }`
    },

    // --- כפתורים ואינטראקציה ---
    'outline_button': {
        label: '🔲 כפתור מסגרת',
        fields: [
            new UI.inputRow({ label: 'טקסט', input: new UI.input.text({ prop: 'text', placeholder: 'קרא עוד' }) }),
            new UI.inputRow({ label: 'צבע', input: new UI.input.color({ prop: 'color', defaultValue: '#333', hasGradient: false }) })
        ],
        html: (d) => `<button id="${d.id}">${d.text}</button>`,
        css: (d) => `#${d.id} { background: transparent; border: 2px solid ${d.color}; color: ${d.color}; padding: 10px 20px; border-radius: 5px; cursor: pointer; transition: 0.3s; } #${d.id}:hover { background: ${d.color}; color: #fff; }`
    },
    'social_links': {
        label: '📱 שורת רשתות חברתיות',
        fields: [
            new UI.inputRow({ label: 'גודל אייקון', input: new UI.input.number({ prop: 'size', defaultValue: 24, unit: 'px' }) })
        ],
        html: (d) => `<div id="${d.id}" class="socials"><span>FB</span> <span>IG</span> <span>TW</span> <span>LI</span></div>`,
        css: (d) => `#${d.id} { display: flex; gap: 15px; font-weight: bold; font-size: ${d.size}px; color: #555; cursor: pointer; }`
    },

    // --- אלמנטים ויזואליים ---
    'feature_icon': {
        label: '✨ תכונה (אייקון + טקסט)',
        fields: [
            new UI.inputRow({ label: 'אייקון', input: new UI.input.text({ prop: 'icon', placeholder: '🚀' }) }),
            new UI.inputRow({ label: 'כותרת', input: new UI.input.text({ prop: 'title', placeholder: 'מהירות שיא' }) }),
            new UI.inputRow({ label: 'תיאור', input: new UI.input.text({ prop: 'desc', placeholder: 'המערכת הכי מהירה בשוק' }) })
        ],
        html: (d) => `<div id="${d.id}" class="feature"><i>${d.icon}</i><h3>${d.title}</h3><p>${d.desc}</p></div>`,
        css: (d) => `#${d.id} { text-align: center; padding: 20px; } #${d.id} i { font-size: 40px; } #${d.id} h3 { margin: 10px 0; }`
    },
    'divider': {
        label: '➖ קו מפריד מעוצב',
        fields: [
            new UI.inputRow({ label: 'עובי', input: new UI.input.number({ prop: 'h', defaultValue: 2, unit: 'px' }) }),
            new UI.inputRow({ label: 'רוחב %', input: new UI.input.number({ prop: 'w', defaultValue: 50, unit: '%' }) })
        ],
        html: (d) => `<hr id="${d.id}">`,
        css: (d) => `#${d.id} { border: none; height: ${d.h}px; background: #eee; width: ${d.w}; margin: 30px auto; }`
    },
    'video_embed': {
        label: '📺 וידאו יוטיוב',
        fields: [
            new UI.inputRow({ label: 'קוד וידאו (ID)', input: new UI.input.text({ prop: 'vid', placeholder: 'dQw4w9WgXcQ' }) })
        ],
        html: (d) => `<div id="${d.id}"><iframe width="100%" height="315" src="https://www.youtube.com/embed/${d.vid}" frameborder="0" allowfullscreen></iframe></div>`,
        css: (d) => `#${d.id} { border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }`
    },

    // --- כרטיסים ומידע ---
    'testimonial_card': {
        label: '👤 המלצת לקוח',
        fields: [
            new UI.inputRow({ label: 'שם הלקוח', input: new UI.input.text({ prop: 'name', placeholder: 'ישראל ישראלי' }) }),
            new UI.inputRow({ label: 'תפקיד', input: new UI.input.text({ prop: 'job', placeholder: 'מנכ"ל' }) }),
            new UI.inputRow({ label: 'טקסט', input: new UI.input.text({ prop: 'txt', placeholder: 'שירות פשוט מעולה!' }) })
        ],
        html: (d) => `<div id="${d.id}" class="testimonial"><p>"${d.txt}"</p><strong>${d.name}</strong><span>${d.job}</span></div>`,
        css: (d) => `#${d.id} { background: #fff; padding: 20px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center; } #${d.id} span { display: block; font-size: 12px; color: #777; }`
    },
    'pricing_badge': {
        label: '🏷️ תג מחיר',
        fields: [
            new UI.inputRow({ label: 'מחיר', input: new UI.input.text({ prop: 'p', placeholder: '₪99' }) }),
            new UI.inputRow({ label: 'תקופה', input: new UI.input.text({ prop: 't', placeholder: '/ לחודש' }) })
        ],
        html: (d) => `<div id="${d.id}"><strong>${d.p}</strong><small>${d.t}</small></div>`,
        css: (d) => `#${d.id} { display: inline-block; padding: 10px 20px; background: #222; color: #fff; border-radius: 50px; }`
    },

    // --- מבנה ותצוגה ---
    'grid_3_cols': {
        label: '⊞ גריד 3 עמודות',
        fields: [
            new UI.inputRow({ label: 'מרווח', input: new UI.input.number({ prop: 'gap', defaultValue: 20, unit: 'px' }) })
        ],
        html: (d) => `<div id="${d.id}"><div class="col"></div><div class="col"></div><div class="col"></div></div>`,
        css: (d) => `#${d.id} { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: ${d.gap}; } #${d.id} .col { min-height: 100px; background: #f5f5f5; border: 1px dashed #ccc; }`
    },
    'full_width_banner': {
        label: '🏁 באנר רחב',
        fields: [
            new UI.inputRow({ label: 'טקסט', input: new UI.input.text({ prop: 'text', placeholder: 'מבצע מיוחד לזמן מוגבל!' }) }),
            new UI.inputRow({ label: 'צבע רקע', input: new UI.input.color({ prop: 'bg', defaultValue: '#ff4757', hasGradient: true }) })
        ],
        html: (d) => `<div id="${d.id}">${d.text}</div>`,
        css: (d) => `#${d.id} { width: 100%; padding: 15px; background: ${d.bg}; color: #fff; text-align: center; font-weight: bold; }`
    },
    'list_group': {
        label: '📝 רשימת נקודות (Bullet List)',
        fields: [
            new UI.inputRow({ label: 'צבע אייקון', input: new UI.input.color({ prop: 'c', defaultValue: '#2ed573', hasGradient: false }) })
        ],
        html: (d) => `<ul id="${d.id}"><li>✓ אפשרות ראשונה</li><li>✓ אפשרות שנייה</li><li>✓ אפשרות שלישית</li></ul>`,
        css: (d) => `#${d.id} { list-style: none; padding: 0; } #${d.id} li { margin-bottom: 10px; color: #444; } #${d.id} li::before { content: ""; color: ${d.c}; margin-left: 10px; }`
    },
    'image_caption': {
        label: '🖼️ תמונה עם כיתוב',
        fields: [
            new UI.inputRow({ label: 'URL', input: new UI.input.text({ prop: 'src', placeholder: 'https://via.placeholder.com/300x200' }) }),
            new UI.inputRow({ label: 'כיתוב', input: new UI.input.text({ prop: 'cap', placeholder: 'תיאור התמונה' }) })
        ],
        html: (d) => `<figure id="${d.id}"><img src="${d.src}"><figcaption>${d.cap}</figcaption></figure>`,
        css: (d) => `#${d.id} { margin: 0; width: 100%; } #${d.id} img { width: 100%; border-radius: 8px; } #${d.id} figcaption { text-align: center; font-size: 14px; color: #666; margin-top: 8px; }`
    },
    'faq_item': {
        label: '❓ פריט שאלות ותשובות',
        fields: [
            new UI.inputRow({ label: 'שאלה', input: new UI.input.text({ prop: 'q', placeholder: 'איך זה עובד?' }) }),
            new UI.inputRow({ label: 'תשובה', input: new UI.input.text({ prop: 'a', placeholder: 'פשוט מאוד, נרשמים ומתחילים.' }) })
        ],
        html: (d) => `<div id="${d.id}"><h4>${d.q}</h4><p>${d.a}</p></div>`,
        css: (d) => `#${d.id} { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; } #${d.id} h4 { margin-bottom: 5px; color: #0078d4; }`
    },
    'footer_simple': {
        label: '┸ פוטר פשוט',
        fields: [
            new UI.inputRow({ label: 'קרדיט', input: new UI.input.text({ prop: 't', placeholder: '© 2024 כל הזכויות שמורות' }) })
        ],
        html: (d) => `<footer id="${d.id}">${d.t}</footer>`,
        css: (d) => `#${d.id} { padding: 20px; text-align: center; border-top: 1px solid #eee; font-size: 13px; color: #888; }`
    },
    'progress_bar': {
        label: '📊 סרגל התקדמות',
        fields: [
            new UI.inputRow({ label: 'אחוזים', input: new UI.input.number({ prop: 'p', defaultValue: 70, unit: '%' }) }),
            new UI.inputRow({ label: 'צבע', input: new UI.input.color({ prop: 'bg', defaultValue: '#2ed573', hasGradient: true }) })
        ],
        html: (d) => `<div id="${d.id}"><div class="bar" style="width:${d.p}%"></div></div>`,
        css: (d) => `#${d.id} { width: 100%; height: 10px; background: #eee; border-radius: 10px; overflow: hidden; } #${d.id} .bar { height: 100%; background: ${d.bg}; }`
    },
    'tag_pill': {
        label: '💊 תגית (Pill)',
        fields: [
            new UI.inputRow({ label: 'טקסט', input: new UI.input.text({ prop: 't', placeholder: 'עיצוב' }) }),
            new UI.inputRow({ label: 'צבע', input: new UI.input.color({ prop: 'bg', defaultValue: '#dfe4ea', hasGradient: false }) })
        ],
        html: (d) => `<span id="${d.id}">${d.t}</span>`,
        css: (d) => `#${d.id} { padding: 4px 12px; background: ${d.bg}; border-radius: 20px; font-size: 12px; margin-right: 5px; }`
    },
    'contact_info': {
        label: '📞 פרטי התקשרות',
        fields: [
            new UI.inputRow({ label: 'טלפון', input: new UI.input.text({ prop: 'p', placeholder: '050-0000000' }) }),
            new UI.inputRow({ label: 'אימייל', input: new UI.input.text({ prop: 'e', placeholder: 'test@mail.com' }) })
        ],
        html: (d) => `<div id="${d.id}"><div>📞 ${d.p}</div><div>✉ ${d.e}</div></div>`,
        css: (d) => `#${d.id} { font-size: 14px; line-height: 1.8; }`
    },
    'avatar_box': {
        label: '👤 תמונת פרופיל עיגול',
        fields: [
            new UI.inputRow({ label: 'URL', input: new UI.input.text({ prop: 'src', placeholder: 'https://via.placeholder.com/100' }) }),
            new UI.inputRow({ label: 'גודל', input: new UI.input.number({ prop: 's', defaultValue: 80, unit: 'px' }) })
        ],
        html: (d) => `<img id="${d.id}" src="${d.src}">`,
        css: (d) => `#${d.id} { width: ${d.s}px; height: ${d.s}px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }`
    },
    'newsletter_mini': {
        label: '📧 הרשמה לניוזלטר (מיני)',
        fields: [
            new UI.inputRow({ label: 'כותרת', input: new UI.input.text({ prop: 't', placeholder: 'הצטרפו לעדכונים' }) })
        ],
        html: (d) => `<div id="${d.id}"><h4>${d.t}</h4><input type="email" placeholder="המייל שלך"><button>שלח</button></div>`,
        css: (d) => `#${d.id} { padding: 15px; background: #f9f9f9; border-radius: 8px; text-align: center; } #${d.id} input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 5px; width: 100%; }`
    },

    // --- 1. תפריטים וניווט ---
    'side_nav': {
        label: '⚓ תפריט צד (Side Nav)',
        fields: [
            new UI.inputRow({ label: 'צבע רקע', input: new UI.input.color({ prop: 'bg', defaultValue: '#2c3e50', hasGradient: true }) }),
            new UI.inputRow({ label: 'רוחב', input: new UI.input.number({ prop: 'w', defaultValue: 250, unit: 'px' }) })
        ],
        html: (d) => `<aside id="${d.id}"><nav><ul><li>בית</li><li>שירותים</li><li>צור קשר</li></ul></nav></aside>`,
        css: (d) => `#${d.id} { width: ${d.w}px; background: ${d.bg}; color: white; height: 100%; padding: 20px; } #${d.id} ul { list-style: none; padding: 0; } #${d.id} li { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }`
    },

    // --- 2. כותרות מיוחדות ---
    'gradient_text': {
        label: '🌈 כותרת גרדיאנט',
        fields: [
            new UI.inputRow({ label: 'טקסט', input: new UI.input.text({ prop: 't', placeholder: 'כותרת נוצצת' }) }),
            new UI.inputRow({ label: 'צבע 1', input: new UI.input.color({ prop: 'c1', defaultValue: '#ff00cc', hasGradient: false }) }),
            new UI.inputRow({ label: 'צבע 2', input: new UI.input.color({ prop: 'c2', defaultValue: '#3333ff', hasGradient: false }) })
        ],
        html: (d) => `<h1 id="${d.id}">${d.t}</h1>`,
        css: (d) => `#${d.id} { background: linear-gradient(to right, ${d.c1}, ${d.c2}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 60px; font-weight: 900; }`
    },

    // --- 3. גריד גלריה ---
    'photo_grid': {
        label: '🖼️ גלריית תמונות (גריד)',
        fields: [
            new UI.inputRow({ label: 'מספר עמודות', input: new UI.input.number({ prop: 'cols', defaultValue: 3 }) }),
            new UI.inputRow({ label: 'מרווח', input: new UI.input.number({ prop: 'gap', defaultValue: 10, unit: 'px' }) })
        ],
        html: (d) => `<div id="${d.id}">${Array(6).fill('<div class="img-placeholder"></div>').join('')}</div>`,
        css: (d) => `#${d.id} { display: grid; grid-template-columns: repeat(${d.cols}, 1fr); gap: ${d.gap}; } .img-placeholder { background: #ddd; aspect-ratio: 1; border-radius: 4px; }`
    },

    // --- 4. כרטיס מחיר ---
    'price_card': {
        label: '💰 כרטיס חבילה',
        fields: [
            new UI.inputRow({ label: 'שם חבילה', input: new UI.input.text({ prop: 'name', placeholder: 'Premium' }) }),
            new UI.inputRow({ label: 'מחיר', input: new UI.input.text({ prop: 'price', placeholder: '99' }) }),
            new UI.inputRow({ label: 'צבע דומיננטי', input: new UI.input.color({ prop: 'clr', defaultValue: '#e67e22', hasGradient: false }) })
        ],
        html: (d) => `<div id="${d.id}"><h3>${d.name}</h3><div class="p">₪${d.price}</div><button>בחר חבילה</button></div>`,
        css: (d) => `#${d.id} { border: 2px solid ${d.clr}; padding: 30px; border-radius: 12px; text-align: center; } #${d.id} .p { font-size: 40px; font-weight: bold; margin: 15px 0; color: ${d.clr}; } #${d.id} button { background: ${d.clr}; color: white; border: none; padding: 10px 20px; border-radius: 6px; }`
    },

    // --- 5. התראות (Alerts) ---
    'alert_box': {
        label: '⚠️ תיבת התראה',
        fields: [
            new UI.inputRow({ label: 'הודעה', input: new UI.input.text({ prop: 'm', placeholder: 'פעולה בוצעה בהצלחה' }) }),
            new UI.inputRow({ label: 'סוג', input: new UI.input.select({ prop: 'type', options: [{ value: '#d4edda', text: 'הצלחה' }, { value: '#f8d7da', text: 'שגיאה' }] }) })
        ],
        html: (d) => `<div id="${d.id}">${d.m}</div>`,
        css: (d) => `#${d.id} { background: ${d.type}; padding: 15px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); color: #333; font-weight: bold; }`
    },

    // --- 6. כפתור צף (FAB) ---
    'fab_button': {
        label: '🔘 כפתור צף (WhatsApp)',
        fields: [
            new UI.inputRow({ label: 'אייקון/טקסט', input: new UI.input.text({ prop: 't', placeholder: '💬' }) }),
            new UI.inputRow({ label: 'צבע', input: new UI.input.color({ prop: 'bg', defaultValue: '#25d366', hasGradient: true }) })
        ],
        html: (d) => `<div id="${d.id}">${d.t}</div>`,
        css: (d) => `#${d.id} { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background: ${d.bg}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); cursor: pointer; z-index: 1000; }`
    },

    // --- 7. מחוון (Tooltip) ---
    'tooltip_box': {
        label: '💬 תיבת מידע (Tooltip)',
        fields: [
            new UI.inputRow({ label: 'טקסט', input: new UI.input.text({ prop: 't', placeholder: 'מידע נוסף כאן' }) })
        ],
        html: (d) => `<div id="${d.id}">${d.t}</div>`,
        css: (d) => `#${d.id} { position: relative; display: inline-block; padding: 5px 12px; background: #333; color: white; border-radius: 4px; font-size: 12px; } #${d.id}::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: #333 transparent transparent transparent; }`
    },

    // --- 8. פס התקדמות מעוגל ---
    'circular_progress': {
        label: '🔄 מחוון טעינה (Spinner)',
        fields: [
            new UI.inputRow({ label: 'גודל', input: new UI.input.number({ prop: 's', defaultValue: 40, unit: 'px' }) }),
            new UI.inputRow({ label: 'צבע', input: new UI.input.color({ prop: 'c', defaultValue: '#0078d4', hasGradient: false }) })
        ],
        html: (d) => `<div id="${d.id}"></div>`,
        css: (d) => `#${d.id} { width: ${d.s}px; height: ${d.s}px; border: 4px solid #f3f3f3; border-top: 4px solid ${d.c}; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`
    },

    // --- 9. כרטיס פרופיל ---
    'profile_card': {
        label: '👤 כרטיס איש צוות',
        fields: [
            new UI.inputRow({ label: 'שם', input: new UI.input.text({ prop: 'n', placeholder: 'יוסי כהן' }) }),
            new UI.inputRow({ label: 'תפקיד', input: new UI.input.text({ prop: 'j', placeholder: 'מעצב' }) })
        ],
        html: (d) => `<div id="${d.id}"><div class="avatar"></div><h4>${d.n}</h4><p>${d.j}</p></div>`,
        css: (d) => `#${d.id} { text-align: center; padding: 20px; background: white; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); } #${d.id} .avatar { width: 80px; height: 80px; background: #eee; border-radius: 50%; margin: 0 auto 10px; }`
    },

    // --- 10. טופס חיפוש ---
    'search_bar': {
        label: '🔍 שורת חיפוש',
        fields: [
            new UI.inputRow({ label: 'טקסט פלייסהולדר', input: new UI.input.text({ prop: 'p', placeholder: 'חפש באתר...' }) })
        ],
        html: (d) => `<div id="${d.id}"><input type="text" placeholder="${d.p}"><button>🔍</button></div>`,
        css: (d) => `#${d.id} { display: flex; border: 1px solid #ddd; border-radius: 25px; overflow: hidden; background: white; } #${d.id} input { border: none; padding: 10px 20px; flex: 1; outline: none; } #${d.id} button { border: none; background: none; padding: 0 15px; cursor: pointer; }`
    },

    // --- 11. באנר מספרים (Stats) ---
    'stats_counter': {
        label: '📊 מונה מספרים',
        fields: [
            new UI.inputRow({ label: 'מספר', input: new UI.input.text({ prop: 'num', placeholder: '1,500' }) }),
            new UI.inputRow({ label: 'תווית', input: new UI.input.text({ prop: 'lbl', placeholder: 'לקוחות מרוצים' }) })
        ],
        html: (d) => `<div id="${d.id}"><strong>${d.num}</strong><span>${d.lbl}</span></div>`,
        css: (d) => `#${d.id} { text-align: center; } #${d.id} strong { display: block; font-size: 32px; color: #0078d4; } #${d.id} span { color: #666; font-size: 14px; }`
    },

    // --- 12. רשימת תגים ---
    'tag_cloud': {
        label: '🏷️ ענן תגיות',
        fields: [
            new UI.inputRow({ label: 'צבע תג', input: new UI.input.color({ prop: 'bg', defaultValue: '#ecf0f1', hasGradient: true }) })
        ],
        html: (d) => `<div id="${d.id}"><span>JS</span><span>CSS</span><span>HTML</span><span>React</span></div>`,
        css: (d) => `#${d.id} { display: flex; flex-wrap: wrap; gap: 8px; } #${d.id} span { background: ${d.bg}; padding: 5px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; }`
    },

    // --- 13. טופס כניסה (Login) ---
    'login_form': {
        label: '🔐 טופס התחברות',
        fields: [
            new UI.inputRow({ label: 'צבע כפתור', input: new UI.input.color({ prop: 'btn', defaultValue: '#3498db', hasGradient: true }) })
        ],
        html: (d) => `<div id="${d.id}"><input type="email" placeholder="אימייל"><input type="password" placeholder="סיסמה"><button>התחבר</button></div>`,
        css: (d) => `#${d.id} { display: flex; flex-direction: column; gap: 10px; max-width: 300px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); } #${d.id} input { padding: 10px; border: 1px solid #ddd; border-radius: 4px; } #${d.id} button { background: ${d.btn}; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; }`
    },

    // --- 14. מפת גוגל (Placeholder) ---
    'google_map': {
        label: '📍 מפה (מקום שמור)',
        fields: [
            new UI.inputRow({ label: 'גובה', input: new UI.input.number({ prop: 'h', defaultValue: 300, unit: 'px' }) })
        ],
        html: (d) => `<div id="${d.id}"><div class="map-p">כאן תופיע המפה</div></div>`,
        css: (d) => `#${d.id} .map-p { height: ${d.h}px; background: #e5e3df; display: flex; align-items: center; justify-content: center; color: #666; border: 1px solid #ccc; }`
    },

    // --- 15. כרטיס מוצר (E-commerce) ---
    'product_card': {
        label: '🛒 כרטיס מוצר',
        fields: [
            new UI.inputRow({ label: 'שם מוצר', input: new UI.input.text({ prop: 'n', placeholder: 'נעלי ריצה' }) }),
            new UI.inputRow({ label: 'מחיר', input: new UI.input.text({ prop: 'p', placeholder: '299' }) })
        ],
        html: (d) => `<div id="${d.id}"><div class="img"></div><h4>${d.n}</h4><div class="price">₪${d.p}</div><button>הוסף לסל</button></div>`,
        css: (d) => `#${d.id} { width: 200px; padding: 15px; border: 1px solid #eee; border-radius: 8px; text-align: center; } #${d.id} .img { height: 150px; background: #f9f9f9; margin-bottom: 10px; } #${d.id} button { width: 100%; padding: 8px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; }`
    },

    // --- 16. נגן אודיו ---
    'audio_player': {
        label: '🎵 נגן מוזיקה',
        fields: [
            new UI.inputRow({ label: 'צבע', input: new UI.input.color({ prop: 'c', defaultValue: '#e74c3c', hasGradient: false }) })
        ],
        html: (d) => `<div id="${d.id}">▶ ───────── 🔊</div>`,
        css: (d) => `#${d.id} { background: #333; color: ${d.c}; padding: 15px; border-radius: 50px; display: flex; justify-content: space-around; width: 250px; cursor: pointer; }`
    },

    // --- 17. כותרת עליונה דביקה ---
    'sticky_header': {
        label: '🔝 סרגל עליון דביק',
        fields: [
            new UI.inputRow({ label: 'גובה', input: new UI.input.number({ prop: 'h', defaultValue: 60, unit: 'px' }) })
        ],
        html: (d) => `<header id="${d.id}">לוגו | תפריט</header>`,
        css: (d) => `#${d.id} { position: sticky; top: 0; height: ${d.h}px; width: 100%; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; align-items: center; padding: 0 20px; z-index: 100; }`
    },

    // --- 18. קרוסלת תוכן (סקיצה) ---
    'content_slider': {
        label: '🎞️ סליידר (סקיצה)',
        fields: [
            new UI.inputRow({ label: 'גובה', input: new UI.input.number({ prop: 'h', defaultValue: 400, unit: 'px' }) })
        ],
        html: (d) => `<div id="${d.id}"><div class="slide">שקופית 1</div><div class="dots"><span></span><span></span></div></div>`,
        css: (d) => `#${d.id} { height: ${d.h}px; background: #34495e; color: white; display: flex; align-items: center; justify-content: center; position: relative; } #${d.id} .dots { position: absolute; bottom: 20px; display: flex; gap: 5px; } #${d.id} span { width: 10px; height: 10px; background: white; border-radius: 50%; opacity: 0.5; }`
    },

    // --- 19. באנר הנחה (Coupon) ---
    'coupon_banner': {
        label: '✂️ קופון הנחה',
        fields: [
            new UI.inputRow({ label: 'קוד', input: new UI.input.text({ prop: 'code', placeholder: 'SALE20' }) }),
            new UI.inputRow({ label: 'צבע', input: new UI.input.color({ prop: 'c', defaultValue: '#f1c40f', hasGradient: false }) })
        ],
        html: (d) => `<div id="${d.id}">קוד קופון: <span>${d.code}</span></div>`,
        css: (d) => `#${d.id} { border: 2px dashed ${d.c}; padding: 10px 20px; display: inline-block; background: #fffdf0; border-radius: 8px; } #${d.id} span { font-weight: bold; color: ${d.c}; }`
    },

    // --- 20. צ'אט בועה (Chat bubble) ---
    'chat_bubble': {
        label: '💬 בועת צ\'אט',
        fields: [
            new UI.inputRow({ label: 'טקסט', input: new UI.input.text({ prop: 't', placeholder: 'היי, איך אפשר לעזור?' }) })
        ],
        html: (d) => `<div id="${d.id}">${d.t}</div>`,
        css: (d) => `#${d.id} { background: #0078d4; color: white; padding: 10px 15px; border-radius: 15px 15px 0 15px; max-width: 200px; font-size: 14px; position: relative; }`
    }


};

