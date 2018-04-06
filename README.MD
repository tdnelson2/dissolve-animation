# DissolveAnimation

This module implements ES6 Promises, classes, and subclasses under the hood to control various CSS animations. It's currently only setup to work with Angular, but everything is writen in vanilla JavaScript (TypeScript) so it could easily be adapted to work with other frameworks.

## Background

I decided to create this after I was unable to find other libraries that are fully compatible with all browsers. I also couldn't find a simple implementation for cross dissolves and sequence dissolves.

## Getting started

Eventually this will be a npm package but for now simply `cd` into the root of your project and run `git clone --depth=1 --branch=master https://github.com/tdnelson2/dissolve-animation.git`.

## Animation Types

There are currently only two dissolve types:

* **Cross Dissolve**: One element fades out while another element fades in simultaneously.
* **Sequence Dissolve**: One element fades out then the second element fades in.

## Dissolve `class` Parameters

* Both `CrossDissolve` and `SequenceDissolve` share the following signature:

```typescript
CrossDissolve(dataArray: any[], staticKlasses?: string, interval: number?, transitionDuration: number?, fadeInOverride?: string, fadeOutOverride?: string);
```

* `dataArray`: an array of `object`s containing the data you want to use to populate the html template.
* `staticKlasses`: a `string` containing the CSS class(es) you want applied to all elements (leave blank if you don't want any CSS classes applied).
* `interval`: `number` in miliseconds indicating the interval between transitions (`8000` if none is provided).
* `transitionDuration`: `number` in miliseconds indicating length of the transition (`3000` if none is provided).
* `fadeInOverride`: Optional CSS class containing style information needed to execute the fade in. Note: If you change the transition duration, the parameter is required.
* `fadeOutOverride`: Same as `fadeInOverride` except the class you want to use to fade out.
  * Note: [see here](#adjust-transition-duration) for more information about how to implement the fade in/fade out classes

## Using DissolveAnimation With Angular Templates

* DissolveAnimation provides the template with two instances of the `TransitionItem` class: `itemA` and `itemB`. `itemA` should have a higher `z-index` than `itemB`. Consequently, html elements containing `itemA` should be placed below those containing `itemB`. See [here](#implementing-crossdissolve-in-the-template-) and [here](#implementing-sequencedissolve-in-the-template-) for more details on how `TransitionItem`s  can be used in templates.

#### `TransitionItem` signature:

```typescript
TransitionItem(track: number, state: string, klass: string, data: string);
```

* `track`: indicates which item has a higher `z-index`. DissolveAnimation assigns `itemA` track `1` and `itemB` track `2`.
* `state`: indicates whether the item is in a `'hide'` or `'show'` state (intended for internal use).
* `klass`: is a `string` containing the CSS class(es) assigned to the item. `klass` gets updated depending on the `state` and whether or not a transition is in progress.
* `data`: is an item from `dataArray` which is specified when instantiating `CrossDissolve`/`SequenceDissolve` ([see above](#dissolve-class-parameters)).

## Cross Dissolve Example

* Create a new angular project: `ng new my-animation` ([see here](https://angular.io/guide/quickstart) if you don't have angular installed).
* `cd` into the root of your project and run `git clone --depth=1 --branch=master https://github.com/tdnelson2/dissolve-animation.git`. You should now have a folder inside your project named `dissolve-animation`.
* Create a new service called `photo`: `ng g service photo --module=app`.
* In `src/app/photo.service.ts` replace the boilerplate code with the following code to implement the ability to fetch photos from picsum.com:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class PhotoService {

  constructor(private http: HttpClient) { }

  public fetchPhotos():Observable<any> {
    return this.http.get('https://picsum.photos/list');
  }
}
```

* In `src/app/app.module.ts` add `import { HttpClientModule } from '@angular/common/http';` at the top and include `HttpClientModule` in the `imports` array.

#### Implementing `CrossDissolve` in a component:

* Create a new component named `slideshow`: `ng g component slideshow`.
* In `src/app/app.component.html` delete all the boilerplate html and add `<app-slideshow></app-slideshow>`.
* Also replace the boilerplate code in `src/app/slideshow/slideshow.component.ts` with the following:

```typescript
import { Component, OnInit } from '@angular/core';

import { CrossDissolve } from '../../../dissolve-animation/cross-dissolve';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['../../../dissolve-animation/styles.css', './slideshow.component.css']
})
export class SlideshowComponent implements OnInit {

  public crossDissolve: CrossDissolve;

  constructor( public photoService: PhotoService ) { }

  ngOnInit() {
    this.photoService.fetchPhotos().subscribe((response: any) => {
      const start = this.getRandomInt(0,response.length-11);
      const photos = response.slice(start, start+10);
      this.addData(photos);
      this.crossDissolve = new CrossDissolve(photos, 'bg');
      this.crossDissolve.animate();
    });
  }

  private addData(photos: any[]): void {
    for (let photo of photos) {
      photo['style'] = this.buildBGStyle(photo.id);
    }
  }

  private getRandomInt(min: number, max:number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private buildImgUrl(id: number): string {
    const width = Math.floor(window.innerWidth*window.devicePixelRatio);
    const height = Math.floor(window.innerHeight*window.devicePixelRatio);
    return `https://picsum.photos/${width}/${height}/?image=${id}`
  }

  private buildBGStyle(id: number): any {
    const url = this.buildImgUrl(id);
    return {'background-image':  `url(${url})`};
  }
}
```

#### Implementing `CrossDissolve` in the template:

* Replace the boilerplate code in `src/app/slideshow/slideshow.component.html` with the following:

```html
<div *ngIf="crossDissolve &&
      crossDissolve.itemA.data &&
      crossDissolve.itemB.data">
  <div [ngClass]="crossDissolve.itemB.klass"
       [ngStyle]="crossDissolve.itemB.data.style">
  </div>
  <div [ngClass]="crossDissolve.itemA.klass"
       [ngStyle]="crossDissolve.itemA.data.style">
  </div>
</div>
```

#### Implementing `CrossDissolve` in the CSS:

* Add the following in `src/app/slideshow/slideshow.component.css`:

```css
.bg {
  left: 0;
  top: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
```

* Run `ng serve --open` and a fabulous full screen slideshow should appear complete with absurdly long cross dissolves. To learn how to speed them up, skip to [Adjust Transition Duration](#adjust-transition-duration).

## Sequence Dissolve Example

#### Implementing `SequenceDissolve` in a component:

* Create a new component named `headlines`: `ng g component headlines`.
* In `src/app/app.component.html` add `<app-headlines></app-headlines>` BELOW `<app-slideshow></app-slideshow>`. Note: If you put it above `<app-slideshow>`, it will be covered by the slideshow. However, in production, you'll likely want the slideshow to load last so it would be best to put the slideshow towards the bottom and adjust the `z-index` on the other elements to ensure they appear above.
* In `src/app/headlines/` create a new file named `headlines.ts` and add the following:

```typescript
export const HEADLINES =
[
{ headline: "Lorem ipsum dolor sit amet", url: "http://www.example.com/" },
{ headline: "consectetur adipiscing elit", url: "http://www.example.com/" },
{ headline: "sed do eiusmod tempor incididunt", url: "http://www.example.com/" },
{ headline: "Ut enim ad minim veniam", url: "http://www.example.com/" }
];
```

* In `src/app/headlines/headlines.component.ts` replace the boilerplate code with the following:

```typescript
import { Component, OnInit } from '@angular/core';

import { SequenceDissolve } from '../../../dissolve-animation/sequence-dissolve';

import { HEADLINES } from './headlines';
@Component({
  selector: 'app-headlines',
  templateUrl: './headlines.component.html',
  styleUrls: ['../../../dissolve-animation/styles.css', './headlines.component.css']
})
export class HeadlinesComponent implements OnInit {

  public sequenceDissolve: SequenceDissolve;

  constructor() { }

  ngOnInit() {
    this.sequenceDissolve = new SequenceDissolve(HEADLINES, 'headline');
    this.sequenceDissolve.animate();
  }
}
```

#### Implementing `SequenceDissolve` in the CSS:

* In `src/app/headlines/headlines.component.css` add the following:

```css
.headline {
  color: #ffffff;
  padding-top: 100px;
  text-align: center;
}

.headline a {
  color: #ffffff;
  text-decoration: none;
}

.headline a:hover {
  text-decoration: underline;
}
```

#### Implementing `SequenceDissolve` in the template:

* Finally, in `src/app/headlines/headlines.component.html` replace the boilerplate code with the following:

```html
<div *ngIf="sequenceDissolve &&
            sequenceDissolve.itemA &&
            sequenceDissolve.itemB">
    <h1 [ngClass]="sequenceDissolve.itemB.klass">
      <a href="{{sequenceDissolve.itemB.data.url}}"
         target="_blank">
        {{sequenceDissolve.itemB.data.headline}}
      </a>
    </h1>
    <h1 [ngClass]="sequenceDissolve.itemA.klass">
      <a href="{{sequenceDissolve.itemA.data.url}}"
         target="_blank">
        {{sequenceDissolve.itemA.data.headline}}
      </a>
    </h1>
</div>
```

## Adjust The Interval Between Transitions

* Note: for this example we use `CrossDissolve` but `SequenceDissolve` works in the exact same way.
* In `src/app/slideshow/slideshow.component.ts` add `3000` as the third parameter (interval in milliseconds) like so:

```typescript
this.crossDissolve = new CrossDissolve(photos, 'bg', 3000);
```

* Save the changes. Now the interval between transitions should be three seconds instead of eight.
* Note: since the next image is always loading in the background, there should be a lower chance that the the image will not be fully loaded once the transition occurs. However, if you know your website will be viewed over a slow connection, it is a good idea to keep the intervals long in order to ensure enough load time before the next image fades in.

## Adjusting `CrossDissolve` Transition Duration

* Add the following to `src/app/slideshow/slideshow.component.css`:

```css
.my-cross-dissolve-fade-in {
  -webkit-animation: daFadeIn 1s linear;
  -moz-animation: daFadeIn 1s linear;
  -o-animation: daFadeIn 1s linear;
  animation: daFadeIn 1s linear;
}

.my-cross-dissolve-fade-out {
  -webkit-animation: daFadeOut 1s linear;
  -moz-animation: daFadeOut 1s linear;
  -o-animation: daFadeOut 1s linear;
  animation: daFadeOut 1s linear;
}
```

* In `src/app/slideshow/slideshow.component.ts` add three more parameters to  `CrossDissolve` like so:

```typescript
this.crossDissolve = new CrossDissolve(photos, 'bg', 3000, 1000, 'my-cross-dissolve-fade-in', 'my-cross-dissolve-fade-out');
```

* The first parameter added is the new transition duration in miliseconds. The last two reflect the two classes we added to `slideshow.component.css`.

* After saving, the page should reload and the transitions should only be one second long.

## Adjusting `SequenceDissolve` Transition Duration

* Add the following to `src/app/headlines/headlines.component.css`:

```css
.my-sequence-dissolve-fade-in {
  -webkit-animation: daFadeIn calc(0.5s/.96) linear;
  -moz-animation: daFadeIn calc(0.5s/.96) linear;
  -o-animation: daFadeIn calc(0.5s/.96) linear;
  animation: daFadeIn calc(0.5s/.96) linear;
}

.my-sequence-dissolve-fade-out {
  -webkit-animation: daFadeOut calc(0.5s/.96) linear;
  -moz-animation: daFadeOut calc(0.5s/.96) linear;
  -o-animation: daFadeOut calc(0.5s/.96) linear;
  animation: daFadeOut calc(0.5s/.96) linear;
}
```

* In `src/app/headlines/headlines.component.ts` add three more parameters to  `SequenceDissolve` like so:

```typescript
this.sequenceDissolve = new SequenceDissolve(HEADLINES, 'headline', 3000, (500/.96), 'my-sequence-dissolve-fade-in', 'my-sequence-dissolve-fade-out');
```

* The main difference between `CrossDissolve` and `SequenceDissolve` is the transitions do not occur simutaneously so if we set the duration to one-half of a second (500 miliseconds), the entire sequence dissove would take around one second to complete. Notice I say "around one second". I say this because the duration of each transition is decreased by 4% to avoid a flash when next elements appears. If we want the true duration to be 500 miliseconds, we must divide it by .96. The same principle applies to the CSS: if we want the true duration to be .5 we must divide it by .96.