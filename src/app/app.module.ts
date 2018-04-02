import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule }        from '@angular/common/http';

import { PhotoService }   from './photo.service';
import { NytimesService } from './nytimes.service';


import { AppComponent } from './app.component';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { HeadlinesComponent } from './headlines/headlines.component';


@NgModule({
  declarations: [
    AppComponent,
    SlideshowComponent,
    HeadlinesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    PhotoService,
    NytimesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
