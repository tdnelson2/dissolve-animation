import { Component, OnInit } from '@angular/core';

import { CrossDissolve } from '../../../../dissolve-animation/cross-dissolve';

import { Observable } from 'rxjs/Observable';

import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['../../../../dissolve-animation/styles.css', './slideshow.component.css']
})
export class SlideshowComponent implements OnInit {

  public crossDissolve: CrossDissolve;

  constructor( public photoService: PhotoService ) { }

  ngOnInit() {
    this.photoService.fetchPhotos().subscribe((response: any) => {
      const start = this.getRandomInt(0,response.length-11);
      const photos = response.slice(start, start+10);
      this.addData(photos);
      this.crossDissolve = new CrossDissolve(photos,
                                             3000,
                                             8000,
                                             'bg');
      this.crossDissolve.animate();
    });
  }

  private addData(photos) {
    const date = new Date().toISOString();
    for (let photo of photos) {
      photo['date_added'] = date;
      photo['style'] = this.buildBGStyle(photo.id);
    }
  }

  private getRandomInt(min: number, max:number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private buildImgUrl(id) {
    const width = Math.floor(window.innerWidth*window.devicePixelRatio);
    const height = Math.floor(window.innerHeight*window.devicePixelRatio);
    return `https://picsum.photos/${width}/${height}/?image=${id}`
  }

  private buildBGStyle(id) {
    const url = this.buildImgUrl(id);
    return {'background-image':  `url(${url})`};
  }
}
