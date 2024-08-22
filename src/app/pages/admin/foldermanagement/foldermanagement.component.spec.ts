import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldermanagementComponent } from './foldermanagement.component';

describe('FoldermanagementComponent', () => {
  let component: FoldermanagementComponent;
  let fixture: ComponentFixture<FoldermanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoldermanagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoldermanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
