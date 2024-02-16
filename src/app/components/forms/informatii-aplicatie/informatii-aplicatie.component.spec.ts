import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformatiiAplicatieComponent } from './informatii-aplicatie.component';

describe('InformatiiAplicatieComponent', () => {
  let component: InformatiiAplicatieComponent;
  let fixture: ComponentFixture<InformatiiAplicatieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformatiiAplicatieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformatiiAplicatieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
