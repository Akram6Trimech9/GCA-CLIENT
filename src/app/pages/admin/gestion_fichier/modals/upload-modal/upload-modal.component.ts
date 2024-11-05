import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GsFolder } from '../../../../../core/models/folder';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../../../../../services/file.service';

@Component({
  selector: 'app-upload-modal',
  standalone: true,
  imports: [
    CommonModule, 
  ],
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadModalComponent {
  @Input() parentFolder: GsFolder = {} as GsFolder || null;
  @Input() createdBy: any;
  constructor(public activeModal: NgbActiveModal, private _fileService: FileService) { }

  isDragging = false;
  selectedFiles: File[] = [];
  invalidFiles: File[] = [];
  loading = false; // New variable for loading state

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  handleFiles(files: FileList) {
    this.selectedFiles = [];
    this.invalidFiles = [];

    Array.from(files).forEach(file => {
      if (this.isValidFileType(file)) {
        this.selectedFiles.push(file);
      } else {
        this.invalidFiles.push(file);
      }
    });
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    return allowedTypes.includes(file.type);
  }

  async uploadFiles() {
    if (this.selectedFiles.length > 0) {
      this.loading = true 
      const uploadedFiles: any[] = [];
      for (const item of this.selectedFiles) {
        const formData = new FormData();
        formData.append('file', item);
        formData.append('createdBy', this.createdBy._id);
        if (this.parentFolder && this.parentFolder._id) {
          formData.append('folderId', this.parentFolder?._id);
        }
        try {
          await this._fileService.createFile(formData).subscribe({
            next:(value)=>{
               console.log(value)
               uploadedFiles.push(value); 
            },
            error:(err)=>{
               console.log(err)
            }
          })
          console.log('File uploaded successfully:', item.name);
        } catch (err) {
          console.log('Error uploading file:', err);
        }
      }
      this.loading = false; 
      this.selectedFiles = [];
      this.invalidFiles = [];
      this.activeModal.close(uploadedFiles);  
     }
  }

  clearFiles() {
    this.selectedFiles = [];
  }

  get selectedFileNames(): string {
    return this.selectedFiles.map(file => file.name).join(', ');
  }

  closeModal() {
    this.activeModal.close();
  }
}
