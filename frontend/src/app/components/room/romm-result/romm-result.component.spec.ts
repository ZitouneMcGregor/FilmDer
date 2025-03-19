import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RommResultComponent } from './romm-result.component';

describe('RommResultComponent', () => {
  let component: RommResultComponent;
  let fixture: ComponentFixture<RommResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RommResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RommResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
