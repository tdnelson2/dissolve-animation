import { DissolveAnimation } from './dissolve-animation';
export declare class CrossDissolve extends DissolveAnimation {
    constructor(dataArray: any[], {staticKlasses, interval, transitionDuration, fadeInOverride, fadeOutOverride, eventIdentifier}?: {
        staticKlasses?: string;
        interval?: number;
        transitionDuration?: number;
        fadeInOverride?: string;
        fadeOutOverride?: string;
        eventIdentifier?: string;
    });
    animate(): void;
}
