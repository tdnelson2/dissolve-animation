import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

// import { NYTKEY } from '../../../../SECRETS/nyt-key';

@Injectable()
export class NytimesService {
  private nytURL =
  `https://api.nytimes.com/svc/news/v3/content/all/business%20day.json?api-key=6a6abed21d7d4ab081909e80793e5bdd`;

  constructor(private http: HttpClient) {}

  public fetchStories():Observable<any> {
    return this.http.get(this.nytURL);
  }
}
