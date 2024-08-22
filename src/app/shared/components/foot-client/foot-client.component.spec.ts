import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootClientComponent } from './foot-client.component';

describe('FootClientComponent', () => {
  let component: FootClientComponent;
  let fixture: ComponentFixture<FootClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
