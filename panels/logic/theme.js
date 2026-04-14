
// ניהול רשימת הקישורים
function saveLink(selector, prop, themeId, val) {
    // הסר ישן אם קיים
    removeLink(selector, prop);
    themeLinks.push({
        selector: selector,
        prop: prop,
        themeId: themeId,
        relativeValue: parseFloat(val)
    });
}

function removeLink(selector, prop) {
    themeLinks = themeLinks.filter(l => !(l.selector === selector && l.prop === prop));
}

// פונקציה שנקראת כשעורכים טווח בפאנל הראשי - מעדכנת את כל המקושרים
function updateAllLinkedElements(themeId) {
    const theme = themeDefinitions.find(t => t.id === themeId);
    if (!theme) return;

    themeLinks.forEach(link => {
        if (link.themeId === themeId) {
            // חישוב מחדש של הצבע לפי המיקום היחסי השמור
            let finalColor;
            const p = link.relativeValue;

            if (theme.type === '1d') {
                finalColor = Color.mixColors(theme.anchors[0], theme.anchors[1], p);
            } else {
                if (p <= 50) finalColor = Color.mixColors(theme.anchors[0], theme.anchors[1], p * 2);
                else finalColor = Color.mixColors(theme.anchors[1], theme.anchors[2], (p - 50) * 2);
            }

            updateStyle(link.selector, link.prop, finalColor);
        }
    });
}

// "זיכרון" של קשרים: איזה אלמנט קשור לאיזה טווח, ומה המיקום היחסי שלו
// מבנה: { selector: '#myDiv', prop: 'backgroundColor', themeId: 't1', relativeValue: 25 }
let themeLinks = [];


// משתנה גלובלי לשמירת הגדרות הנושא
let themeDefinitions = [];
// מבנה: { id: 't1', name: 'Primary Gradient', type: '1d', anchors: ['#0000ff', '#ff0000'] }


function renderThemeList() {
    const list = $('themeItemsList');
    list.innerHTML = '';
    themeDefinitions.forEach(item => {
        const div = createElement('div', { class: 'color-item' });

        // יצירת תצוגה מקדימה (Gradient Bar)
        let backgroundStyle = '';
        if (item.type === '1d') {
            backgroundStyle = `background: linear-gradient(to right, ${item.anchors.join(', ')});`;
        } else if (item.type === '2d') {
            // ל-2D נשתמש ב-3 צבעים (למשל משולש או פינות)
            backgroundStyle = `background: linear-gradient(135deg, ${item.anchors[0]}, ${item.anchors[1]}), linear-gradient(to bottom, transparent, ${item.anchors[2]}); background-blend-mode: multiply;`;
        }

        div.innerHTML = `
            <div class="color-header" onclick="openThemeEditor('${item.id}')">
                <span>${item.name}</span>
                <div style="width: 50px; height: 15px; border-radius: 3px; ${backgroundStyle}"></div>
            </div>
        `;
        list.appendChild(div);
    });
}

// --- עורך הטווחים (Editor) ---
function openThemeEditor(editId = null) {
    let config = editId
        ? themeDefinitions.find(c => c.id === editId)
        : { id: 'theme_' + Date.now(), name: 'טווח חדש', type: '1d', anchors: ['#0000FF', '#FF0000'] };

    // שכפול עמוק כדי לא לשנות ישר
    config = JSON.parse(JSON.stringify(config));

    const overlay = $('themeEditorOverlay');
    overlay.style.display = 'flex'; // הנחה שיש CSS מתאים (כמו בקוד הקודם)

    const renderEditor = () => {
        let anchorsHtml = '';
        // דרישה ב': בחירת גוונים שיוצרים טווח
        config.anchors.forEach((color, idx) => {
            anchorsHtml += `
                <div class="anchor-control" style="display:flex; align-items:center; margin-bottom:5px;">
                    <span style="width:60px;">גוון ${idx + 1}:</span>
                    <input type="color" value="${color}" data-idx="${idx}" class="anchor-picker">
                </div>`;
        });

        overlay.innerHTML = `
            <div class="builder-modal">
                <h3>עריכת טווח</h3>
                <label>שם הטווח</label>
                <input type="text" id="themeName" value="${config.name}" style="width:100%; margin-bottom:10px;">
                
                <label>סוג</label>
                <select id="themeType" style="width:100%; margin-bottom:15px;">
                    <option value="1d" ${config.type === '1d' ? 'selected' : ''}>טווח לינארי (2 גוונים)</option>
                    <option value="2d" ${config.type === '2d' ? 'selected' : ''}>משטח (3 גוונים)</option>
                </select>

                <div id="anchorsContainer">${anchorsHtml}</div>

                <div class="preview-box" style="height:40px; margin:15px 0; border:1px solid #ccc; border-radius:4px; ${getPreviewStyle(config)}"></div>

                <div style="display:flex; gap:10px; margin-top: 20px;">
                    <button id="btnSaveTheme" class="btn-primary" style="margin: 0;">שמור</button>
                    <button id="btnCancelTheme" style="background:#ccc;">ביטול</button>
                </div>
            </div>
        `;

        // Listeners
        overlay.$('themeName').when('input', (e) => config.name = e.target.value);
        overlay.$('themeType').when('change', (e) => {
            config.type = e.target.value;
            // איפוס עוגנים לפי סוג
            config.anchors = config.type === '1d' ? ['#0000FF', '#FF0000'] : ['#0000FF', '#FF0000', '#00FF00'];
            renderEditor();
        });

        overlay.$$('.anchor-picker').forEach(input => {
            input.when('input', (e) => {
                config.anchors[e.target.dataset.idx] = e.target.value;
                overlay.$1('.preview-box').style = getPreviewStyle(config);
            });
        });

        overlay.$('btnSaveTheme').whenClick(() => {
            saveThemeConfig(config, editId);
            overlay.innerHTML = '';
            renderThemeList();
            buildDesignPanel();
        });

        overlay.$('btnCancelTheme').whenClick(() => overlay.innerHTML = '');
    };

    renderEditor();
}

function getPreviewStyle(config) {
    if (config.type === '1d') {
        return `background: linear-gradient(to right, ${config.anchors.join(', ')});`;
    }
    // מימוש פשוט ל-2D עם 3 צבעים (Gradient Mesh מזויף)
    return `background: linear-gradient(to right, ${config.anchors[0]}, ${config.anchors[1]}), linear-gradient(to top, ${config.anchors[2]}, transparent); background-blend-mode: screen;`;
}

function saveThemeConfig(newConfig, isEdit) {
    if (isEdit) {
        const idx = themeDefinitions.findIndex(t => t.id === newConfig.id);
        themeDefinitions[idx] = newConfig;
    } else {
        themeDefinitions.push(newConfig);
        refreshThemes();
    }
    // דרישה ג' חלק 2: עדכון כל האלמנטים התלויים בטווח
    updateAllLinkedElements(newConfig.id);
}

