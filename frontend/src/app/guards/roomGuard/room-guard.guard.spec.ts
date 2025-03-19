import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roomGuardGuard } from './room-guard.guard';

describe('roomGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roomGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
