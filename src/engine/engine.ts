import { rand } from '../utilities';
import { EngineParticle } from './engineParticle';
import { Node } from './node';
import { PointInfo } from './pointInfo';

/**
 * The engine that drives all the particle physics.
 *
 * @export
 * @class Engine
 */
export class Engine {

    /**
     * The viewport width.
     *
     * @type {number}
     * @memberof Engine
     */
    public viewportWidth: number;
    public viewportHeight: number;
    public particles: EngineParticle[] = [];
    public influenceMultiplier = 6;
    public gridSizeX = 0;
    public gridSizeY = 0;
    public grid: Node[][] = [];
    public active: Node[] = [];
    public points: { [index: string]: PointInfo | undefined } = {};
    public density = 2.0;
    public stiffness = 1.0;
    public bulkViscosity = 1.0;
    public elasticity = 0.0;
    public viscosity = 0.1;
    public yieldRate = 0.0;
    public gravity = 0.05;
    public smoothing = 0.0;
    public currentParticles: EngineParticle[] = [];
    public oldWidth = 0;
    public oldHeight = 0;
    public mode = -1;
    public space = false;

    public get particleCount() {
        return this.particles.length;
    }

    constructor(viewportWidth: number, viewportHeight: number) {
        if (typeof LIQUIDITY_VERSION !== 'undefined') {
            // tslint:disable-next-line: no-console
            console.log(`Liquidity v${LIQUIDITY_VERSION}`);
        }
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.reinit();
    }

    public addPointInfo(name: string, info: PointInfo) {
        this.points[name] = info;
    }

    public removeParticle(particle: EngineParticle) {
        const index = this.particles.indexOf(particle);
        if (index !== undefined) {
            this.particles.splice(index, 1);
        } else {
            throw new Error('Unable to find particle.');
        }
    }

    public removeParticles(particles: EngineParticle[]) {
        const map = new Set(particles.map((s) => s.id));
        const newParticles = [];
        for (const particle of this.particles.slice()) {
            if (!map.has(particle.id)) {
                newParticles.push(particle);
            }
        }
        this.particles = newParticles;
    }

    public addParticle() {
        const particle = new EngineParticle(rand(1, this.gridSizeX - 3), rand(1, this.gridSizeY - 3), 0.0, 0.0);
        this.particles.push(particle);
        return particle;
    }

    public setParticleCount(oldValue: number, newValue: number) {
        const particleDelta = [];
        const abs = Math.abs(newValue - oldValue);

        if (newValue > oldValue) {
            for (let j = 0; j < abs; j++) {
                const p = this.addParticle();
                particleDelta.push(p);
            }
        } else {
            for (let j = 0; j < abs; j++) {
                particleDelta.push(this.particles.pop());
            }
        }
        return particleDelta;
    }

    public reinit(autoGridSize = true) {
        if (autoGridSize) {
            this.gridSizeX = Math.ceil(this.viewportWidth / 5.89);
            this.gridSizeY = Math.ceil(this.viewportHeight / 5.89);
        }
        const oldGridX = Math.ceil(this.oldWidth / 5.89);
        const oldGridY = Math.ceil(this.oldHeight / 5.89);

        const absX = Math.abs(this.gridSizeX - oldGridX);
        const absY = Math.abs(this.gridSizeY - oldGridY);

        if (this.gridSizeX > oldGridX) {
            this.grid.forEach((g1) => {
                for (let gi = 0; gi < absY; gi++) {
                    g1.push(new Node());
                }
            });
            for (let gi = 0; gi < absX; gi++) {
                this.grid.push([]);
                for (let gx = 0; gx < this.gridSizeY; gx++) {
                    this.grid[gi].push(new Node());
                }
            }
        } else {
            for (let gi = 0; gi < absX; gi++) {
                this.grid.pop();
            }

            this.grid.forEach((g1) => {
                for (let gi = 0; gi < absY; gi++) {
                    g1.pop();
                }
            });

        }
    }

    public init() {
        this.grid = [];
        this.grid.length = this.gridSizeX;
        this.particles = [];
        this.buildGrid();
    }

