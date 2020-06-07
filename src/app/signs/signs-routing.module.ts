import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignsComponent } from './signs.component';

const routes: Routes = [{ path: '', component: SignsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignsRoutingModule { }
