import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnizorComponent } from './furnizor.component';

describe('FurnizorComponent', () => {
  let component: FurnizorComponent;
  let fixture: ComponentFixture<FurnizorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FurnizorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FurnizorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
