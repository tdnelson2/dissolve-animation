import { DissolveAnimation } from './dissolve-animation'
import { TransitionItem } from './transition-item';

export class CrossDissolve extends DissolveAnimation {

  constructor( dataArray:           any[],
             { staticKlasses =      <string> undefined,
               interval =           <number> undefined,
               transitionDuration = <number> undefined,
               fadeInOverride =     <string> undefined,
               fadeOutOverride =    <string> undefined,
               eventIdentifier =    <string> undefined } = {}) {

    super(dataArray, staticKlasses, interval, transitionDuration ? transitionDuration : 3000,
               fadeInOverride, fadeOutOverride, eventIdentifier, transitionDuration !== undefined);
  };

  public animate(): void {
    if (!this.itemA && !this.itemB) {
      this.itemA = new TransitionItem(1, 'show', this.visibleKlass(), this.next());
      this.itemB = new TransitionItem(2, 'hide', this.invisibleKlass(), this.next());
    }

    // `a` is the active track and `b` is the
    // track to which `a` dissolves.
    // `isOnTop` indicates whether `a` has a
    // higher z-index than `b`
    const [a, b] = this.getABTracks();
    const isOnTop = a.track === 1;

    this.visible(a).then(() => {
      if (isOnTop) b.klass = this.visibleKlass();

      // If `a` has a higher z-index than `b`,
      // we can simply fade out to reveal `b`.
      // Otherwise if `a` has a lower z-index,
      // `b` needs to fade in.
      return isOnTop ? this.fadeOut(a) : this.fadeIn(b);
    }).then(() => {
      if (isOnTop) a.klass = this.invisibleKlass();
      a.data = this.next();
      this.animate();
    });
  }
}