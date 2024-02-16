import { TestBed } from '@angular/core/testing';

import { ParametriService } from './parametri.service';

describe('ParametriService', () => {
  let service: ParametriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
