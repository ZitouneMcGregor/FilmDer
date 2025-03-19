import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilSkeletonComponent } from './profil-skeleton.component';

describe('ProfilSkeletonComponent', () => {
  let component: ProfilSkeletonComponent;
  let fixture: ComponentFixture<ProfilSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
