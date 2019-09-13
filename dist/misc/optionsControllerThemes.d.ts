import { Renderer } from '../base/renderer';
import { OptionsControllerGroup } from './optionsControllerGroup';
export declare class OptionsControllerThemes extends OptionsControllerGroup {
    renderer: Renderer;
    constructor(renderer: Renderer, gui: dat.GUI);
    add(): void;
    electric(): void;
    lava(): void;
    private createAndAdd;
    private clearFolders;
}
