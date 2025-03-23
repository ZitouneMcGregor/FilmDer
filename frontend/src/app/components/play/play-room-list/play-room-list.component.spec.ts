import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayRommListComponent } from './play-room-list.component';

describe('PlayRommListComponent', () => {
  let component: PlayRommListComponent;
  let fixture: ComponentFixture<PlayRommListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayRommListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayRommListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
