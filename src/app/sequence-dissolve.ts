import { DissolveAnimation } from './dissolve-animation'
import { TransitionItem } from './transition-item';

export class SequenceDissolve extends DissolveAnimation {

  constructor(db, transitionDuration, interval, staticKlasses) {
    super(db, transitionDuration, interval, staticKlasses);
  };

  public animate(): void {
    if (!this.itemA && !this.itemB) {
      this.itemA = new TransitionItem(1, 'show', this.hiddenKlass(), this.next());
      this.itemB = new TransitionItem(2, 'hide', this.hiddenKlass(), this.next());
    }

    const [a, b] = this.getABTracks();
    this.visible(a).then(() => {
      return this.fadeOut(a);
    }).then(() => {
      [a.klass, a.data] = [this.hiddenKlass(), this.next()];
      return this.fadeIn(b);
    }).then(() => {
      this.animate();
    });
  }
}