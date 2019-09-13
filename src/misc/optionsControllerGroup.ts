import { Renderer } from '../base/renderer';
import { OptionsController } from './optionsController';

export abstract class OptionsControllerGroup {
    public folder: dat.GUI | undefined;
    public parent!: OptionsController;

    constructor(public renderer: Renderer, public gui: dat.GUI) {

    }
    public abstract add(): void;

    public remove() {
        if (this.folder) {
            this.gui.removeFolder(this.folder);
        }
    }
}
