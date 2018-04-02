export class TransitionItem {
  public track: number;
  public state: string;
  public klass: string;
  public data: any;

  constructor(track, state, klass, data) {
    this.track = track;
    this.state = state;
    this.klass = klass;
    this.data = data;
  }
}