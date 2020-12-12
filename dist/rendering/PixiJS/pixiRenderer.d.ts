import * as PIXI from 'pixi.js';
import { Renderer as RendererBase } from '../../base/renderer';
import { Engine } from '../../engine/engine';
import { PointInfo } from '../../engine/pointInfo';
import { PixiParticleGroup } from './pixiParticleGroup';
export declare class PixiRenderer extends RendererBase<PixiParticleGroup> {
    mouseBrushSize: number;
    pixiRenderer: PIXI.SystemRenderer;
    stage: PIXI.Container;
    mousePosition: PointInfo;
    lastGraphic: any;
    canvas: HTMLCanvasElement;
    constructor(engine: Engine, canvasElement?: HTMLCanvasElement);
    private setupInteraction;
    setBlurForContainer(c: PIXI.Container, value: number): void;
    setBlur(value: number): void;
    setSmokeGravity(): void;
    setSpaceGravity(): void;
    addGroup(group: PixiParticleGroup): void;
    removeGroup(container: PixiParticleGroup): void;
    render(simulate?: boolean): void;
    getRelativePosition(canvas: HTMLCanvasElement, vector: {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    };
    createParticleGroup(): PixiParticleGroup;
}
