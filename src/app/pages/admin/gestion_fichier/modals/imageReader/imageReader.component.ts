import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { File } from '../../../../../core/models/file';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-image-reader',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  <div class="modal-header">
    <h5 class="modal-title">Image Viewer</h5>
    <button type="button" class="close" (click)="activeModal.dismiss('Cross click')">&times;</button>
  </div>
  <div class="modal-body">
    <img [src]="getImageUrl()" style="width: 100%; height: auto;" alt="Image preview"/>
  </div>
  `,
  styleUrls: ['./imageReader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageReaderComponent { 
  @Input() file!: File; 

  constructor(public activeModal: NgbActiveModal) {}

  getImageUrl(): string {
    return `${environment.picUrl}${this.file.path}`;
  }
}
