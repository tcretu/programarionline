import { TestBed } from '@angular/core/testing';

import { FurnizoriService } from './furnizori.service';

describe('FurnizoriService', () => {
  let service: FurnizoriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FurnizoriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
