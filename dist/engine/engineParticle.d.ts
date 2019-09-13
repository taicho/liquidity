export declare class EngineParticle {
    id: number;
    individualGravity: number;
    stiffness: number;
    x: number;
    y: number;
    u: number;
    v: number;
    gU: number;
    gV: number;
    force0: number;
    force1: number;
    force2: number;
    cX: number;
    cY: number;
    pX: [number, number, number];
    pY: [number, number, number];
    gX: [number, number, number];
    gY: [number, number, number];
    dead: boolean;
    broken: boolean;
    decaying: boolean;
    life: number;
    decayRate: number;
    constructor(x: number, y: number, u: number, v: number);
    revive(): void;
}
