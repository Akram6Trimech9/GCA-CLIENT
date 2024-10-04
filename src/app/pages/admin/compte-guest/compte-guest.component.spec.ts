import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteGuestComponent } from './compte-guest.component';

describe('CompteGuestComponent', () => {
  let component: CompteGuestComponent;
  let fixture: ComponentFixture<CompteGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteGuestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
