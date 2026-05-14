let lock = false;
const locker = $1('.lockLabel');

export const SelectorLock = {
    on: () => { lock = true; locker.innerHTML = '🔒'; $('lock').checked = true; },
    off: () => { lock = false; locker.innerHTML = '🔓'; $('lock').checked = false; },
    getState: () => {
        if (lock) {
            locker.style.animation = 'shake 0.5s';
            locker.style.animationIterationCount = 2;
            setTimeout(() => locker.style.animation = 'none', 500)
        }
        return lock;
    }
}

window.SelectorLock = SelectorLock;