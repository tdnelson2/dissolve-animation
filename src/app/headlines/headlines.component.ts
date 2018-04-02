import { Component, OnInit } from '@angular/core';

import { SequenceDissolve } from '../dissolve-animation/sequence-dissolve';

import { headlines } from './headlines';
@Component({
  selector: 'app-headlines',
  templateUrl: './headlines.component.html',
  styleUrls: ['./headlines.component.css',  '../dissolve-animation/styles.css']
})
export class HeadlinesComponent implements OnInit {

  public sequenceDissolve: SequenceDissolve;
  public headlines: any[];

  constructor() { }

  ngOnInit() {
    this.headlines = headlines;
    this.sequenceDissolve = new SequenceDissolve(this.headlines,
                                                 3000,
                                                 5000);
    this.sequenceDissolve.animate();
  }
}
