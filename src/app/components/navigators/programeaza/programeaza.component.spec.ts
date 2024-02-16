import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrameazaComponent } from './programeaza.component';

describe('ProgrameazaComponent', () => {
  let component: ProgrameazaComponent;
  let fixture: ComponentFixture<ProgrameazaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgrameazaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgrameazaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
