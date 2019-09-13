export declare class GuiItem<T = any> {
    obj: T;
    property: keyof T & string;
    label?: string | undefined;
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
    listen?: boolean | undefined;
    type: 'auto' | 'color';
    constructor(obj: T, property: keyof T & string, label?: string | undefined, min?: number | undefined, max?: number | undefined, step?: number | undefined, listen?: boolean | undefined, type?: 'auto' | 'color');
}
