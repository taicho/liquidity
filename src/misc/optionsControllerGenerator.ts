import { PixiParticle, PixiParticleGroup } from '../rendering/PixiJS';
import { GuiItem } from './guiItem';
import { addGuiItems } from './optionsController';
import { OptionsControllerContainer } from './optionsControllerContainer';
import { OptionsControllerGroup } from './optionsControllerGroup';

export class OptionsControllerGenerator extends OptionsControllerGroup {
    public count = 10;
    public blur = 10;
    public tint = 0xFF0000;

    public generate(count: number, tint: number, blur: number) {
        const group = this.renderer.createParticleGroup();
        if (group instanceof PixiParticleGroup) {
            group.tint = tint;
            group.blur = blur;
        }
        for (let i = 0; i < count; i++) {
            group.createAndAddParticle();
        }
        this.renderer.addGroup(group);
        const container = new OptionsControllerContainer(this.renderer, this.gui, group);
        this.parent.addControllerGroup(container);
    }

    public add() {
        const themes = this.gui.addFolder('Generator');
        addGuiItems(themes, [
            new GuiItem(this, 'count', 'Count', 10, 5000),
            new GuiItem(this, 'blur', 'Blur', 0, 50),
            new GuiItem(this, 'generateInternal', 'Generate'),
            new GuiItem(this, 'tint', 'Tint', undefined, undefined, undefined, undefined, 'color'),
        ]);
        this.folder = themes;
    }

    public generateInternal() {
        this.generate(this.count, this.tint, this.blur);
    }
}
