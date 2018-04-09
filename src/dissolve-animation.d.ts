import { TransitionItem } from './transition-item';
export declare class DissolveAnimation {
    itemA: TransitionItem;
    itemB: TransitionItem;
    data: any;
    i: number;
    dataArray: any[];
    transitionDuration: number;
    interval: number;
    staticKlasses: string;
    private fadeInCSSLabel;
    private fadeOutCSSLabel;
    private invisibleCSSLabel;
    private visibleCSSLabel;
    private hiddenCSSLabel;
    private shownCSSLabel;
    private eventIdentifier;
    constructor(dataArray: any[], staticKlasses: string, interval: number, transitionDuration: number, fadeInOverride: string, fadeOutOverride: string, eventIdentifier: string, transitionDurationWasProvided?: boolean);
    klasses(klasses: string): string;
    fadeOutKlass: () => string;
    fadeInKlass: () => string;
    invisibleKlass: () => string;
    visibleKlass: () => string;
    hiddenKlass: () => string;
    shownKlass: () => string;
    private promisefy;
    fadeOut: (it: TransitionItem) => Promise<any>;
    fadeIn: (it: TransitionItem) => Promise<any>;
    invisible: (it: TransitionItem) => Promise<any>;
    visible: (it: TransitionItem) => Promise<any>;
    hidden: (it: TransitionItem) => Promise<any>;
    shown: (it: TransitionItem) => Promise<any>;
    getABTracks(): TransitionItem[];
    next(): any;
    private emitEvent(label);
    private itemName(item);
}