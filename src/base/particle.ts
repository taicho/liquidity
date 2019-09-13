import { EngineParticle } from '../engine/engineParticle';
import { getId } from '../utilities';
import { ParticleGroup } from './particleGroup';

/**
 * An abstract class representing a rendered particle.
 *
 * @export
 * @abstract
 * @class Particle
 */
export abstract class Particle {
    /**
     * The unique id of the Particle.
     *
     * @memberof Particle
     */
    public id = getId();

    /**
     * The underlying EngineParticle.
     *
     * @type {(EngineParticle | undefined)}
     * @memberof Particle
     */
    public engineParticle: EngineParticle | undefined;

    /**
     * The parent ParticleGroup.
     *
     * @type {(ParticleGroup | undefined)}
     * @memberof Particle
     */
    public parent: ParticleGroup | undefined;
    public individualWidth: number = 0;
    public individualHeight: number = 0;

    /**
     * The width of the Particle.
     *
     * @readonly
     * @memberof Particle
     */
    get width() {
        return this.individualWidth || (this.parent ? this.parent.particleWidth : 0) || (this.parent ? this.parent.renderer.globalParticleWidth : 0);
    }

    /**
     * The height of the Particle.
     *
     * @readonly
     * @memberof Particle
     */
    get height() {
        return this.individualHeight || (this.parent ? this.parent.particleHeight : 0) || (this.parent ? this.parent.renderer.globalParticleHeight : 0);
    }

    /**
     * Removes this Particle from its parent ParticleGroup.
     *
     * @memberof Particle
     */
    public remove() {
        if (this.parent) {
            this.parent.removeParticle(this);
        }
    }

    /**
     * Draws the Particle and subsequently calls drawCore passing in the coordinates.
     *
     * @memberof Particle
     */
    public draw() {
        const p = this.engineParticle;
        if (p) {
            const mult = this.parent ? this.parent.renderer.engine.influenceMultiplier : 6;
            const x1 = Math.floor((mult * (p.x - 1.0)));
            const y1 = Math.floor((mult * p.y));
            const x2 = Math.floor((mult * (p.x - 1.0 - p.gU)));
            const y2 = Math.floor((mult * (p.y - p.gV)));
            this.drawCore(x1, y1, x2, y2);
        }
    }

    /**
     * An abstract method that must be implemented to perform the actual drawing of the Particle.
     *
     * @abstract
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @memberof Particle
     */
    public abstract drawCore(x1: number, y1: number, x2: number, y2: number): void;
}
