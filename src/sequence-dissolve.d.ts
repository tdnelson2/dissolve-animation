import { DissolveAnimation } from './dissolve-animation';
export declare class SequenceDissolve extends DissolveAnimation {
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
