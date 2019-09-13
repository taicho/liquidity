export class GuiItem<T = any> {
    constructor(
        public obj: T,
        public property: keyof T & string,
        public label?: string,
        public min?: number,
        public max?: number,
        public step?: number,
        public listen?: boolean,
        public type: 'auto' | 'color' = 'auto') {
    }
}
