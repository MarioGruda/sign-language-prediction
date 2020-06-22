import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignPredictionComponent } from './sign-prediction.component';
import { SignsComponent } from './signs/signs.component';
import { SharedModule } from '../shared/shared.module';
import { WebcamComponent } from './webcam/webcam.component';
import { CountdownComponent } from './countdown/countdown.component';



@NgModule({
  declarations: [SignPredictionComponent, SignsComponent, WebcamComponent, CountdownComponent],
  imports: [
    RouterModule.forChild(
      [
        { path: 'sign-prediction', component: SignPredictionComponent },
        { path: 'signs', component: SignsComponent },
      ]
    ),
    SharedModule
  ]
})
export class SignPredictionModule { }
