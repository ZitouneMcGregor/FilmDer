import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RommSkeletonComponent } from './romm-skeleton.component';

describe('RommSkeletonComponent', () => {
  let component: RommSkeletonComponent;
  let fixture: ComponentFixture<RommSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RommSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RommSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
