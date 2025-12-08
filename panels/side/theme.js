const htmlTheme = /* html */ `

    <h4>צבעי נושא גלובליים (CSS Variables)</h4>
    <p style="font-size: 12px; margin-top: -10px; color: #555;">שינויים כאן משפיעים על כל האתר שמשתמש במשתני הנושא.</p>

    <label class="design-control">
        <span>גוון ראשי (Hue)</span>
        <input type="range" min="0" max="360" value="200" id="themeHue" 
            data-css-var="--theme-hue" data-default="200"
            style="width: 150px; cursor: ew-resize;">
        <span id="hueValueDisplay">200</span>
    </label>

    <label class="design-control">
        <span>רוויה (Saturation)</span>
        <input type="range" min="0" max="100" value="100" id="themeSaturation" 
            data-css-var="--theme-sat" data-default="100"
            style="width: 150px; cursor: ew-resize;">
        <span id="satValueDisplay">100%</span>
    </label>

    <h4 style="margin-top: 15px;">דוגמאות לשימוש (HSL)</h4>
    <div style="display: flex; gap: 10px; text-align: center;">
        <div style="flex-grow: 1; height: 50px; line-height: 50px; font-size: 11px; color: white; border-radius: 4px; background: hsl(var(--theme-hue), var(--theme-sat), 50%);">
            צבע ראשי (50%)
        </div>
        <div style="flex-grow: 1; height: 50px; line-height: 50px; font-size: 11px; color: #333; border-radius: 4px; background: hsl(var(--theme-hue), var(--theme-sat), 90%);">
            צבע בהיר (90%)
        </div>
    </div>

<style>
/* CSS להצגת הגוונים על גבי הסליידר (רק Hue) */
#themeHue {
    -webkit-appearance: none;
    background: linear-gradient(to right, 
        hsl(0, 100%, 50%), 
        hsl(60, 100%, 50%), 
        hsl(120, 100%, 50%), 
        hsl(180, 100%, 50%), 
        hsl(240, 100%, 50%), 
        hsl(300, 100%, 50%), 
        hsl(360, 100%, 50%));
    height: 10px;
    border-radius: 5px;
}
/* הסתרת המראה המקורי של הסליידר */
#themeHue::-webkit-slider-thumb { -webkit-appearance: none; }
</style>
`;

htmlTheme.into($('panel-theme'));

function loadThemePanel() {
    attachThemeListeners();
    fillCorrectTheme();
}

function fillCorrectTheme() {
    const rootStyles = getComputedStyle(document.documentElement);
    const hueSlider = $('themeHue');
    const satSlider = $('themeSaturation');

    // קורא את הערך הנוכחי של המשתנה מה-DOM (אם הוגדר)
    const currentHue = parseInt(rootStyles.getPropertyValue('--theme-hue')) || parseInt(hueSlider.dataset.default);
    const currentSat = parseInt(rootStyles.getPropertyValue('--theme-sat')) || parseInt(satSlider.dataset.default);

    hueSlider.value = currentHue;
    $('hueValueDisplay').textContent = currentHue;

    satSlider.value = currentSat;
    $('satValueDisplay').textContent = currentSat + '%';
}

function attachThemeListeners() {
    const hueSlider = $('themeHue');
    const satSlider = $('themeSaturation');

    // מאזין לשינוי גוון (Hue)
    hueSlider.when('input', (e) => {
        const val = e.target.value;
        $('hueValueDisplay').textContent = val;
        // 1. עדכון המשתנה ב-DOM (לצפייה מיידית)
        document.documentElement.style.setProperty(e.target.dataset.cssVar, val);
        // 2. שמירה ל-StyleState (להורדה ושימור)
        updateStyle(':root', e.target.dataset.cssVar, val);
    });

    // מאזין לשינוי רוויה (Saturation)
    satSlider.when('input', (e) => {
        const val = e.target.value;
        $('satValueDisplay').textContent = val + '%';
        // 1. עדכון המשתנה ב-DOM
        document.documentElement.style.setProperty(e.target.dataset.cssVar, val + '%');
        // 2. שמירה ל-StyleState
        updateStyle(':root', e.target.dataset.cssVar, val + '%');
    });
}

loadThemePanel();