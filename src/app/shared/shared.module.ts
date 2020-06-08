import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatProgressSpinnerModule
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ...materialModules
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    ...materialModules
  ]
})
export class SharedModule { }
