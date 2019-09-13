import { Renderer } from '../base/renderer';
import { PixiRenderer as PixiRenderer } from '../rendering/PixiJS/pixiRenderer';
import { randFloat } from '../utilities';
import { GuiItem } from './guiItem';
import { OptionsControllerGenerator } from './optionsControllerGenerator';
import { OptionsControllerGroup } from './optionsControllerGroup';
import { OptionsControllerPhysics } from './optionsControllerPhysics';
import { OptionsControllerThemes } from './optionsControllerThemes';

export function addGuiItem<T>(gui: dat.GUI, item: GuiItem) {
    let obj = item.obj;
    if (item.label) {
        const originalObj = obj;
        const itemValue = originalObj[item.property];
        obj = Object.create({});
        if (typeof itemValue === 'function') {
            obj[item.label] = () => {
                originalObj[item.property]();
            };
        } else {
            Object.defineProperty(obj, item.label,
                {
                    get: () => {
                        return originalObj[item.property];
                    },
                    set: (val: any) => {
                        originalObj[item.property] = val;
                    },
                });
        }
    }

    const finalProperty = item.label || item.property;
    let newGui: dat.GUIController | undefined;
    if (item.type === 'color') {
        newGui = gui.addColor(obj, finalProperty);
    } else {
        newGui = gui.add(obj, finalProperty, item.min, item.max, item.step);
    }
    if (item.listen) {
        newGui = newGui.listen();
    }
    return newGui;
}

export function addGuiItems(gui: dat.GUI, items: GuiItem[]) {
    items = items.slice().sort((a, b) => (a.label || a.property).localeCompare((b.label || b.property)));
    for (const item of items) {
        addGuiItem(gui, item);
    }
}

export class OptionsController {

    get blur() {
        return this._blur;
    }

    set blur(value) {
        this._blur = value;
        (this.renderer as any).setBlur(value);
    }

    get contrast() {
        return this._contrast;
    }

    set contrast(val: number) {
        this._contrast = val;
        this.canvas.style.filter = `contrast(${val})`;
    }

    public renderer: Renderer;
    public gui: dat.GUI;
    public generator: OptionsControllerGenerator | undefined;
    // tslint:disable-next-line: variable-name
    private _blur: number = 10;
    // tslint:disable-next-line: variable-name
    private _contrast: number = 5;
    private canvas: HTMLElement;

    constructor(renderer: Renderer, canvas: HTMLElement, gui: dat.GUI) {
        this.renderer = renderer;
        this.gui = gui;
        this.canvas = canvas;
        this.contrast = this.contrast;
        const items: GuiItem[] = [
            new GuiItem(this.renderer.engine, 'particleCount', 'Particle Count', undefined, undefined, undefined, true),
            new GuiItem(this.renderer, 'globalParticleWidth', 'Particle Width', 2, 100),
            new GuiItem(this.renderer, 'globalParticleHeight', 'Particle Height', 2, 100),
            new GuiItem(this.renderer.engine, 'mode', 'Mode', -1, 0, 1),
            new GuiItem(this, 'contrast', 'Contrast', 1, 20),
            new GuiItem(this, 'randomize', 'Randomize'),
            new GuiItem(this, 'blur', 'Blur', 0, 100),
        ];
        if (this.renderer instanceof PixiRenderer) {
            items.push(new GuiItem(this.renderer, 'mouseBrushSize', 'Mouse Brush Size', 1, 200));
        }
        addGuiItems(gui, items);
        this.addControllerGroup(new OptionsControllerThemes(renderer, this.gui));
        const phys = new OptionsControllerPhysics(renderer, this.gui);
        this.addControllerGroup(phys);
        const gen = new OptionsControllerGenerator(renderer, this.gui);
        this.addControllerGroup(gen);
        this.generator = gen;
    }

    public randomize() {
        this.renderer.engine.gravity = randFloat(-1.0, 1.0);
        this.renderer.engine.density = randFloat(-1.0, 1.0);
        this.renderer.engine.stiffness = randFloat(0.0, 1.0);
        this.renderer.engine.bulkViscosity = randFloat(-1.0, 5.0);
        this.renderer.engine.elasticity = randFloat(-1.0, 5.0);
        this.renderer.engine.viscosity = randFloat(-1.0, 1.0);
        this.renderer.engine.yieldRate = randFloat(-1.0, 1.0);
    }

    public addControllerGroup(group: OptionsControllerGroup) {
        group.parent = this;
        group.add();
    }

}
