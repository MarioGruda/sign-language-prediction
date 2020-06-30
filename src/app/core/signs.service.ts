import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SignsService {

  private baseurl = 'https://jupiter.fh-swf.de/sign-language';
  private modelUrl = '/vgg19_224_224_v2';
  constructor(private httpClient: HttpClient) { }

  getModels() {
    return this.httpClient.get(this.baseurl + '/model_info');
  }

  setModelUrl(modelUrl) {
    this.modelUrl = modelUrl;
  }

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
      signs.push(new Sign('nothing', '/assets/signs/nothing.png'));
    }

    return signs;
  }

  predictSign(image: string) {
    const base64 = image.split(',')[1];
    return this.httpClient.post(this.baseurl + this.modelUrl, { image_base_64: base64 });
  }
}


export class Sign {

  active = false;
  key: string;

  constructor(public sign: string, public url: string = '') {

    this.key = sign;

    this.sign = this.sign === 'nothing' ? '&empty;' : this.sign;

    if (!this.url) {
      this.url = `/assets/signs/${sign}.png`;
    }

  }
}
