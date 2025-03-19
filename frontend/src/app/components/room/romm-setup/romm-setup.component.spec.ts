import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RommSetupComponent } from './romm-setup.component';

describe('RommSetupComponent', () => {
  let component: RommSetupComponent;
  let fixture: ComponentFixture<RommSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RommSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RommSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
