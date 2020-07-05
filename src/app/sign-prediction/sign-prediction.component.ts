import { Component } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SignsService, Sign } from '../core/signs.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-prediction',
  templateUrl: './sign-prediction.component.html',
  styleUrls: ['./sign-prediction.component.scss']
})
export class SignPredictionComponent {

  isMobile = false;
  defaultModel = '/vgg19_224_224_v2';
  signsLeft: Array<Sign> = [];
  signsRight: Array<Sign> = [];
  models$: Observable<{}>;


  constructor(private signsService: SignsService, private snackBar: MatSnackBar) {
    this.isMobile = this.isMobileClient();
    this.signsLeft = this.signsService.getSigns(0, 13);
    this.signsRight = this.signsService.getSigns(13, 26, true);
    this.models$ = this.signsService.getModels();
  }

  modelChanged(modelUrl) {
    this.signsService.setModelUrl(modelUrl);

    this.snackBar.open(`Changed Model to ${modelUrl}`, '', {
      duration: 2000,
    });
  }

  handDetected(image) {
    if (image) {
      this.signsService.predictSign(image)
        .subscribe((result: any) => {

          if (result) {
            this.signsLeft.forEach(s => s.active = false);
            this.signsRight.forEach(s => s.active = false);

            let array = 'signsLeft';

            console.log(result.BEST_KEY);
            if (result.BEST_KEY === 'nothing' || result.BEST_KEY.charCodeAt(0) - 65 > 12) {
              array = 'signsRight';
            }

            const index = (this[array] as Array<Sign>).findIndex(s => s.key === result.BEST_KEY);
            if (index > -1) {
              (this[array] as Array<Sign>)[index].active = true;
            }
          }
        });
    }
  }

  private isMobileClient() {
    return /Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

}
