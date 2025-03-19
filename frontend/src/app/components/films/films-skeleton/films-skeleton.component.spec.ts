import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmsSkeletonComponent } from './films-skeleton.component';

describe('FilmsSkeletonComponent', () => {
  let component: FilmsSkeletonComponent;
  let fixture: ComponentFixture<FilmsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmsSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
