import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametriComponent } from './parametri.component';

describe('ParametriComponent', () => {
  let component: ParametriComponent;
  let fixture: ComponentFixture<ParametriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametriComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
