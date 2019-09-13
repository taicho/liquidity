import { EngineParticle } from '../engine/engineParticle';
import { ParticleGroup } from './particleGroup';
/**
 * An abstract class representing a rendered particle.
 *
 * @export
 * @abstract
 * @class Particle
 */
export declare abstract class Particle {
    /**
     * The unique id of the Particle.
     *
     * @memberof Particle
     */
    id: number;
    /**
     * The underlying EngineParticle.
     *
     * @type {(EngineParticle | undefined)}
     * @memberof Particle
     */
    engineParticle: EngineParticle | undefined;
    /**
     * The parent ParticleGroup.
     *
     * @type {(ParticleGroup | undefined)}
     * @memberof Particle
     */
    parent: ParticleGroup | undefined;
    individualWidth: number;
    individualHeight: number;
    /**
     * The width of the Particle.
     *
     * @readonly
     * @memberof Particle
     */
    readonly width: number;
    /**
     * The height of the Particle.
     *
     * @readonly
     * @memberof Particle
     */
    readonly height: number;
    /**
     * Removes this Particle from its parent ParticleGroup.
     *
     * @memberof Particle
     */
    remove(): void;
    /**
     * Draws the Particle and subsequently calls drawCore passing in the coordinates.
     *
     * @memberof Particle
     */
    draw(): void;
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
    abstract drawCore(x1: number, y1: number, x2: number, y2: number): void;
}
