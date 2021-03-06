import { DissolveAnimation } from './dissolve-animation'
import { TransitionItem } from './transition-item';

export class SequenceDissolve extends DissolveAnimation {

  constructor( dataArray:           any[],
             { staticKlasses =      <string> undefined,
               interval =           <number> undefined,
               transitionDuration = <number> undefined,
               fadeInOverride =     <string> undefined,
               fadeOutOverride =    <string> undefined,
               eventIdentifier =    <string> undefined } = {}) {

    const transitionDurationWasProvided = transitionDuration !== undefined;

    // Make the transition duration slightly shorter
    // to avoid a flash when the transition ends
    const tdAdjusted = transitionDuration ? Math.floor(transitionDuration*.96): 2900;

    super(dataArray, staticKlasses, interval, tdAdjusted, fadeInOverride,
          fadeOutOverride, eventIdentifier, transitionDurationWasProvided);
  };

  public animate(): void {
    if (!this.itemA && !this.itemB) {
      this.itemA = new TransitionItem(1, 'show', this.hiddenKlass(), this.next());
      this.itemB = new TransitionItem(2, 'hide', this.hiddenKlass(), this.next());
    }

    const [a, b] = this.getABTracks();
    this.shown(a).then(() => {
      return this.fadeOut(a);
    }).then(() => {
      [a.klass, a.data] = [this.hiddenKlass(), this.next()];
      return this.fadeIn(b);
    }).then(() => {
      this.animate();
    });
  }
}