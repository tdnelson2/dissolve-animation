import { Component, OnInit } from '@angular/core';

import { SequenceDissolve } from '../../../dissolve-animation/sequence-dissolve';

import { NytimesService } from '../nytimes.service';

@Component({
  selector: 'app-headlines',
  templateUrl: './headlines.component.html',
  styleUrls: ['../../../dissolve-animation/styles.css', './headlines.component.css']
})
export class HeadlinesComponent implements OnInit {

  public sequenceDissolve: SequenceDissolve;

  constructor(private nytService: NytimesService) {}

  ngOnInit() {
    this.nytService.fetchStories().subscribe((response: any) => {
      this.sequenceDissolve = new SequenceDissolve(response.results,
                                                   3000,
                                                   5000);
      this.sequenceDissolve.animate();
    });
  }
}
