import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignPredictionComponent } from './sign-prediction.component';

describe('SignPredictionComponent', () => {
  let component: SignPredictionComponent;
  let fixture: ComponentFixture<SignPredictionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignPredictionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
