import { TransitionItem } from './transition-item';


export class DissolveAnimation {

  public itemA: TransitionItem;
  public itemB: TransitionItem;
  public data: any;
  public i = 0;
  public db: any[];
  public duration: number;
  public interval: number;
  public staticKlasses: string;

  constructor( db: any[],
               transitionDuration: number,
               interval: number,
               staticKlasses: string = undefined ) {
    this.db = db;
    this.duration = transitionDuration;
    this.staticKlasses = staticKlasses;
    this.interval = interval;
  };

  public klasses(klasses: string):string {
    return this.staticKlasses === undefined ? klasses : `${klasses} ${this.staticKlasses}`;
  }

  public fadeOutKlass   = () => this.klasses('fade-out');
  public fadeInKlass    = () => this.klasses('fade-in');
  public invisibleKlass = () => this.klasses('invisible');
  public hiddenKlass    = () => this.klasses('hidden');
  public visibleKlass   = () => this.klasses('visible');

  private promisefy = (item: any, klasses, delay):Promise<any> => {
    item.klass = this.klasses(klasses);
    return new Promise((r, j) => setTimeout(r, delay, item));
  }

  public fadeOut   = it => this.promisefy(it, this.fadeOutKlass(), this.duration);
  public fadeIn    = it => this.promisefy(it, this.fadeInKlass(), this.duration);
  public invisible = it => this.promisefy(it, this.invisibleKlass(), this.interval);
  public hidden    = it => this.promisefy(it, this.hiddenKlass(), this.interval);
  public visible   = it => this.promisefy(it, this.visibleKlass(), this.interval);

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