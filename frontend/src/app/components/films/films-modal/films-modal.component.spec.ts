import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmsModalComponent } from './films-modal.component';

describe('FilmsModalComponent', () => {
  let component: FilmsModalComponent;
  let fixture: ComponentFixture<FilmsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
