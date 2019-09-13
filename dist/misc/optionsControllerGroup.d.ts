import { Renderer } from '../base/renderer';
import { OptionsController } from './optionsController';
export declare abstract class OptionsControllerGroup {
    renderer: Renderer;
    gui: dat.GUI;
    folder: dat.GUI | undefined;
    parent: OptionsController;
    constructor(renderer: Renderer, gui: dat.GUI);
    abstract add(): void;
    remove(): void;
}
