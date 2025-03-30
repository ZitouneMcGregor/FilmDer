import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSkeletonComponent } from './room-skeleton.component';

describe('RoomSkeletonComponent', () => {
  let component: RoomSkeletonComponent;
  let fixture: ComponentFixture<RoomSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
