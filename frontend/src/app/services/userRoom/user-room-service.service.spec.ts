import { TestBed } from '@angular/core/testing';

import { UserRoomServiceService } from './user-room-service.service';

describe('UserRoomServiceService', () => {
  let service: UserRoomServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRoomServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
