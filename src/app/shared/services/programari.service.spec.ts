import { TestBed } from '@angular/core/testing';

import { ProgramariService } from './programari.service';

describe('ProgramariService', () => {
  let service: ProgramariService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramariService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
