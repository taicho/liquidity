import * as PIXI from 'pixi.js';
import { Renderer as RendererBase } from '../../base/renderer';
import { Engine } from '../../engine/engine';
import { PointInfo } from '../../engine/pointInfo';
import { PixiParticleGroup } from './pixiParticleGroup';
export class PixiRenderer extends RendererBase<PixiParticleGroup> {

    get mouseBrushSize(): number {
        return this.mousePosition.size || 0;
    }

    set mouseBrushSize(val: number) {
        this.mousePosition.size = val;
    }

    public pixiRenderer: PIXI.SystemRenderer;
    public stage: PIXI.Container;
    public mousePosition: PointInfo;
    public lastGraphic: any;
    public canvas: HTMLCanvasElement;

    constructor(engine: Engine, canvasElement?: HTMLCanvasElement) {
        super(engine);
        if (!canvasElement) {
            canvasElement = document.createElement('canvas');
        }
        this.canvas = canvasElement;
        const info: PointInfo = { size: 10.0 };
        this.mousePosition = info;
        this.pixiRenderer = PIXI.autoDetectRenderer(this.engine.viewportWidth, this.engine.viewportHeight, { transparent: true, view: canvasElement });  // new PIXI.WebGLRenderer(this.Engine.Width, this.Engine.Height, $("#flowCanvas").get(0), true);
        this.stage = new PIXI.Container();
        engine.addPointInfo('Mouse', info);
        canvasElement.addEventListener('mousemove', (event: MouseEvent) => {
            const pos = this.getMousePosition(canvasElement!, event);
            info.x = pos.x;
            info.y = pos.y;
        });
        canvasElement.addEventListener('mousedown', () => {
            info.active = true;
            info.activePreviously = true;
        });
        canvasElement.addEventListener('mouseup', () => {
            info.active = false;
        });
    }

    public setBlurForContainer(c: PIXI.Container, value: number) {
        if (c.filters && c.filters.length) {
            for (const f of c.filters) {
                if (f instanceof PIXI.filters.BlurFilter || f instanceof PIXI.filters.BlurXFilter || f instanceof PIXI.filters.BlurYFilter) {
                    f.blur = value;
                }
            }

        }
    }

    public setBlur(value: number) {
        this.groups.forEach((c) => {
            this.setBlurForContainer(c.baseContainer, value);
        });
    }

    public setSmokeGravity() {
        this.engine.gravity = 0.0005;
    }

    public setSpaceGravity() {
        this.engine.gravity = 0.0;
    }

    public addGroup(group: PixiParticleGroup) {
        super.addGroup(group);
        this.stage.addChild(group.baseContainer);
    }

    public removeGroup(container: PixiParticleGroup) {
        super.removeGroup(container);
        this.stage.removeChild(container.baseContainer);
    }

    public render(simulate = true) {
        if (this.lastGraphic) {
            this.stage.removeChild(this.lastGraphic);
        }
        super.render(simulate);
        this.pixiRenderer.render(this.stage);
    }

    public getMousePosition(canvas: HTMLCanvasElement, event: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    public createParticleGroup() {
        return new PixiParticleGroup(this);
    }
}
