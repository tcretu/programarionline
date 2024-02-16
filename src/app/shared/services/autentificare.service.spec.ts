import { TestBed } from '@angular/core/testing';

import { AutentificareService } from './autentificare.service';

describe('AutentificareService', () => {
  let service: AutentificareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutentificareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
