import { EngineParticle } from './engineParticle';
import { Node } from './node';
import { PointInfo } from './pointInfo';
/**
 * The engine that drives all the particle physics.
 *
 * @export
 * @class Engine
 */
export declare class Engine {
    /**
     * The viewport width.
     *
     * @type {number}
     * @memberof Engine
     */
    viewportWidth: number;
    viewportHeight: number;
    particles: EngineParticle[];
    influenceMultiplier: number;
    gridSizeX: number;
    gridSizeY: number;
    grid: Node[][];
    active: Node[];
    points: {
        [index: string]: PointInfo | undefined;
    };
    density: number;
    stiffness: number;
    bulkViscosity: number;
    elasticity: number;
    viscosity: number;
    yieldRate: number;
    gravity: number;
    smoothing: number;
    currentParticles: EngineParticle[];
    oldWidth: number;
    oldHeight: number;
    mode: number;
    space: boolean;
    protected gridMultiplier: number;
    readonly particleCount: number;
    constructor(viewportWidth: number, viewportHeight: number);
    addPointInfo(name: string, info: PointInfo): void;
    removeParticle(particle: EngineParticle): void;
    removeParticles(particles: EngineParticle[]): void;
    createParticle(x?: number, y?: number): EngineParticle;
    createAndAddParticle(): EngineParticle;
    addParticle(engineParticle: EngineParticle): this;
    reinit(autoGridSize?: boolean): void;
    init(): void;
    simulate(): void;
    private buildGrid;
}
