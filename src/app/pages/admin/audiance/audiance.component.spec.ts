import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudianceComponent } from './audiance.component';

describe('AudianceComponent', () => {
  let component: AudianceComponent;
  let fixture: ComponentFixture<AudianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudianceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
