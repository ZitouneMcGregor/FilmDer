import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySkeletonComponent } from './play-skeleton.component';

describe('PlaySkeletonComponent', () => {
  let component: PlaySkeletonComponent;
  let fixture: ComponentFixture<PlaySkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaySkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaySkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
