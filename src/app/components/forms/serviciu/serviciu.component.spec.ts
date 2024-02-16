import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciuComponent } from './serviciu.component';

describe('ServiciuComponent', () => {
  let component: ServiciuComponent;
  let fixture: ComponentFixture<ServiciuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiciuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