    public simulate() {
        const points = this.points;

        for (const name of Object.keys(points)) {
            const info = points[name];
            if (info) {
                if (info.active && info.activePreviously) {
                    info.calculatedX = (info.x! - info.previousX!) / this.influenceMultiplier;
                    info.calculatedY = (info.y! - info.previousY!) / this.influenceMultiplier;
                }
                info.activePreviously = info.active;
                info.previousX = info.x;
                info.previousY = info.y;
            }
        }

        for (let ai = 0, len = this.active.length; ai < len; ai++) {
            const n = this.active[ai];
            n.m = (n.gX = n.gY = n.u = n.v = n.aX = n.aY = 0.0);
            n.active = false;
        }
        this.active = [];
        for (let pi = 0, len = this.particles.length; pi < len; pi++) {
            const p = this.particles[pi];
            p.cX = Math.floor(((p.x - 0.5)));
            p.cY = Math.floor(((p.y - 0.5)));

            let x = p.cX - p.x;
            p.pX[0] = (0.5 * x * x + 1.5 * x + 1.125);
            p.gX[0] = (x + 1.5);
            x += 1.0;
            p.pX[1] = (-x * x + 0.75);
            p.gX[1] = (-2.0 * x);
            x += 1.0;
            p.pX[2] = (0.5 * x * x - 1.5 * x + 1.125);
            p.gX[2] = (x - 1.5);

            let y = p.cY - p.y;
            p.pY[0] = (0.5 * y * y + 1.5 * y + 1.125);
            p.gY[0] = (y + 1.5);
            y += 1.0;
            p.pY[1] = (-y * y + 0.75);
            p.gY[1] = (-2.0 * y);
            y += 1.0;
            p.pY[2] = (0.5 * y * y - 1.5 * y + 1.125);
            p.gY[2] = (y - 1.5);

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const cxi = Math.floor(p.cX + i);
                    const cyj = Math.floor(p.cY + j);
                    const n = this.grid[cxi][cyj];
                    if (!n.active) {
                        this.active.push(n);
                        n.active = true;
                    }
                    const phi = p.pX[i] * p.pY[j];
                    n.m += phi;
                    const dx = p.gX[i] * p.pY[j];
                    const dy = p.pX[i] * p.gY[j];
                    n.gX += dx;
                    n.gY += dy;
                    n.u += phi * p.u;
                    n.v += phi * p.v;
                }
            }
        }

        for (let ai = 0, len = this.active.length; ai < len; ai++) {
            const n = this.active[ai];
            if (n.m > 0.0) {
                n.u /= n.m;
                n.v /= n.m;
            }
        }

        for (let pi = 0, len = this.particles.length; pi < len; pi++) {
            const p = this.particles[pi];
            let dudx = 0.0;
            let dudy = 0.0;
            let dvdx = 0.0;
            let dvdy = 0.0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const n = this.grid[Math.floor((p.cX + i))][Math.floor((p.cY + j))];
                    const gx = p.gX[i] * p.pY[j];
                    const gy = p.pX[i] * p.gY[j];
                    dudx += n.u * gx;
                    dudy += n.u * gy;
                    dvdx += n.v * gx;
                    dvdy += n.v * gy;
                }
            }

            const w1 = dudy - dvdx;
            const wT0 = w1 * p.force1;
            const wT1 = 0.5 * w1 * (p.force0 - p.force2);
            let D00 = dudx;
            const D01 = 0.5 * (dudy + dvdx);
            let D11 = dvdy;
            let trace = 0.5 * (D00 + D11);
            D00 -= trace;
            D11 -= trace;
            p.force0 += -wT0 + D00 - this.yieldRate * p.force0;
            p.force1 += wT1 + D01 - this.yieldRate * p.force1;
            p.force2 += wT0 + D11 - this.yieldRate * p.force2;

            const norm = p.force0 * p.force0 + 2.0 * p.force1 * p.force1 + p.force2 * p.force2;
            if ((this.mode > -1) || (norm > 5.0)) {
                p.force0 = (p.force1 = p.force2 = 0.0);
            }

            const cx = Math.floor(p.x);
            const cy = Math.floor(p.y);
            const cxi = Math.floor(cx + 1);
            const cyi = Math.floor(cy + 1);

            const p00 = this.grid[cx][cy].m;
            const x00 = this.grid[cx][cy].gX;
            const y00 = this.grid[cx][cy].gY;
            const p01 = this.grid[cx][cyi].m;
            const x01 = this.grid[cx][cyi].gX;
            const y01 = this.grid[cx][cyi].gY;
            const p10 = this.grid[cxi][cy].m;
            const x10 = this.grid[cxi][cy].gX;
            const y10 = this.grid[cxi][cy].gY;
            const p11 = this.grid[cxi][cyi].m;
            const x11 = this.grid[cxi][cyi].gX;
            const y11 = this.grid[cxi][cyi].gY;

            const pdx = p10 - p00;
            const pdy = p01 - p00;
            const C20 = 3.0 * pdx - x10 - 2.0 * x00;
            const C02 = 3.0 * pdy - y01 - 2.0 * y00;
            const C30 = -2.0 * pdx + x10 + x00;
            const C03 = -2.0 * pdy + y01 + y00;
            const csum1 = p00 + y00 + C02 + C03;
            const csum2 = p00 + x00 + C20 + C30;
            const C21 = 3.0 * p11 - 2.0 * x01 - x11 - 3.0 * csum1 - C20;
            const C31 = -2.0 * p11 + x01 + x11 + 2.0 * csum1 - C30;
            const C12 = 3.0 * p11 - 2.0 * y10 - y11 - 3.0 * csum2 - C02;
            const C13 = -2.0 * p11 + y10 + y11 + 2.0 * csum2 - C03;
            const C11 = x01 - C13 - C12 - x00;

            const u = p.x - cx;
            const u2 = u * u;
            const u3 = u * u2;
            const v = p.y - cy;
            const v2 = v * v;
            const v3 = v * v2;
            const density = p00 + x00 * u + y00 * v + C20 * u2 + C02 * v2 +
                C30 * u3 + C03 * v3 + C21 * u2 * v + C31 * u3 * v + C12 *
                u * v2 + C13 * u * v3 + C11 * u * v;
            let pressure = (this.stiffness + p.stiffness) / Math.max(1.0, this.density) * (
                density - this.density);
            if (pressure > 2.0) {
                pressure = 2.0;
            }

            let fx = 0.0; let fy = 0.0;
            if (p.x < 3.0) {
                fx += 3.0 - p.x;
            } else if (p.x > this.gridSizeX - 4) {
                fx += this.gridSizeX - 4 - p.x;
            }
            if (p.y < 3.0) {
                fy += 3.0 - p.y;
            } else if (p.y > this.gridSizeY - 4) {
                fy += this.gridSizeY - 4 - p.y;
            }

            trace *= this.stiffness + p.stiffness;
            const T00 = this.elasticity * p.force0 + this.viscosity * D00 + pressure + this.bulkViscosity * trace;
            const T01 = this.elasticity * p.force1 + this.viscosity * D01;
            const T11 = this.elasticity * p.force2 + this.viscosity * D11 + pressure + this.bulkViscosity * trace;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const n = this.grid[Math.floor((p.cX + i))][Math.floor((p.cY + j))];
                    const phi = p.pX[i] * p.pY[j];
                    const dx = p.gX[i] * p.pY[j];
                    const dy = p.pX[i] * p.gY[j];

                    n.aX += -(dx * T00 + dy * T01) + fx * phi;
                    n.aY += -(dx * T01 + dy * T11) + fy * phi;
                }
            }
        }

        for (let ai = 0, len = this.active.length; ai < len; ai++) {
            const n = this.active[ai];
            if (n.m > 0.0) {
                n.aX /= n.m;
                n.aY /= n.m;
                n.u = 0.0;
                n.v = 0.0;
            }
        }
        const currentParticles: EngineParticle[] = [];
        this.currentParticles = currentParticles;
        for (let pi = 0, len = this.particles.length; pi < len; pi++) {
            const p = this.particles[pi];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const n = this.grid[Math.floor((p.cX + i))][Math.floor((p.cY + j))];
                    const phi = p.pX[i] * p.pY[j];
                    p.u += phi * n.aX;
                    p.v += phi * n.aY;
                }
            }
            p.v += (this.gravity + p.individualGravity);
            for (const name of Object.keys(points)) {
                const info = points[name];
                const size = info!.size || 10.0;
                if (info) {
                    info.active = info.activePreviously;
                    if (info.active) {
                        const vx = Math.abs(p.x - info.x! / this.influenceMultiplier);
                        const vy = Math.abs(p.y - info.y! / this.influenceMultiplier);
                        if ((vx < size) && (vy < size)) {
                            const weight = (1.0 - vx / size) * (1.0 - vy / size);
                            p.u += weight * (info.calculatedX! - p.u);
                            p.v += weight * (info.calculatedY! - p.v);
                            currentParticles.push(p);
                        }
                    }
                }
            }
            const x = p.x + p.u;
            const y = p.y + p.v;
            if (x < 2.0) {
                p.u += 2.0 - x + Math.random() * 0.01;
            } else if (x > this.gridSizeX - 3) {
                p.u += this.gridSizeX - 3 - x - Math.random() * 0.01;
            }
            if (y < 2.0) {
                p.v += 2.0 - y + Math.random() * 0.01;
            } else if (y > this.gridSizeY - 3) {
                p.v += this.gridSizeY - 3 - y - Math.random() * 0.01;
            }
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const n = this.grid[Math.floor((p.cX + i))][Math.floor((p.cY + j))];
                    const phi = p.pX[i] * p.pY[j];
                    n.u += phi * p.u;
                    n.v += phi * p.v;
                }
            }
        }
        for (let ai = 0, len = this.active.length; ai < len; ai++) {
            const n = this.active[ai];
            if (n.m > 0.0) {
                n.u /= n.m;
                n.v /= n.m;
            }
        }
        for (let pi = 0, len = this.particles.length; pi < len; pi++) {
            const p = this.particles[pi];
            let gu = 0.0; let gv = 0.0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const n = this.grid[Math.floor((p.cX + i))][Math.floor((p.cY + j))];
                    const phi = p.pX[i] * p.pY[j];
                    gu += phi * n.u;
                    gv += phi * n.v;
                }
            }

            p.gU = gu;
            p.gV = gv;

            p.x += gu;
            p.y += gv;
            p.u += this.smoothing * (gu - p.u);
            p.v += this.smoothing * (gv - p.v);
        }
        const keys = Object.keys(points);
        keys.forEach((key) => {
            const info = points[key];
            if (info) {
                if (info.autoRemove) {
                    points[key] = undefined;
                }
            }
        });
    }

    private buildGrid() {
        for (let i = 0; i < this.gridSizeX; i++) {
            const newGrid: Node[] = [];
            newGrid.length = this.gridSizeY;
            this.grid[i] = newGrid;
            for (let j = 0; j < this.gridSizeY; j++) {
                newGrid[j] = new Node();
            }
        }
    }
}
