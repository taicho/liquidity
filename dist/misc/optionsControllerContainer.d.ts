import { ParticleGroup } from '../base/ParticleGroup';
import { Renderer } from '../base/renderer';
import { OptionsControllerGroup } from './optionsControllerGroup';
export declare class OptionsControllerContainer extends OptionsControllerGroup {
    group: ParticleGroup;
    tint: string;
    blur: number;
    name: string;
    constructor(renderer: Renderer, gui: dat.GUI, group: ParticleGroup);
    add(): void;
    decimalToHex(d: number, padding?: number): string;
    destroy(): void;
    private reapplyFolderNames;
}
