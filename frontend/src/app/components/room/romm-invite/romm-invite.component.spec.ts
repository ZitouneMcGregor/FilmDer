import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RommInviteComponent } from './romm-invite.component';

describe('RommInviteComponent', () => {
  let component: RommInviteComponent;
  let fixture: ComponentFixture<RommInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RommInviteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RommInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
