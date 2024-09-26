import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonorraireComponent } from './honorraire.component';

describe('HonorraireComponent', () => {
  let component: HonorraireComponent;
  let fixture: ComponentFixture<HonorraireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HonorraireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HonorraireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
