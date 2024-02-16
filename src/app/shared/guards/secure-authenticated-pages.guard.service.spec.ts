import { TestBed } from '@angular/core/testing';

import { SecureAuthenticatedPagesGuardService } from './secure-authenticated-pages.guard.service';

describe('SecureAuthenticatedPagesGuardService', () => {
  let service: SecureAuthenticatedPagesGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecureAuthenticatedPagesGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
