/// <reference types="pixi.js" />
import { Particle as ParticleBase } from '../../base/particle';
export declare class PixiParticle extends ParticleBase {
    static texture: PIXI.Texture;
    graphicsObject: PIXI.Sprite;
    constructor(width?: number, height?: number);
    revive(): void;
    drawCore(x1: number, y1: number, x2: number, y2: number): void;
}
