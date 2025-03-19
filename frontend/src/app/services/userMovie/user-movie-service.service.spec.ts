import { TestBed } from '@angular/core/testing';

import { UserMovieServiceService } from './user-movie-service.service';

describe('UserMovieServiceService', () => {
  let service: UserMovieServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMovieServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
