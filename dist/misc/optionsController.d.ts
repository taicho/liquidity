import { Renderer } from '../base/renderer';
import { GuiItem } from './guiItem';
import { OptionsControllerGenerator } from './optionsControllerGenerator';
import { OptionsControllerGroup } from './optionsControllerGroup';
export declare function addGuiItem<T>(gui: dat.GUI, item: GuiItem): import("dat.gui").GUIController;
export declare function addGuiItems(gui: dat.GUI, items: GuiItem[]): void;
export declare class OptionsController {
    blur: number;
    contrast: number;
    renderer: Renderer;
    gui: dat.GUI;
    generator: OptionsControllerGenerator | undefined;
    private _blur;
    private _contrast;
    private canvas;
    constructor(renderer: Renderer, canvas: HTMLElement, gui: dat.GUI);
    randomize(): void;
    addControllerGroup(group: OptionsControllerGroup): void;
}
