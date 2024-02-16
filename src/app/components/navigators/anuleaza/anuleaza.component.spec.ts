import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnuleazaComponent } from './anuleaza.component';

describe('AnuleazaComponent', () => {
  let component: AnuleazaComponent;
  let fixture: ComponentFixture<AnuleazaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnuleazaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnuleazaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
