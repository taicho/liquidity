import { ParticleGroup as ParticleGroupBase } from '../../base/particleGroup';
import { PixiParticle } from './pixiParticle';
import { PixiRenderer } from './pixiRenderer';
export class PixiParticleGroup extends ParticleGroupBase<PixiParticle> {
    public baseContainer: PIXI.Container;
    public tint = 0xFF0000;
    // tslint:disable-next-line: variable-name
    private _blur: number = 10;

    constructor(renderer: PixiRenderer) {
        super(renderer);
        this.baseContainer = new PIXI.Container();
        this.applyFilters();
    }

    get blur() {
        return this._blur;
    }

    set blur(val: number) {
        this._blur = val;
        this.applyFilters();
    }

    public draw() {
        this.baseContainer.visible = this.isVisible;
        super.draw();
    }

    public addParticle(particle: PixiParticle) {
        super.addParticle(particle);
        this.baseContainer.addChild(particle.graphicsObject);
    }

    public removeParticle(particle: PixiParticle) {
        super.removeParticle(particle);
        this.baseContainer.removeChild(particle.graphicsObject);
    }

    public applyFilters() {
        this.baseContainer.filters = this.getDefaultFilters();
    }

    public createParticle() {
        return new PixiParticle();
    }

    public getDefaultFilters(tintFirst = true) {
        let filts: PIXI.Filter<any>[] = [];
        const includeTint = false;
        if (tintFirst) {
            if (includeTint) {
                filts.push(this.createColorMatrixFilter());
            }
            filts = filts.concat(this.createBlurs(this.blur, this.blur));
        } else {
            filts = filts.concat(this.createBlurs(this.blur, this.blur));
            if (includeTint) {
                filts.push(this.createColorMatrixFilter());
            }
        }
        return filts;
    }

    public createColorMatrixFilter() {
        const matrix = new PIXI.filters.ColorMatrixFilter();
        matrix.matrix = [0, 0, 0, 0,
            0, 0, 1, 1,
            0, 0, 1, 2,
            2, 2, 0, 1];
        return matrix;
    }

    public createBlurs(x: number, y: number) {
        const blurX = new PIXI.filters.BlurXFilter();
        const blurY = new PIXI.filters.BlurYFilter();
        blurX.blur = x;
        blurY.blur = y;
        return [blurX, blurY];
    }
}
