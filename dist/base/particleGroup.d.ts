import { Particle } from './particle';
import { Renderer } from './renderer';
/**
 * An abstract class representing a group of particles.
 *
 * @export
 * @abstract
 * @class ParticleGroup
 * @template TParticle
 */
export declare abstract class ParticleGroup<TParticle extends Particle = Particle> {
    renderer: Renderer<any>;
    /**
     * The default width for all particles.
     *
     * @memberof ParticleGroup
     */
    particleWidth: number;
    /**
     * The default height for all particles.
     *
     * @memberof ParticleGroup
     */
    particleHeight: number;
    /**
     * The list of particles.
     *
     * @type {TParticle[]}
     * @memberof ParticleGroup
     */
    particles: TParticle[];
    /**
     * The visibility of the particles in this group.
     *
     * @memberof ParticleGroup
     */
    isVisible: boolean;
    private _individualGravityOffset;
    constructor(renderer: Renderer<any>);
    /**
     * Gets/sets individual gravity offset of the particles in this group.
     *
     * @memberof ParticleGroup
     */
    /**
    * Gets/sets individual gravity offset of the particles in this group.
    *
    * @memberof ParticleGroup
    */
    individualGravityOffset: number;
    /**
     * Abstract method that must be implemented to return a new instantiated particle.
     *
     * @abstract
     * @returns {TParticle}
     * @memberof ParticleGroup
     */
    abstract createParticle(): TParticle;
    /**
     * Adds a particle to the group.
     *
     * @param {TParticle} particle
     * @memberof ParticleGroup
     */
    addParticle(particle: TParticle): void;
    /**
     * Creates a particle and adds it to the group.
     *
     * @memberof ParticleGroup
     */
    createAndAddParticle(): void;
    /**
     * Adds an array of particles to the group.
     *
     * @param {TParticle[]} particles
     * @memberof ParticleGroup
     */
    addParticles(particles: TParticle[]): void;
    /**
     * Removes a particle from the group.
     *
     * @param {TParticle} particle
     * @memberof ParticleGroup
     */
    removeParticle(particle: TParticle): void;
    /**
     * Destroys and removes all of the particles in this group.
     *
     * @memberof ParticleGroup
     */
    destroy(): void;
    /**
     * Draws all the particles in the group.
     *
     * @memberof ParticleGroup
     */
    draw(): void;
}
