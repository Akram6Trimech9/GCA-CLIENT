import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesAffairesComponent } from './mes-affaires.component';

describe('MesAffairesComponent', () => {
  let component: MesAffairesComponent;
  let fixture: ComponentFixture<MesAffairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesAffairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesAffairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
