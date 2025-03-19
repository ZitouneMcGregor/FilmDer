import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSkeletonComponent } from './login-skeleton.component';

describe('LoginSkeletonComponent', () => {
  let component: LoginSkeletonComponent;
  let fixture: ComponentFixture<LoginSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
