import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayCreateRoomComponent } from './play-create-room.component';

describe('PlayCreateRoomComponent', () => {
  let component: PlayCreateRoomComponent;
  let fixture: ComponentFixture<PlayCreateRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayCreateRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayCreateRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
