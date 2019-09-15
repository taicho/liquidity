import * as PIXI from 'pixi.js';
import { Particle as ParticleBase } from '../../base/particle';
import { PixiParticleGroup } from './pixiParticleGroup';

export class PixiParticle extends ParticleBase {
    public static texture: PIXI.Texture;
    public graphicsObject: PIXI.Sprite;

    constructor(width?: number, height?: number) {
        super();
        this.individualWidth = width || 0;
        this.individualHeight = height || 0;
        // tslint:disable-next-line: max-line-length
        const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ5MDU1NzQ0RDk1MTExRTNBRkQ5RjlBRTM1RThCNEI0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ5MDU1NzQ1RDk1MTExRTNBRkQ5RjlBRTM1RThCNEI0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDkwNTU3NDJEOTUxMTFFM0FGRDlGOUFFMzVFOEI0QjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDkwNTU3NDNEOTUxMTFFM0FGRDlGOUFFMzVFOEI0QjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7yVMeHAAAAFUlEQVR42mL8//8/AwMDEwMYAAQYACQGAwEp6XggAAAAAElFTkSuQmCC';
        if (!PixiParticle.texture) {
            PixiParticle.texture = PIXI.Texture.fromImage(pixel);
        }
        const tempBall = new PIXI.Sprite(PixiParticle.texture);
        tempBall.anchor.x = 0.5;
        tempBall.anchor.y = 0.5;
        tempBall.alpha = 1.0;
        this.graphicsObject = tempBall;
    }

    public revive() {
        this.graphicsObject.visible = true;
    }

    public drawCore(x1: number, y1: number, x2: number, y2: number) {
        const obj = this.graphicsObject;
        const parent = this.parent as PixiParticleGroup | undefined;
        obj.tint = parent ? parent.tint : 0;
        obj.position.x = x1;
        obj.position.y = y1;
        obj.height = Math.max(Math.abs(y2 - y1) / 2, this.height);
        obj.width = Math.max(Math.abs(x2 - x1) / 2, this.width);
        obj.rotation = Math.atan2(x2, y2);
    }
}
