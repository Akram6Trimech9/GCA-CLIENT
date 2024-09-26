import { ComponentFixture, TestBed } from '@angular/core/testing';

import { intervenantsComponent } from './intervenants.component';

describe('intervenantsComponent', () => {
  let component: intervenantsComponent;
  let fixture: ComponentFixture<intervenantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [intervenantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(intervenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
