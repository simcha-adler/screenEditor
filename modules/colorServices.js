//@ts-check

// --- Math Helpers ---
/**@param {number} val; @param {number} min; @param {number} max */
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/**@param {number} h; @param {number} s; @param {number} v    */
function hsvToRgb(h, s, v) {
    s /= 100; v /= 100;
    /**@param {number} n; */
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}
/**@param {number} r; @param {number} g; @param {number} b    */
function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0, s = max === 0 ? 0 : d / max, v = max;
    if (max !== min) {
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
    }
    return [h * 360, s * 100, v * 100];
}
/**@param {number} r; @param {number} g; @param {number} b; @param {number} a     */
function rgbToHex(r, g, b, a = 1) {
    let alpha = Math.round(a * 255).toString(16).padStart(2, '0');
    let hex = "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
    return a < 1 ? hex + alpha.toUpperCase() : hex;
}

/**@param {string} hex  */
function hexToRgba(hex) {
    hex = hex.replace(/^#/, '');
    if (![3, 4, 6, 8].includes(hex.length)) return null;
    let r, g, b, a = 1;
    if (hex.length <= 4) {
        r = parseInt(hex[0] + hex[0], 16); g = parseInt(hex[1] + hex[1], 16); b = parseInt(hex[2] + hex[2], 16);
        if (hex.length === 4) a = parseInt(hex[3] + hex[3], 16) / 255;
    } else {
        r = parseInt(hex.substring(0, 2), 16); g = parseInt(hex.substring(2, 4), 16); b = parseInt(hex.substring(4, 6), 16);
        if (hex.length === 8) a = parseInt(hex.substring(6, 8), 16) / 255;
    }
    return [r, g, b, a];
}
/**@param {number} h; @param {number} s; @param {number} v    */
function hsvToHsl(h, s, v) {
    s /= 100; v /= 100;
    let l = v - v * s / 2;
    let sl = (l === 0 || l === 1) ? 0 : (v - l) / Math.min(l, 1 - l);
    return [Math.round(h), Math.round(sl * 100), Math.round(l * 100)];
}
/**@param {number} h; @param {number} s; @param {number} v    */
function hsvToHwb(h, s, v) {
    s /= 100; v /= 100;
    return [Math.round(h), Math.round((1 - s) * v * 100), Math.round((1 - v) * 100)];
}
/**@param {number} h; @param {number} s; @param {number} l    */
function hslToHsv(h, s, l) {
    s /= 100; l /= 100;
    let v = l + s * Math.min(l, 1 - l);
    let sv = v === 0 ? 0 : 2 * (1 - l / v);
    return [h, sv * 100, v * 100];
}
/**@param {number} h; @param {number} w; @param {number} b    */
function hwbToHsv(h, w, b) {
    w /= 100; b /= 100;
    let v = 1 - b;
    let s = v === 0 ? 0 : 1 - w / v;
    return [h, s * 100, v * 100];
}


export const clr = {
    clamp,
    hexToRgba,

    hsvToHsl,
    hsvToHwb,
    hsvToRgb,

    hslToHsv,
    hwbToHsv,

    rgbToHex,
    rgbToHsv,
}

window.clr = clr;