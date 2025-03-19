import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilModifModalComponent } from './profil-modif-modal.component';

describe('ProfilModifModalComponent', () => {
  let component: ProfilModifModalComponent;
  let fixture: ComponentFixture<ProfilModifModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilModifModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilModifModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
