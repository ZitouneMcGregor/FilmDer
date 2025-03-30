import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPlayComponent } from './room-play.component';

describe('RoomPlayComponent', () => {
  let component: RoomPlayComponent;
  let fixture: ComponentFixture<RoomPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomPlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
