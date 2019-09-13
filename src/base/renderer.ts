import { Engine } from '../engine/engine';
import { ParticleGroup } from './ParticleGroup';

/**
 * An abstract class representing the logic required to render particles on the client.
 *
 * @export
 * @abstract
 * @class Renderer
 * @template TParticleGroup
 */
export abstract class Renderer<TParticleGroup extends ParticleGroup = ParticleGroup> {
    /**
     * The underlying particle engine.
     *
     * @type {Engine}
     * @memberof Renderer
     */
    public engine: Engine;
    /**
     * The particle groups.
     *
     * @type {TParticleGroup[]}
     * @memberof Renderer
     */
    public groups: TParticleGroup[] = [];
    /**
     * The global width of all particles, can be used to override.
     *
     * @type {number}
     * @memberof Renderer
     */
    public globalParticleWidth: number = 2;
    /**
     * The global height of all particles, can be used to override.
     *
     * @type {number}
     * @memberof Renderer
     */
    public globalParticleHeight: number = 2;

    constructor(engine: Engine) {
        this.engine = engine;
    }

    /**
     * Renders all the groups, if simulate is false will not recalulate particle physics.
     *
     * @param {boolean} [simulate=true]
     * @memberof Renderer
     */
    public render(simulate = true) {
        if (simulate) {
            this.engine.simulate();
        }
        for (const group of this.groups) {
            group.draw();
        }
    }

    /**
     * Adds a particle group to the renderer.
     *
     * @param {TParticleGroup} group
     * @memberof Renderer
     */
    public addGroup(group: TParticleGroup) {
        this.groups.push(group);
    }

    /**
     * Removes a particle group from the renderer.
     *
     * @param {TParticleGroup} group
     * @memberof Renderer
     */
    public removeGroup(group: TParticleGroup) {
        const index = this.groups.indexOf(group);
        this.groups.splice(index, 1);
    }

    /**
     * Destroys and removes all groups from the particle renderer.
     *
     * @memberof Renderer
     */
    public destroyGroups() {
        for (const group of this.groups.slice()) {
            this.removeGroup(group);
            group.destroy();
        }
        this.groups = [];
    }

    /**
     * An abstract method that must be implemented and returns a new instance of a particle group.
     *
     * @abstract
     * @returns {TParticleGroup}
     * @memberof Renderer
     */
    public abstract createParticleGroup(): TParticleGroup;
}
