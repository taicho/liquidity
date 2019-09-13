import { OptionsControllerGroup } from './optionsControllerGroup';
export declare class OptionsControllerGenerator extends OptionsControllerGroup {
    count: number;
    blur: number;
    tint: number;
    generate(count: number, tint: number, blur: number): void;
    add(): void;
    generateInternal(): void;
}
