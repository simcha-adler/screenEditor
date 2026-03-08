

/*======================================
            פונקציות הרופא
========================================*/

/**
 * הרופא של האלמנטים
 * @param {HTMLElement} element
 * @returns {Array} רשימת אבחנות
 */
function diagnoseElement(element) {
    if (!element) return [];

    const issues = [];
    const styles = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const parent = element.parentElement;
    const parentStyles = parent ? getComputedStyle(parent) : null;
    const parentRect = parent ? parent.getBoundingClientRect() : null;

    // פונקציית עזר להוספה מהירה
    const addIssue = (icon, title, desc) => {
        issues.push({ icon, title, desc });
    };

    // --- 1. חריגות וגלילה ---
    if (element.scrollHeight > element.clientHeight + 1 && styles.overflowY === 'hidden') {
        addIssue('✂️', 'תוכן נחתך', 'יש בתוך האלמנט יותר תוכן מהגובה שלו, והגדרת overflow: hidden. חלק מהתוכן מוסתר.');
    }
    if (element.scrollHeight > element.clientHeight + 1 && (styles.overflowY === 'visible' || styles.overflowY === '')) {
        addIssue('📏', 'תוכן גולש', ' יש בתוך האלמנט יותר תוכן מהגובה שלו והוא גולש למטה. נסה לשנות את הגדרות הגלישה');
    }
    if (parent && rect.width > parentRect.width) {
        addIssue('📏', 'חריגה מהרוחב', 'האלמנט הזה רחב יותר מהאבא שלו, ולכן הוא "בורח" החוצה. נסה לשנות את הגדרות הגלישה להגדרה הרצויה.');
    }

    // --- 2. בעיות מיקום (Position) ---
    if (styles.position === 'absolute' && parent) {
        const posParent = element.offsetParent;
        if (posParent !== parent) {
            addIssue('📍', 'Absolute ללא גבולות', `האלמנט מוגדר כ-Absolute, אבל האבא שלו לא מוגדר כ-Relative (או Fixed/Absolute).
                 האלמנט מתמקם ביחס ל${(posParent.id ?? posParent.tagName) + posParent.className} ולא ביחס לאבא.`);
        }
    }
    if (styles.position === 'fixed' && styles.transform !== 'none') {
        addIssue('🐛', 'התנגשות Fixed ו-Transform', 'יש לאלמנט הזה (או לאבא שלו) Transform ביחד עם Position Fixed. זה גורם ל-Fixed להפסיק לעבוד ביחס למסך.');
    }
    if (styles.position === 'sticky') {
        let ancestor = parent;
        while (ancestor && ancestor !== document.body) {
            const s = getComputedStyle(ancestor);
            if (s.overflow !== 'visible' && s.overflow !== '') {
                addIssue('📌', 'הגדרת דביק לא פעילה', 'הגדרת Sticky (דביק), אבל זה לא יעבוד. לאחד ההורים של האלמנט יש הגדרת גלילה (Overflow) שחוסמת את ההדבקה.');
                break;
            }
            ancestor = ancestor.parentElement;
        }
    }
    if (styles.zIndex !== 'auto' && styles.position === 'static') {
        addIssue('🥞', 'פרמטר שכבות לא פעיל', 'נתת לאלמנט Z-Index (שכבות), אבל לא שינית את ה-Position שלו. Z-Index עובד רק על אלמנטים עם Position (כמו Relative, Absolute, Fixed).');
    }


    // --- 3. בעיות תצוגה (Display & Visibility) ---
    if (styles.display === 'inline' && (styles.width !== 'auto' || styles.marginTop !== '0px')) {
        addIssue('🚫', 'Inline לא מקבל גודל', 'אלמנט מסוג Inline מתעלם מהגדרות רוחב, גובה ושוליים אנכיים. שנה ל-Block או Inline-Block.');
    }
    if (styles.opacity === '0' || styles.visibility === 'hidden') {
        addIssue('👻', 'האלמנט מוסתר', 'האלמנט קיים בדף אבל הוא בלתי נראה (Opacity 0 או Hidden).');
    }
    if (styles.width === '100%' && styles.padding !== '0px' && styles.boxSizing === 'content-box') {
        addIssue('📦', 'רוחב 100% + פדינג', 'נתת לאלמנט רוחב 100% וגם ריווח פנימי (Padding), אבל ה-Box Sizing הוא ברירת מחדל (Content-Box). זה גורם לאלמנט להיות רחב יותר מהאבא שלו. שנה את Box Sizing ל-Border-Box.');
    }
    if (parent &&
        styles.marginTop !== '0px' &&
        element === parent.children[0] &&
        parentStyles.paddingTop === '0px' &&
        parentStyles.borderTopWidth === '0px' &&
        styles.position === 'static' &&
        parentStyles.display === 'block') {
        addIssue('🔻', 'קריסת שוליים', 'נתת שוליים עליונים (Margin Top), אבל הם "דוחפים" את האבא למטה במקום להתרחק ממנו. זה קורה כי לאבא אין גבול (Border) או פדינג עליון. נסה לתת לאבא overflow: auto או להוסיף לו פדינג שקוף קטן.');
    }
    if (styles.textOverflow === 'ellipsis') {
        if (styles.whiteSpace !== 'nowrap') {
            addIssue('📝', 'שלוש נקודות לא עובדות', 'הגדרת text-overflow: ellipsis, אבל שכחת להגדיר white-space: nowrap. בלי זה, הטקסט פשוט ירד שורה במקום להיחתך.');
        }
        else if (styles.overflow !== 'hidden' && styles.overflow !== 'scroll' && styles.overflow !== 'auto') {
            addIssue('✂️', 'שלוש נקודות ללא Overflow', 'כדי ששלוש הנקודות יופיעו, חייבים להגדיר overflow: hidden (או auto), אחרת הטקסט פשוט ימשיך לצאת החוצה.');
        }
    }
    if (styles.background !== 'none' && element.clientHeight === 0) {
        addIssue('🖼️', 'רקע באלמנט ריק', 'הגדרת רקע, אבל הגובה של האלמנט הוא 0 ולכן לא רואים כלום. לאלמנטים ללא תוכן חייבים לתת גובה מוגדר (height) או פדינג.');
    }



    // --- 4. אינטראקציה ---
    if (styles.pointerEvents === 'none') {
        addIssue('🖱️', 'לא ניתן ללחיצה', 'הוגדר pointer-events: none. אי אפשר יהיה ללחוץ על האלמנט הזה או לסמן טקסט בתוכו.');
    }
    if (element.tagName === 'BUTTON' && !element.hasAttribute('type') && parent.tagName === 'FORM') {
        addIssue('⚠️', 'כפתור בתוך טופס', 'זהו כפתור בתוך טופס ללא type="button". ברירת המחדל היא לשלוח את הטופס (Submit) ולרענן את הדף בלחיצה.');
    }

    // --- 5. תמונות ומדיה ---
    if (element.tagName === 'IMG') {
        // בדיקת יחס רוחב/גובה (Aspect Ratio)
        const naturalRatio = element.naturalWidth / element.naturalHeight;
        const renderedRatio = rect.width / rect.height;
        // אם יש סטייה של יותר מ-10% ביחס
        if (Math.abs(naturalRatio - renderedRatio) > 0.1 && styles.objectFit === 'fill') {
            addIssue('🖼️', 'תמונה מרוחה/מעוותת', 'הפרופורציות של התמונה נשברו כי הגדרת גובה ורוחב שלא תואמים למקור. נסה להשתמש ב-object-fit: cover.');
        }
    }

    // --- 6. Flexbox ---
    if (parentStyles && parentStyles.display === 'flex') {
        if (styles.flexShrink !== '0' && rect.width < parseFloat(styles.width || 0)) {
            addIssue('🤏', 'האלמנט נמעך', 'האלמנט נמצא בתוך Flexbox ואין לו מקום, אז הוא מתכווץ. תן לו flex-shrink: 0 כדי לשמור על הגודל שלו.');
        }
    }

    // --- בדיקת הצלחה ---
    if (issues.length === 0) {
        // מחזירים אובייקט מיוחד של הצלחה
        return [{
            icon: '✅',
            title: 'הכל נראה תקין!',
            desc: 'לא מצאנו בעיות נפוצות ב-CSS של האלמנט הזה. עבודה טובה!',
            isSuccess: true
        }];
    }

    return issues;
}




