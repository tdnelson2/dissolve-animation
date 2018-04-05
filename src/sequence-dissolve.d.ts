import { DissolveAnimation } from './dissolve-animation';
export declare class SequenceDissolve extends DissolveAnimation {
    constructor(dataArray: any[], staticKlasses?: string, interval?: number, transitionDuration?: number, fadeInOverride?: string, fadeOutOverride?: string);
    animate(): void;
}
