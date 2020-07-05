import { Component, EventEmitter, Output } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent {

  @Output() countDown: EventEmitter<void>;
  coundDown$: Observable<number>;

  private value = 0;

  constructor() {

    this.countDown = new EventEmitter();
    this.coundDown$ = interval(150)
      .pipe(
        map(() => {

          if (this.value === 100) {
            this.value = 0;
          } else {
            this.value += 10;
          }

          return this.value;

        }),
        tap(i => {
          if (i === 100) {
            this.countDown.next();
          }
        })
      );
  }
}
