import { Component, OnInit, Input } from '@angular/core';
import { style, transition, animate, trigger, state } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs/Observable';

import { PhotoService } from './photo.service';

  // template: `<h1>This is some text</h1>
  //            <div class="solid"></div>
  //            <img class="bg-img" [@crossfade]="state1" src="{{photoA.url}}">
  //            <img class="bg-img" [@crossfade]="state2" src="{{photoB.url}}">`,

@Component({
  selector: 'app-root',
  template: `<h1>This is some text</h1>
             <!-- <div class="solid"></div> -->
             <div class="bg" [@crossfade]="state1" [ngStyle]="photoA.style"></div>
             <div class="bg" [@crossfade]="state2" [ngStyle]="photoB.style"></div>`,
  animations: [
          trigger('crossfade', [
              state('show', style({ opacity: 1 })),
              state('hide', style({ opacity: 0 })),
              transition('* => show', animate('3s linear')),
              transition('show => hide', animate('3s linear'))
          ])],
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  photos: any[] = [];
  photoA: any;
  photoB: any;
  state1 = 'show';
  state2 = 'hide';
  i = 1;

   switchPhotos(nextPhoto) {
      if (this.state1 === 'show') {
          this.state1 = 'hide';
          this.state2 = 'show';
          setTimeout(() => {
            this.photoA = nextPhoto;
          }, 3000);
      } else {
          this.state2 = 'hide';
          this.state1 = 'show';
          setTimeout(() => {
            this.photoB = nextPhoto;
          }, 3000);
      }
  }

  constructor( private photoService: PhotoService ) { }

  ngOnInit() {
    this.photoService.fetchPhotos().subscribe((response: any) => {
      const start = this.getRandomInt(0,response.length-11);
      this.photos = response.slice(start, start+10);
      this.addData();
      this.queuePhotos();
    });
  }

  private buildImgUrl(id) {
    const width = window.innerWidth*window.devicePixelRatio;
    const height = window.innerHeight*window.devicePixelRatio;
    return `https://picsum.photos/${width}/${height}/?image=${id}`
  }

  private addData() {
    for (let photo of this.photos) {
      photo['style'] = this.buildBGStyle(photo.id);
    }
  }


  private getRandomInt(min: number, max:number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private queuePhotos(): void {
    this.photoA = this.photos[0];
    this.photoB = this.photos[1];

    setInterval(() => {
      this.i = this.i === this.photos.length-1 ? 0 : this.i+1;
      this.switchPhotos(this.photos[this.i]);
      console.log(this.photos[this.i]);
    },8000);
  }

  private buildBGStyle(id) {
    const url = this.buildImgUrl(id);
    return {'background-image':  `url(${url})`};
  }

}
