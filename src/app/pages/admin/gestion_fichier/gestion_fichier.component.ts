import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CreateFolderComponent } from './modals/create-folder/create-folder.component';
import { GsFolder } from '../../../core/models/folder';
import { File } from '../../../core/models/file';
import { AuthService } from '../../../core/service/auth.service';
import { FileService } from '../../../services/file.service';
import { UploadModalComponent } from './modals/upload-modal/upload-modal.component';
import { PdfReaderComponent } from './modals/pdfReader/pdfReader.component';
import { ImageReaderComponent } from './modals/imageReader/imageReader.component';

@Component({
  selector: 'app-gestion-fichier',
  standalone: true,
  imports: [CommonModule, NgbTooltip],  
  templateUrl: './gestion_fichier.component.html',
  styleUrls: ['./gestion_fichier.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GestionFichierComponent implements OnInit {

  fileSystem: GsFolder[] = [];
  currentUser!: any;
  selectedFolder: GsFolder | null = null; 
  selectedFile: File | null = null; 
  rootFolders: GsFolder[] = [];
  rootFiles: File[] = [];
  loading = false;  
  constructor(
    private cdr: ChangeDetectorRef,
    private _fileService: FileService,
    private modalService: NgbModal,
    private _userService: AuthService
  ) {}

  ngOnInit(): void {
    // Retrieve current user data from the AuthService
    this.currentUser = this._userService.getCurrentUser();
    
    this.loadRootFilesAndFolders()
  }
  loadRootFilesAndFolders(): void {
    this.loading = true; 
    this._fileService.getAllRoot(this.currentUser._id).subscribe({
      next: (data) => {
        this.rootFolders = data.folders;
        this.rootFiles = data.files;
        this.loading = false;  
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;   
      }
    });
  }
  /**
   * Creates a new folder.
   */
  createFolder(): void {
    const modalRef = this.modalService.open(CreateFolderComponent);
    
    // Passing the selected folder as the parent, if available
    modalRef.componentInstance.parentFolder = this.selectedFolder ? this.selectedFolder : null;
    modalRef.componentInstance.createdBy = this.currentUser;

    modalRef.result.then((folder: GsFolder) => {
      if (folder) {
        console.log('Folder created:', folder);
        // Check if the folder should be added to a specific parent folder (for subfolder creation)
        if (this.selectedFolder) {
          this.selectedFolder.subFolders = this.selectedFolder.subFolders || [];
          this.selectedFolder.subFolders.push(folder);
        } else {
           this.rootFolders.push(folder);
        }
        this.cdr.markForCheck();  
      }
    }).catch((error) => {
      console.error('Modal dismissed', error);
    });
  }

 
  openFolder(folder: GsFolder): void {
    if (folder.open) {
       folder.open = false;
      this.selectedFolder = null;
    } else {
      this.loading = true;  
       this._fileService.getSubFolderAndSubFiles(folder._id).subscribe({
        next: (data) => {
          folder.files = data.files;   
          folder.subFolders = data.folders;  
          folder.open = true;
          this.selectedFolder = folder;
          this.selectedFile = null;
          this.loading = false; // Stop loading even on error
          this.cdr.markForCheck(); 
        },
        error: (err) => {
          console.error('Error fetching folder contents:', err);
          this.loading = false; // Stop loading even on error
        }
      });
    }
  }
  selectFile(file: File): void {
    this.selectedFile = file;
    this.selectedFolder = null; // Deselect folder if a file is selected
    this.cdr.markForCheck(); // Mark for change detection
  }

 
  openFile(file: File): void {
    console.log(file);
    this.selectedFile = file;
    this.selectedFolder = null;  
    this.cdr.markForCheck();
    
    const fileType = file.type;
    if (fileType === 'application/pdf') {
      this.openPdfViewer(file);
    } else if (['image/jpeg', 'image/png', 'image/gif'].includes(fileType)) {
      this.openImageViewer(file);
    } else {
      console.warn('Unsupported file type:', fileType);
    }
  }

  
  private openPdfViewer(file: File): void {
    const modalRef = this.modalService.open(PdfReaderComponent);  
    modalRef.componentInstance.file = file;  
  }
  
  private openImageViewer(file: File): void {
    const modalRef = this.modalService.open(ImageReaderComponent);  
    modalRef.componentInstance.file = file; 
  }
  

  /**
   * Uploads a new file to the currently selected folder.
   */
  uploadFile(): void {
    const modalRef = this.modalService.open(UploadModalComponent);
    
    modalRef.componentInstance.parentFolder = this.selectedFolder ? this.selectedFolder : null;
    modalRef.componentInstance.createdBy = this.currentUser;
  
    modalRef.result.then((uploadedFiles: File[]) => {
      if (uploadedFiles && uploadedFiles.length > 0) {
        console.log('Files uploaded:', uploadedFiles);
        // Add the uploaded files to the selected folder or root files
        if (this.selectedFolder) {
          this.selectedFolder.files = this.selectedFolder.files || [];
          this.selectedFolder.files.push(...uploadedFiles); // Append uploaded files to the folder
        } else {
          this.rootFiles.push(...uploadedFiles); // Append uploaded files to the root
        }
        this.cdr.markForCheck(); // Trigger change detection
      }
    }).catch((error) => {
      console.error('Modal dismissed', error);
    });
  }
  
  /**
   * Deletes the selected item (folder or file).
   */
  deleteItem(): void {
    if (this.selectedFolder) {
      // Delete the selected folder
      if (this.selectedFolder.subFolders) {
        // If deleting a subfolder from within a folder
        this.selectedFolder.subFolders = this.selectedFolder.subFolders.filter(subFolder => subFolder !== this.selectedFolder);
      } else {
        // If deleting from the root folder list
        this.rootFolders = this.rootFolders.filter(folder => folder !== this.selectedFolder);
      }
      
      // Clear the selection after deletion
      this.selectedFolder = null;
    } else if (this.selectedFile) {
      // Delete the selected file
      if (this.selectedFolder) {
        // If the file is inside a selected folder
        // this.selectedFolder.files = this.selectedFolder.files?.filter(file => file !== this.selectedFile) || [];
      } else {
        // If the file is in the root file list
        this.rootFiles = this.rootFiles.filter(file => file !== this.selectedFile);
      }
  
      // Clear the selection after deletion
      this.selectedFile = null;
    }
  
    // Trigger change detection
    this.cdr.markForCheck();
  }
    getSelectedFolderIndex(): number | null {
    return this.rootFolders.length > 0 ? 0 : null;
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = (event.target as HTMLElement).closest('.file-manager');
    if (!clickedInside) {
      this.deselectItems(); 
    }
  }

   deselectItems(): void {
    this.selectedFolder = null;
    this.selectedFile = null;
    this.cdr.markForCheck();  
  }
}
