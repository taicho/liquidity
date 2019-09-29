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
export abstract class ParticleGroup<TParticle extends Particle = Particle> {
    /**
     * The default width for all particles.
     *
     * @memberof ParticleGroup
     */
    public particleWidth = 0;
    /**
     * The default height for all particles.
     *
     * @memberof ParticleGroup
     */
    public particleHeight = 0;

    /**
     * The list of particles.
     *
     * @type {TParticle[]}
     * @memberof ParticleGroup
     */
    public particles: TParticle[] = [];
    /**
     * The visibility of the particles in this group.
     *
     * @memberof ParticleGroup
     */
    public isVisible = true;

    // tslint:disable-next-line: variable-name
    private _individualGravityOffset = 0;

    constructor(public renderer: Renderer<any>) {
    }

    /**
     * Gets/sets individual gravity offset of the particles in this group.
     *
     * @memberof ParticleGroup
     */
    public get individualGravityOffset() {
        return this._individualGravityOffset;
    }

    /**
     * Gets/sets individual gravity offset of the particles in this group.
     *
     * @memberof ParticleGroup
     */
    public set individualGravityOffset(val: number) {
        this._individualGravityOffset = val;
        for (const particle of this.particles) {
            if (particle.engineParticle) {
                particle.engineParticle.individualGravity = val;
            }
        }
    }

    /**
     * Abstract method that must be implemented to return a new instantiated particle.
     *
     * @abstract
     * @returns {TParticle}
     * @memberof ParticleGroup
     */
    public abstract createParticle(): TParticle;

    /**
     * Adds a particle to the group.
     *
     * @param {TParticle} particle
     * @memberof ParticleGroup
     */
    public addParticle(particle: TParticle) {
        particle.parent = this;
        const engineParticle = particle.engineParticle || this.renderer.engine.createAndAddParticle();
        particle.engineParticle = engineParticle;
        this.particles.push(particle);
    }

    /**
     * Creates a particle and adds it to the group.
     *
     * @memberof ParticleGroup
     */
    public createAndAddParticle() {
        this.addParticle(this.createParticle());
    }

    /**
     * Adds an array of particles to the group.
     *
     * @param {TParticle[]} particles
     * @memberof ParticleGroup
     */
    public addParticles(particles: TParticle[]) {
        for (const particle of particles) {
            this.addParticle(particle);
        }
    }

    /**
     * Removes a particle from the group.
     *
     * @param {TParticle} particle
     * @memberof ParticleGroup
     */
    public removeParticle(particle: TParticle) {
        particle.parent = undefined;
        const index = this.particles.indexOf(particle);
        if (index >= 0) {
            this.particles.splice(index, 1);
            if (particle.engineParticle) {
                this.renderer.engine.removeParticle(particle.engineParticle);
            }
        }
    }

    /**
     * Destroys and removes all of the particles in this group.
     *
     * @memberof ParticleGroup
     */
    public destroy() {
        for (const particle of this.particles) {
            if (particle.engineParticle) {
                this.renderer.engine.removeParticle(particle.engineParticle);
            }
        }
        this.particles = [];
    }

    /**
     * Draws all the particles in the group.
     *
     * @memberof ParticleGroup
     */
    public draw() {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
        }
    }
}
