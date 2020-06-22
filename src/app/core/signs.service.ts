import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SignsService {

  constructor(private httpClient: HttpClient) { }

  getSigns(from = 0, to = 25, indcludeNothing = false) {

    if (from < 0 || to > 25) {
      throw new Error('Parameters out of range 0 - 25');
    }

    const signs: Array<Sign> = [];
    for (let i = from; i < to; i++) {

      if (i === 9) {
        continue;
      }

      signs.push(new Sign(String.fromCharCode(i + 65)));
    }

    if (indcludeNothing) {
      signs.push(new Sign('&empty;', '/assets/signs/nothing.png'));
    }

    return signs;
  }

  predictSign(image: string) {
    const base64 = image.split(',')[1];
    //  console.log(base64);
    return this.httpClient.post('https://jupiter.fh-swf.de/sign-language/cnn_5_150_150', { image_base_64: base64 });
  }
}


export class Sign {

  active = false;

  constructor(public sign: string, public url: string = '') {

    if (!this.url) {
      this.url = `/assets/signs/${sign}.png`;
    }

  }
}
