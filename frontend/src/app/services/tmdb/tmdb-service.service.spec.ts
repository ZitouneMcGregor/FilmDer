import { TestBed } from '@angular/core/testing';

import { TmdbServiceService } from './tmdb-service.service';

describe('TmdbServiceService', () => {
  let service: TmdbServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmdbServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
