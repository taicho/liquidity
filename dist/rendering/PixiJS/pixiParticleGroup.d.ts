import * as PIXI from 'pixi.js';
import { ParticleGroup as ParticleGroupBase } from '../../base/particleGroup';
import { PixiParticle } from './pixiParticle';
import { PixiRenderer } from './pixiRenderer';
export declare class PixiParticleGroup extends ParticleGroupBase<PixiParticle> {
    baseContainer: PIXI.Container;
    tint: number;
    private _blur;
    constructor(renderer: PixiRenderer);
    blur: number;
    draw(): void;
    addParticle(particle: PixiParticle): void;
    removeParticle(particle: PixiParticle): void;
    applyFilters(): void;
    createParticle(): PixiParticle;
    getDefaultFilters(tintFirst?: boolean): PIXI.Filter<any>[];
    createColorMatrixFilter(): PIXI.filters.ColorMatrixFilter;
    createBlurs(x: number, y: number): (PIXI.filters.BlurXFilter | PIXI.filters.BlurYFilter)[];
}
