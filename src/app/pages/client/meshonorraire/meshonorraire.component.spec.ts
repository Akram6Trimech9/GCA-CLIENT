import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeshonorraireComponent } from './meshonorraire.component';

describe('MeshonorraireComponent', () => {
  let component: MeshonorraireComponent;
  let fixture: ComponentFixture<MeshonorraireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeshonorraireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeshonorraireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
