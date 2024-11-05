import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { File } from '../../../../../core/models/file';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../../../../../services/file.service';
import { environment } from '../../../../../../environments/environment';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-pdf-reader',
  standalone: true,
  imports: [
    CommonModule,
    PdfViewerModule
  ],
  template: `
  <div class="modal-header">
    <h5 class="modal-title">PDF Viewer</h5>
    <button type="button" class="close" (click)="activeModal.dismiss('Cross click')">&times;</button>
  </div>
  <div class="modal-body">
    <div class="pdf-container">
    <div *ngIf="!getPdf()" class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
      <pdf-viewer 
        [src]="getPdf()"
        [render-text]="true"
        [original-size]="false"
        style="width: 100%; height: 100%"
      ></pdf-viewer>
    </div>
  </div>
`,
  styleUrls: ['./pdfReader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfReaderComponent { 
  @Input() file!: File;  

  constructor(public activeModal: NgbActiveModal, private _fileService: FileService) {}

  getPdf(): string {
    return `${environment.picUrl}${this.file.path}`;
  }
}
