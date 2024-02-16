import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramariComponent } from './programari.component';

describe('ProgramariComponent', () => {
  let component: ProgramariComponent;
  let fixture: ComponentFixture<ProgramariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramariComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
