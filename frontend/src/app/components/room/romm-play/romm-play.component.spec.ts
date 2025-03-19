import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RommPlayComponent } from './romm-play.component';

describe('RommPlayComponent', () => {
  let component: RommPlayComponent;
  let fixture: ComponentFixture<RommPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RommPlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RommPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
