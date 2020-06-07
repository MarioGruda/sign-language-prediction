import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SignsRoutingModule } from './signs-routing.module';
import { SignsComponent } from './signs.component';


@NgModule({
  declarations: [SignsComponent],
  imports: [
    SharedModule,
    SignsRoutingModule
  ]
})
export class SignsModule { }
