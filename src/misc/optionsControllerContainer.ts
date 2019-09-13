import { ParticleGroup } from '../base/ParticleGroup';
import { Renderer } from '../base/renderer';
import { PixiParticleGroup as PixiParticleGroup } from '../rendering/PixiJS/pixiParticleGroup';
import { GuiItem } from './guiItem';
import { addGuiItems } from './optionsController';
import { OptionsControllerGroup } from './optionsControllerGroup';

export class OptionsControllerContainer extends OptionsControllerGroup {

    get tint() {
        if (this.group instanceof PixiParticleGroup) {
            return '#' + this.decimalToHex(this.group.tint);
        }
        return '';
    }

    set tint(val: string) {
        if (this.group instanceof PixiParticleGroup) {
            this.group.tint = parseInt(val.replace(/^#/, ''), 16);
        }
    }

    get blur() {
        if (this.group instanceof PixiParticleGroup) {
            return this.group.blur;
        }
        return 0;
    }

    set blur(val: number) {
        if (this.group instanceof PixiParticleGroup) {
            this.group.blur = val;
        }
    }

    public name: string;
    constructor(renderer: Renderer, gui: dat.GUI, public group: ParticleGroup) {
        super(renderer, gui);
        const containerCount = Object.keys(gui.__folders).filter((s) => s.includes('Container')).length;
        this.name = `Container ${containerCount}`;
    }

    public add() {
        const themes = this.gui.addFolder(this.name);
        this.folder = themes;
        const items: GuiItem[] = [
            new GuiItem(this, 'tint', 'Tint', undefined, undefined, undefined, undefined, 'color'),
            new GuiItem(this, 'blur', 'Blur', 0, 50, undefined, true),
            new GuiItem(this, 'destroy', 'Destroy'),
            new GuiItem(this.group, 'isVisible'),
            new GuiItem(this.group, 'individualGravityOffset', 'Individual Gravity Offset', -1, 1, 0.01),
        ];
        addGuiItems(themes, items);
    }

    public decimalToHex(d: number, padding = 6) {
        let hex = Number(d).toString(16);
        padding = typeof (padding) === 'undefined' || padding === null ? padding = 2 : padding;
        while (hex.length < padding) {
            hex = '0' + hex;
        }
        return hex;
    }

    public destroy() {
        this.gui.removeFolder(this.folder!);
        delete this.gui.__folders[this.folder!.name as any];
        this.renderer.removeGroup(this.group as PixiParticleGroup);
        this.group.destroy();
        this.reapplyFolderNames();
    }

    private reapplyFolderNames() {
        let i = 0;
        for (const key of Object.keys(this.gui.__folders)) {
            const folder = this.gui.__folders[key as any];
            if (folder.name.includes('Container')) {
                folder.name = `Container ${i++}`;
                delete this.gui.__folders[key as any];
                this.gui.__folders[folder.name as any] = folder;
            }
        }
    }
}
