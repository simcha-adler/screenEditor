let lock = false;

export const SelectorLock = {
    on: () => { lock = true; $1('.lockLabel').innerHTML = '🔒'; $('lock').checked = true; },
    off: () => { lock = false; $1('.lockLabel').innerHTML = '🔓'; $('lock').checked = false; },
    getState: () => lock
}

window.SelectorLock = SelectorLock;