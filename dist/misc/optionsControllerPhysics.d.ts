import { Renderer } from '../base/renderer';
import { OptionsControllerGroup } from './optionsControllerGroup';
export declare class OptionsControllerPhysics extends OptionsControllerGroup {
    constructor(renderer: Renderer, gui: dat.GUI);
    add(): void;
    copy(): void;
    copyText(text: string): void;
}
