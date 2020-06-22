import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignsService } from './signs.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    SignsService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('CoreModule should only be imported once');
    }
  }
}
