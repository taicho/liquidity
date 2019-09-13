import { Renderer } from '../base/renderer';
import { PixiParticle, PixiParticleGroup } from '../rendering/PixiJS';
import { GuiItem } from './guiItem';
import { addGuiItems } from './optionsController';
import { OptionsControllerContainer } from './optionsControllerContainer';
import { OptionsControllerGroup } from './optionsControllerGroup';

export class OptionsControllerThemes extends OptionsControllerGroup {
    constructor(public renderer: Renderer, gui: dat.GUI) {
        super(renderer, gui);
    }

    public add() {
        const themes = this.gui.addFolder('Visual Themes');
        addGuiItems(themes, [
            new GuiItem(this, 'electric', 'Electric'),
            new GuiItem(this, 'lava', 'Lava'),
        ]);
        this.folder = themes;
    }

    public electric() {
        this.clearFolders();
        this.renderer.destroyGroups();
        this.createAndAdd(5000, 0x0000FF, 24);
        this.createAndAdd(5000, 0x00FFFF, 2);
    }

    public lava() {
        this.clearFolders();
        this.renderer.destroyGroups();
        this.createAndAdd(5000, 0xffc200, 3);
        this.createAndAdd(5000, 0xFF0000, 11);
    }

    private createAndAdd(num: number, tint: number, blur: number) {
        const group = this.renderer.createParticleGroup();
        for (let i = 0; i < num; i++) {
            group.addParticle(new PixiParticle());
        }
        if (group instanceof PixiParticleGroup) {
            group.tint = tint;
            group.blur = blur;
        }
        this.renderer.addGroup(group);
        this.parent.addControllerGroup(new OptionsControllerContainer(this.renderer, this.gui, group));
    }

    private clearFolders() {
        for (const folderName of Object.keys(this.gui.__folders)) {
            const folder = this.gui.__folders[folderName as any];
            if (folder.name.indexOf('Container') >= 0) {
                this.gui.removeFolder(folder);
            }
        }
    }

}
