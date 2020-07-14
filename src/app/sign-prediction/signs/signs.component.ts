import { Component, Input, OnInit } from '@angular/core';
import { Sign, SignsService } from 'src/app/core/signs.service';

@Component({
  selector: 'app-signs',
  templateUrl: './signs.component.html',
  styleUrls: ['./signs.component.scss']
})
export class SignsComponent implements OnInit {

  overviewMode = false;

  @Input() signMaxWidth: string;
  @Input() signs: Array<Sign> = [];

  constructor(private signsService: SignsService) {

  }

  ngOnInit(): void {

    if (!this.signMaxWidth) {
      this.signMaxWidth = '250px';
      this.overviewMode = true;
    }

    if (!this.signs || this.signs.length === 0) {
      this.signs = this.signsService.getSigns();
    }
  }

}

