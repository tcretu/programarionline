import { TestBed } from '@angular/core/testing';

import { SecureAdminPagesGuardService } from './secure-admin-pages.guard.service';

describe('SecureAdminPagesGuardService', () => {
  let service: SecureAdminPagesGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecureAdminPagesGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
