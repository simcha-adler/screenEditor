// @ts-check

import { UIComponent } from "./component.js";

export class UISwitcher extends UIComponent {
    /** @param {objSwitcher} config */
    constructor(config) { super(config); }

    build() {
        const container = createElement('div', { class: 'ui-switcher' });

        if (this.config.options) {
            this.config.options.forEach(opt => {
                const btn = createElement('button', {
                    class: 'ui-btn width-full ' + (opt.class ?? ''),
                    text: opt.label
                });

                btn.onclick = () => {
                    const parent = container.closest('.ui-section-body');
                    if (!parent) return;

                    parent.$$('.switch-body').addClass('hide');

                    let open = parent.$1(`.g${opt.value}`);
                    if (open) {
                        if (open.tagName === 'INPUT' && open.type !== 'color') {
                            open = open.closest('.ui-control-row') || open;
                        }
                        open.removeClass('hide');
                    }

                    container.$$('.ui-btn').removeClass('active');
                    btn.addClass('active');
                };
                container.appendChild(btn);
            });
        }
        return this.applyBaseAttributes(container);
    }
}
