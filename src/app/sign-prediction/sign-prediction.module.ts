import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignPredictionComponent } from './sign-prediction.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [SignPredictionComponent],
  imports: [
    RouterModule.forChild(
      [
        { path: 'sign-prediction', component: SignPredictionComponent },
      ]
    ),
    SharedModule
  ]
})
export class SignPredictionModule { }
