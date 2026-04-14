//@ts-check

import { UI } from "../components/base.js";

export const elementsList = {
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
        label: '🔘 כפתור קריאה לפעולה',
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
    }
};

