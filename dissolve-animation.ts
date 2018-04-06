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

  constructor( dataArray:          any[],
               staticKlasses:      string,
               interval:           number=8000,
               transitionDuration: number,
               fadeInOverride:     string,
               fadeOutOverride:    string,
               transitionDurationWasProvided=false) {
    this.dataArray = dataArray;
    this.staticKlasses = staticKlasses;
    this.interval = interval;
    this.transitionDuration = transitionDuration;

    if (transitionDurationWasProvided && (!fadeInOverride || !fadeOutOverride)) {
      throw 'ERROR: parameter 5 (fade in CSS class name) '+
            'and 6 (fade out CSS class name) are required '+
            'if you provide a 3rd parameter (transition duration).';
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
  public invisibleKlass = () => this.klasses('da-invisible');
  public visibleKlass   = () => this.klasses('da-visible');
  public hiddenKlass    = () => this.klasses('da-hidden');
  public shownKlass     = () => this.klasses('da-shown');

  private promisefy = (item: TransitionItem, klass: string, delay: number):Promise<any> => {
    this.emitEvent(klass+'--WILL-ADD');
    item.klass = klass;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.emitEvent(klass+'--WILL-REMOVE');
        resolve(item);
      }, delay);
    });
  }

  public fadeOut   = (it: TransitionItem) => this.promisefy(it, this.fadeOutKlass(), this.transitionDuration);
  public fadeIn    = (it: TransitionItem) => this.promisefy(it, this.fadeInKlass(), this.transitionDuration);
  public invisible = (it: TransitionItem) => this.promisefy(it, this.invisibleKlass(), this.interval);
  public visible   = (it: TransitionItem) => this.promisefy(it, this.visibleKlass(), this.interval);
  public hidden    = (it: TransitionItem) => this.promisefy(it, this.hiddenKlass(), this.interval);
  public shown     = (it: TransitionItem) => this.promisefy(it, this.shownKlass(), this.interval);

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
}