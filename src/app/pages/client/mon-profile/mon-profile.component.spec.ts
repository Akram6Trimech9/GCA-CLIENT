import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonProfileComponent } from './mon-profile.component';

describe('MonProfileComponent', () => {
  let component: MonProfileComponent;
  let fixture: ComponentFixture<MonProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
