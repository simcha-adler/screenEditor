const nav = $('main-nav');
const toolbar = $('toolbar');
const editor = $('דף_הבסיס');
const sidebar = $('sidebar');
const panelArea = $('panel-area');
const panels = $('panels');
const panelTree = $('panel-tree');
const tree = $('tree-body');
let sheet = $('styles').sheet;
let theElement = null;
let theStyles = null;
let thePanel = null;
let openedMenu = null;
let styleState = {};


/*======*/

let userSettings = {
    theme: 'light',       // 'light' או 'dark' (ממשק העורך)
    showOutlines: false,  // האם להציג גבולות לכל האלמנטים בדף (לעזרה בעיצוב)
    autoSave: true,       // האם לשמור אוטומטית
    language: 'he',       // שפת ממשק
    uiScale: 100          // גודל ממשק (זום)
};