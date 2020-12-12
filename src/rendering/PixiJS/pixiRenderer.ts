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
    public mousePosition: PointInfo = { size: 10.0 };
    public lastGraphic: any;
    public canvas: HTMLCanvasElement;

    constructor(engine: Engine, canvasElement?: HTMLCanvasElement) {
        super(engine);
        if (!canvasElement) {
            canvasElement = document.createElement('canvas');
        }
        this.canvas = canvasElement;
        this.pixiRenderer = PIXI.autoDetectRenderer(this.engine.viewportWidth, this.engine.viewportHeight, { transparent: true, view: canvasElement });  // new PIXI.WebGLRenderer(this.Engine.Width, this.Engine.Height, $("#flowCanvas").get(0), true);
        this.stage = new PIXI.Container();
        this.setupInteraction();

    }

    private setupInteraction() {
        const engine = this.engine;
        const canvasElement = this.canvas;
        const info = this.mousePosition;
        // const info: PointInfo = { size: 10.0 };
        // this.mousePosition = info;
        let hasTouchSupport = false;
        engine.addPointInfo('Mouse', info);
        canvasElement.addEventListener('mousemove', (event: MouseEvent) => {
            if (!hasTouchSupport) {
                const pos = this.getRelativePosition(canvasElement!, { x: event.clientX, y: event.clientY });
                info.x = pos.x;
                info.y = pos.y;
            }
        });
        canvasElement.addEventListener('mousedown', () => {
            if (!hasTouchSupport) {
                info.active = true;
                info.activePreviously = true;
            }
        });
        canvasElement.addEventListener('mouseup', () => {
            if (!hasTouchSupport) {
                info.active = false;
            }
        });
        canvasElement.addEventListener('touchstart', (e) => {
            hasTouchSupport = true;
            for (let i = 0; i < e.touches.length; i++) {                
                const touch = e.touches.item(i)!;
                const touchId = touch.identifier.toString();
                let touchInfo = this.engine.points[touchId];
                if (!touchInfo) {
                    touchInfo = {
                        size: 10.0,
                    };
                    this.engine.addPointInfo(touchId, touchInfo);
                }
                const position = this.getRelativePosition(canvasElement,{x: touch.clientX, y: touch.clientY});
                touchInfo.x = position.x;
                touchInfo.y = position.y;
                touchInfo.previousX = position.x;
                touchInfo.previousY = position.y;
                touchInfo.active = true;
                touchInfo.activePreviously = true;
            }
        },false);
        const touchEnd = (e : TouchEvent) => {
            hasTouchSupport = true;
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches.item(i)!;
                const touchId = touch.identifier.toString();
                const touchInfo = this.engine.points[touchId];
                if(touchInfo) {
                    const position = this.getRelativePosition(canvasElement,{x: touch.clientX, y: touch.clientY});
                    touchInfo.x = position.x;
                    touchInfo.y = position.y;
                    touchInfo.active = false;
                }
            }
        }
        canvasElement.addEventListener('touchend', touchEnd, false);
        canvasElement.addEventListener('touchcancel', touchEnd, false);
        canvasElement.addEventListener('touchmove', (e)=>{
            hasTouchSupport = true;
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches.item(i)!;
                const touchId = touch.identifier.toString();
                const touchInfo = this.engine.points[touchId];
                if(touchInfo) {
                    const position = this.getRelativePosition(canvasElement,{x: touch.clientX, y: touch.clientY});
                    touchInfo.x = position.x;
                    touchInfo.y = position.y;                    
                }
            }
        },false);

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

    public getRelativePosition(canvas: HTMLCanvasElement, vector: { x: number, y: number }) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: vector.x - rect.left,
            y: vector.y - rect.top,
        };
    }

    public createParticleGroup() {
        return new PixiParticleGroup(this);
    }
}
