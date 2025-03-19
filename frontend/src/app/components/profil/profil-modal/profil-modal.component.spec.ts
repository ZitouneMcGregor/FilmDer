import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilModalComponent } from './profil-modal.component';

describe('ProfilModalComponent', () => {
  let component: ProfilModalComponent;
  let fixture: ComponentFixture<ProfilModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
