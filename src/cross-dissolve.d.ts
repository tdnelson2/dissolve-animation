import { DissolveAnimation } from './dissolve-animation';
export declare class CrossDissolve extends DissolveAnimation {
    constructor(dataArray: any[], staticKlasses?: string, interval?: number, transitionDuration?: number, fadeInOverride?: string, fadeOutOverride?: string);
    animate(): void;
}
