// @ts-check

export class UIComponent {
    /** @param {Object} config */
    constructor(config = {}) {
        this.config = config;
    }

    /** @param {HTMLElement} el; @returns {HTMLElement} */
    applyBaseAttributes(el) {
        const config = this.config.details;
        if (!config) return el;
        if (config.id) el.id = config.id;
        // @ts-ignore
        if (config.class) config.class.split(' ').forEach(cls => el.addClass(cls));
        if (config.style) el.style.cssText = config.style;

        if (config.prop && !config.skipProp) {
            el.dataset.property = config.prop;
        }
        return el;
    }

    /** @returns {HTMLElement} */
    build() { throw new Error("Must implement build()"); }
}