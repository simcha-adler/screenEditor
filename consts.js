// ------------------------------------
// 1. בחירת אלמנטים מרכזיים
// ------------------------------------

const nav = $('main-nav');
const toolbar = $('toolbar');
const editor = $('דף הבסיס');
const sidebar = $('sidebarLeft');
const treeContainer = $('treeContainer');
const toggleTree = $('toggleTree');
const editPanel = $('edit-panel');
let theElement = null;
let theStyles = null;
let thePanel = '';
let openedMenu = null;
let borderElement = '';

//  const designMenu = $('#design-menu-items');
//    const designPanels = $$('#sidebarLeft .design-panel');
