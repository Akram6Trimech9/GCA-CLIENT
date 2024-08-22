import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAddminComponent } from './register-addmin.component';

describe('RegisterAddminComponent', () => {
  let component: RegisterAddminComponent;
  let fixture: ComponentFixture<RegisterAddminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAddminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAddminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
