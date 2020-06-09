import { Component } from '@angular/core';

@Component({
  selector: 'app-signs',
  templateUrl: './signs.component.html',
  styleUrls: ['./signs.component.scss']
})
export class SignsComponent {

  signs: Array<Sign> = [];

  constructor() {

    for (let i = 0; i < 25; i++) {

      if (i === 9) {
        continue;
      }

      this.signs.push(new Sign(String.fromCharCode(i + 65)));
    }
  }

}

export class Sign {

  url: string;

  constructor(public sign: string) {
    this.url = `/assets/signs/${sign}.png`;

  }
}
