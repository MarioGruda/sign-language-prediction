import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NavigationComponent } from './navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [NavigationComponent],
  imports: [
    RouterModule,
    MatToolbarModule,
    SharedModule
  ],
  exports: [NavigationComponent]
})
export class NavigationModule { }
