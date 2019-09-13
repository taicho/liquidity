import { Renderer } from '../base/renderer';
import { GuiItem } from './guiItem';
import { addGuiItems } from './optionsController';
import { OptionsControllerGroup } from './optionsControllerGroup';

export class OptionsControllerPhysics extends OptionsControllerGroup {
    constructor(renderer: Renderer, gui: dat.GUI) {
        super(renderer, gui);
    }

    public add() {
        const physics = this.gui.addFolder('Physics');
        addGuiItems(physics, [
            new GuiItem(this.renderer.engine, 'gravity', 'Gravity', -1.0, 1.0, undefined, true),
            new GuiItem(this.renderer.engine, 'density', 'Density', 0, 50.0, undefined, true),
            new GuiItem(this.renderer.engine, 'stiffness', 'Stiffness', -1.0, 5.0, undefined, true),
            new GuiItem(this.renderer.engine, 'bulkViscosity', 'Bulkviscosity', -1.0, 5.0, undefined, true),
            new GuiItem(this.renderer.engine, 'elasticity', 'Elasticity', -1.0, 1.0, undefined, true),
            new GuiItem(this.renderer.engine, 'viscosity', 'Viscosity', -1.0, 1.0, undefined, true),
            new GuiItem(this.renderer.engine, 'yieldRate', 'Yieldrate', -1.0, 1.0, undefined, true),
            new GuiItem(this.renderer.engine, 'smoothing', 'Smoothing', 0.0, 1.0, undefined, true),
            new GuiItem(this, 'copy', 'Copy Settings'),
        ]);
        this.folder = physics;
    }

    public copy() {
        const settings = {
            Gravity: this.renderer.engine.gravity,
            Density: this.renderer.engine.density,
            Stiffness: this.renderer.engine.stiffness,
            BulkViscosity: this.renderer.engine.bulkViscosity,
            Elasticity: this.renderer.engine.elasticity,
            Viscosity: this.renderer.engine.viscosity,
            YieldRate: this.renderer.engine.yieldRate,
            Smoothing: this.renderer.engine.smoothing,
        };
        this.copyText(JSON.stringify(settings));
    }

    public copyText(text: string) {
        const input = document.createElement('textarea');
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.textContent = text;
        input.select();
        document.execCommand('copy');
        input.remove();
    }
}
