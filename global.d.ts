

// 1. הגדרת משתנים גלובליים על ה-window
interface window {
    Style: any;
    schemas: any;
    tree: any;
    settings: any;
    Selector: any;
    UI: any;
}

// 2. הרחבת הפרוטוטייפ של אלמנטים ב-DOM
interface HTMLElement {
    $(selector: string): HTMLElement | null;
    $$(selector: string): NodeListOf<HTMLElement>;
    $1(selector: string): HTMLElement | null;
    addClass(className: string): this;
    removeClass(className: string): this;
    toggleClass(className: string): this;
    attr(name: string, value?: string): string | this | null;
    into(parent: string | HTMLElement): this;
}

interface Document {
    $(selector: string): HTMLElement | null;
}

interface NodeList {
    addClass(className: string): this;
    removeClass(className: string): this;
    toggleClass(className: string): this;
    whenClick(callback: (e: Event) => void): this;
    when(eventName: string, callback: (e: Event) => void): this;
    into(parent: string | HTMLElement): this;
}

// 3. הרחבת אירועים (Event / EventTarget)
interface EventTarget {
    whenClick(callback: (e: Event) => void): this;
    when(eventName: string, callback: (e: Event) => void): this;
}

interface Event {
    upTo(selector: string): HTMLElement | null;
}

interface HTMLInputElement {
    sendInput(value: string): void;
}

interface CSSRule {
    selectorText: string;
}