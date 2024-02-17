import { TestBed } from '@angular/core/testing';

import { SecureAdminOrFurnizorPagesGuardService } from './secure-admin-or-furnizor-pages.guard.service';

describe('SecureAdminOrFurnizorPagesGuardService', () => {
  let service: SecureAdminOrFurnizorPagesGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecureAdminOrFurnizorPagesGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
