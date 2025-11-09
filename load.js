let nav_html;
let toolbar_html;
let tree_html;
let active_html;
let borders_html;
let design_html;
let view_html;

setTimeout(() => {alert('vvv')}, 5000)

async function load1() {
    const nav_file = await fetch('./panels/nav/panel_content.html');
    nav_html = await nav_file.text();
    $('#main-nav').innerHTML = nav_html;
}

async function load2() {
    const toolbar_file = await fetch('./panels/toolbar/panel_content.html');
    toolbar_html = await toolbar_file.text();
    $('#toolbar').innerHTML = toolbar_html;
}

async function load3() {
    const tree_file = await fetch('./panels/tree/panel_content.html');
    tree_html = await tree_file.text();
}

async function load4() {
    const active_file = await fetch('./panels/active/panel_content.html');
    active_html = await active_file.text();
}

async function load5() {
    const borders_file = await fetch('./panels/borders/panel_content.html');
    borders_html = await borders_file.text();
}

async function load6() {
    const design_file = await fetch('./panels/colors_and_fonts/panel_content.html');
    design_html = await design_file.text();
}

async function load7() {
    const view_file = await fetch('./panels/view_and_position/panel_content.html');
    view_html = await view_file.text();
}

load1();
load2();
load3();
load4();
load5();
load6();
load7();