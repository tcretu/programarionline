import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametruComponent } from './parametru.component';

describe('ParametruComponent', () => {
  let component: ParametruComponent;
  let fixture: ComponentFixture<ParametruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametruComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