export function showDiagnosisUI(element) {
    // 1. קודם כל מנקים חלוניות ישנות אם פתוחות
    const existing = $1('.diagnosis-card');
    if (existing) existing.remove();

    // 2. מריצים את האבחון
    const results = diagnoseElement(element);

    // 3. יוצרים את ה-HTML
    const card = createElement('div', { class: 'diagnosis-card' });
    const header = createElement('div', {
        class: 'diagnosis-header',
        in: `<span>👨‍⚕️ דוח אבחון לאלמנט</span>
            <span class="diagnosis-close">×</span>`
    });
    const list = createElement('div', { class: 'diagnosis-list' });

    results.forEach(item => {
        const itemEl = createElement('div', {
            class: `diagnosis-item ${item.isSuccess ? 'success' : ''}`,
            in: `<div class="diagnosis-icon">${item.icon}</div>
                <div class="diagnosis-content">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
                </div>`
        });
        list.appendChild(itemEl);
    });

    card.append(header, list);
    document.body.appendChild(card);

    // 4. סגירה בלחיצה
    card.$1('.diagnosis-close').onclick = () => card.remove();

    // אופציונלי: סגירה אוטומטית אחרי 8 שניות אם הכל תקין
    if (results[0].isSuccess) {
        const tip = createElement('div', {
            class: 'tip',
            in: `<p>עדיין נתקל בבעיה? נסה להפעיל את האבחון על האבא או על הבן הבעייתי של האלמנט!</p>`
        });
        tip.into(card);
        setTimeout(() => {
            if (document.body.contains(card)) card.remove();
        }, 8000);
    }
}
