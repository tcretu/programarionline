import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutentificareComponent } from './autentificare.component';

describe('AutentificareComponent', () => {
  let component: AutentificareComponent;
  let fixture: ComponentFixture<AutentificareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutentificareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutentificareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
