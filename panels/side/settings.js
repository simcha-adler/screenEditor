const htmlSettings = /* html */ `

    <h4>הגדרות מערכת (System Preferences)</h4>
    <p style="font-size: 12px; margin-top: -10px; color: #555;">התאם אישית את סביבת העבודה שלך.</p>

    <div class="panel-section">
        <div class="section-header">מראה וממשק</div>
        <div class="section-content">
            <label class="design-control">
                <span>מצב כהה (Dark Mode)</span>
                <input type="checkbox" id="settingDarkMode" class="toggle-input">
                <label for="settingDarkMode" class="toggle-switch"></label>
            </label>

            <label class="design-control">
                <span>גודל ממשק (%)</span>
                <input type="number" id="settingUiScale" min="70" max="150" step="5" value="100" style="width:60px;">
            </label>
        </div>
    </div>

    <div class="panel-section">
        <div class="section-header">עזרי עריכה</div>
        <div class="section-content">
            <label class="design-control">
                <span>הצג גבולות אלמנטים</span>
                <input type="checkbox" id="settingOutlines">
            </label>
            <p style="font-size:10px; color:#888; margin-top:0;">מסמן בקו מקווקו את כל האלמנטים בדף.</p>
        </div>
    </div>

    <div class="panel-section">
        <div class="section-header">מערכת</div>
        <div class="section-content">
            <label class="design-control">
                <span>שמירה אוטומטית</span>
                <input type="checkbox" id="settingAutoSave">
            </label>
            
            <button id="btnResetSettings" style="margin-top:15px; width:100%; background:#f0f0f0; border:1px solid #ccc; padding:8px; border-radius:4px; cursor:pointer; color:#d32f2f;">
                אפס הגדרות ברירת מחדל
            </button>
        </div>
    </div>
`;

function loadSettingsPanel() {
    $('panel-settings').innerHTML = htmlSettings;
    initAccordions($('panel-settings')); // שימוש בפונקציה מהשלבים הקודמים

    // מילוי הערכים הנוכחיים
    $('settingDarkMode').checked = userSettings.theme === 'dark';
    $('settingUiScale').value = userSettings.uiScale;
    $('settingOutlines').checked = userSettings.showOutlines;
    $('settingAutoSave').checked = userSettings.autoSave;

    attachSettingsListeners();
}

function attachSettingsListeners() {
    // מצב כהה
    $('settingDarkMode').when('change', (e) => {
        userSettings.theme = e.target.checked ? 'dark' : 'light';
        applyUserSettings(); // החלת השינוי מיידית
        saveUserSettings();  // שמירה לזיכרון
    });

    // גבולות עזר
    $('settingOutlines').when('change', (e) => {
        userSettings.showOutlines = e.target.checked;
        applyUserSettings();
        saveUserSettings();
    });

    // סקייל ממשק
    $('settingUiScale').when('input', (e) => {
        userSettings.uiScale = e.target.value;
        applyUserSettings();
        saveUserSettings();
    });

    // שמירה אוטומטית
    $('settingAutoSave').when('change', (e) => {
        userSettings.autoSave = e.target.checked;
        saveUserSettings();
    });

    // איפוס
    $('btnResetSettings').whenClick(() => {
        if (confirm('האם לאפס את כל הגדרות המערכת?')) {
            localStorage.removeItem('screenEditor_settings');
            location.reload(); // רענון הדף
        }
    });
}

loadSettingsPanel()