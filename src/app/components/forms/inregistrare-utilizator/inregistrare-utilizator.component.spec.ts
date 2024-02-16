import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InregistrareUtilizatorComponent } from './inregistrare-utilizator.component';

describe('InregistrareUtilizatorComponent', () => {
  let component: InregistrareUtilizatorComponent;
  let fixture: ComponentFixture<InregistrareUtilizatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InregistrareUtilizatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InregistrareUtilizatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
