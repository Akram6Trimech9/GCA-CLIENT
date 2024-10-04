import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffairesSingleComponentComponent } from './affaires-single-component.component';

describe('AffairesSingleComponentComponent', () => {
  let component: AffairesSingleComponentComponent;
  let fixture: ComponentFixture<AffairesSingleComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AffairesSingleComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffairesSingleComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
