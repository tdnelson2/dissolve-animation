import { Component, OnInit, Input } from '@angular/core';
import { style, transition, animate, trigger, state } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  template: `<!-- class title sets both to the same absolute location -->
             <h1 class="title" [@crossfade]="state1">{{title1}}</h1>
             <h1 class="title" [@crossfade]="state2">{{title2}}</h1>`,
  animations: [
          trigger('crossfade', [
              state('show', style({ opacity: 1 })),
              state('hide', style({ opacity: 0 })),
              transition('* => show', animate('1s ease-in')),
              transition('show => hide', animate('1s ease-out'))
          ])]
})
export class AppComponent implements OnInit {

    title1 = 'BOOM!';
    title2 = 'POP!';
    state1 = 'hide';
    state2 = 'hide';
    titles = ['POW', 'BLAST', 'RUMBLE', 'SHATTER']
    i = 0;

     switchTitles(newTitle) {
        if (this.state1 === 'show') {
            this.title2 = newTitle;
            this.state1 = 'hide';
            this.state2 = 'show';
        } else {
            this.title1 = newTitle;
            this.state2 = 'hide';
            this.state1 = 'show';
        }
    }

    constructor( ) { }

    ngOnInit() { this.queueStories() }

  queueStories(): void {

      setInterval(() => {
        this.i = this.i === this.titles.length-1 ? 0 : this.i+1;
        this.switchTitles(this.titles[this.i]);
        console.log(this.titles[this.i]);
      },4000);
  }

}
