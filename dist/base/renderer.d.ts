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
export declare abstract class Renderer<TParticleGroup extends ParticleGroup = ParticleGroup> {
    /**
     * The underlying particle engine.
     *
     * @type {Engine}
     * @memberof Renderer
     */
    engine: Engine;
    /**
     * The particle groups.
     *
     * @type {TParticleGroup[]}
     * @memberof Renderer
     */
    groups: TParticleGroup[];
    /**
     * The global width of all particles, can be used to override.
     *
     * @type {number}
     * @memberof Renderer
     */
    globalParticleWidth: number;
    /**
     * The global height of all particles, can be used to override.
     *
     * @type {number}
     * @memberof Renderer
     */
    globalParticleHeight: number;
    constructor(engine: Engine);
    /**
     * Renders all the groups, if simulate is false will not recalulate particle physics.
     *
     * @param {boolean} [simulate=true]
     * @memberof Renderer
     */
    render(simulate?: boolean): void;
    /**
     * Adds a particle group to the renderer.
     *
     * @param {TParticleGroup} group
     * @memberof Renderer
     */
    addGroup(group: TParticleGroup): void;
    /**
     * Removes a particle group from the renderer.
     *
     * @param {TParticleGroup} group
     * @memberof Renderer
     */
    removeGroup(group: TParticleGroup): void;
    /**
     * Destroys and removes all groups from the particle renderer.
     *
     * @memberof Renderer
     */
    destroyGroups(): void;
    /**
     * An abstract method that must be implemented and returns a new instance of a particle group.
     *
     * @abstract
     * @returns {TParticleGroup}
     * @memberof Renderer
     */
    abstract createParticleGroup(): TParticleGroup;
}
