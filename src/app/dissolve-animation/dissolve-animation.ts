import { TransitionItem } from './transition-item';


export class DissolveAnimation {

  public itemA: TransitionItem;
  public itemB: TransitionItem;
  public data: any;
  public i = 0;
  public db: any[];
  public transitionDuration: number;
  public interval: number;
  public staticKlasses: string;
  private fadeInCSSLabel = 'da-fade-in';
  private fadeOutCSSLabel = 'da-fade-out';

  constructor( db: any[],
               transitionDuration: number,
               interval: number,
               staticKlasses: string,
               fadeInOverride: string,
               fadeOutOverride: string) {
    this.db = db;
    this.transitionDuration = transitionDuration;
    this.staticKlasses = staticKlasses;
    this.interval = interval;
    if (fadeInOverride) this.fadeInCSSLabel = fadeInOverride;
    if (fadeOutOverride) this.fadeOutCSSLabel = fadeOutOverride;
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

  private promisefy = (item: any, klasses, delay):Promise<any> => {
    item.klass = this.klasses(klasses);
    return new Promise((r, j) => setTimeout(r, delay, item));
  }

  public fadeOut   = it => this.promisefy(it, this.fadeOutKlass(), this.transitionDuration);
  public fadeIn    = it => this.promisefy(it, this.fadeInKlass(), this.transitionDuration);
  public invisible = it => this.promisefy(it, this.invisibleKlass(), this.interval);
  public visible   = it => this.promisefy(it, this.visibleKlass(), this.interval);
  public hidden    = it => this.promisefy(it, this.hiddenKlass(), this.interval);
  public shown     = it => this.promisefy(it, this.shownKlass(), this.interval);

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
    this.i = this.i === this.db.length-1 ? 0 : this.i+1;
    return this.db[index];
  }
}