import { TransitionItem } from './transition-item';


export class DissolveAnimation {

  public itemA: TransitionItem;
  public itemB: TransitionItem;
  public data: any;
  public i = 0;
  public dataArray: any[];
  public transitionDuration: number;
  public interval: number;
  public staticKlasses: string;
  private fadeInCSSLabel: string;
  private fadeOutCSSLabel: string;
  private invisibleCSSLabel = 'da-invisible';
  private visibleCSSLabel = 'da-visible';
  private hiddenCSSLabel = 'da-hidden';
  private shownCSSLabel = 'da-shown';
  private eventIdentifier: string;

  constructor( dataArray:          any[],
               staticKlasses:      string,
               interval:           number=8000,
               transitionDuration: number,
               fadeInOverride:     string,
               fadeOutOverride:    string,
               eventIdentifier:    string,
               transitionDurationWasProvided=false) {
    this.dataArray = dataArray;
    this.staticKlasses = staticKlasses;
    this.interval = interval;
    this.transitionDuration = transitionDuration;
    this.eventIdentifier = eventIdentifier === undefined ? '' : eventIdentifier+'--';

    if (transitionDurationWasProvided && (!fadeInOverride || !fadeOutOverride)) {
      throw 'ERROR: `fadeInOverride` and `fadeOutOverride` are required '+
            'if you provide `transitionDuration`.';
    } else if (!transitionDurationWasProvided && (fadeInOverride || fadeOutOverride)) {
      throw 'ERROR: `fadeInOverride` and `fadeOutOverride` can only be '+
            'provided if `transitionDuration` is also provided';
    } else if (transitionDurationWasProvided && (fadeInOverride && fadeOutOverride)) {
      this.fadeInCSSLabel = fadeInOverride;
      this.fadeOutCSSLabel = fadeOutOverride;
    } else {
      this.fadeInCSSLabel = 'da-fade-in';
      this.fadeOutCSSLabel = 'da-fade-out';
    }
  };

  public klasses(klasses: string):string {
    return this.staticKlasses === undefined ? klasses : `${klasses} ${this.staticKlasses}`;
  }

  public fadeOutKlass   = () => this.klasses(this.fadeOutCSSLabel);
  public fadeInKlass    = () => this.klasses(this.fadeInCSSLabel);
  public invisibleKlass = () => this.klasses(this.invisibleCSSLabel);
  public visibleKlass   = () => this.klasses(this.visibleCSSLabel);
  public hiddenKlass    = () => this.klasses(this.hiddenCSSLabel);
  public shownKlass     = () => this.klasses(this.shownCSSLabel);

  private promisefy = (item: TransitionItem, klass: string, delay: number):Promise<any> => {
    const eventName = `${this.eventIdentifier}${this.itemName(item)}--${klass}`;
    this.emitEvent(`${eventName}--WILL-ADD`);
    item.klass = this.klasses(klass);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.emitEvent(`${eventName}--WILL-REMOVE`);
        resolve(item);
      }, delay);
    });
  }

  public fadeOut   = (it: TransitionItem) => this.promisefy(it, this.fadeOutCSSLabel, this.transitionDuration);
  public fadeIn    = (it: TransitionItem) => this.promisefy(it, this.fadeInCSSLabel, this.transitionDuration);
  public invisible = (it: TransitionItem) => this.promisefy(it, this.invisibleCSSLabel, this.interval);
  public visible   = (it: TransitionItem) => this.promisefy(it, this.visibleCSSLabel, this.interval);
  public hidden    = (it: TransitionItem) => this.promisefy(it, this.hiddenCSSLabel, this.interval);
  public shown     = (it: TransitionItem) => this.promisefy(it, this.shownCSSLabel, this.interval);

  public getABTracks(): TransitionItem[] {
    let a: TransitionItem;
    let b: TransitionItem;
    if (this.itemA.state === 'show') {
      [a, b] = [this.itemA, this.itemB];
    } else {
      [a, b] = [this.itemB, this.itemA];
    }
    this.data = b.data;

    // switch the `'hide'`/`'show'` order so
    // next time `a` and `b` get assigned to
    // the opposit items
    [a.state, b.state] = ['hide', 'show'];
    return [a, b];
  }

  public next(): any {
    const index = this.i;
    this.i = this.i === this.dataArray.length-1 ? 0 : this.i+1;
    return this.dataArray[index];
  }

  private emitEvent(label: string): void {
    const evt = new Event(label);
    document.dispatchEvent(evt);
  }

  private itemName(item: TransitionItem) {
    return item.track === 1 ? 'itemA' : 'itemB';
  }
}