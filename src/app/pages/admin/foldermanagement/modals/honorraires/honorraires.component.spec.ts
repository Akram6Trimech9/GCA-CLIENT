import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonorrairesComponent } from './honorraires.component';

describe('HonorrairesComponent', () => {
  let component: HonorrairesComponent;
  let fixture: ComponentFixture<HonorrairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HonorrairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HonorrairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
