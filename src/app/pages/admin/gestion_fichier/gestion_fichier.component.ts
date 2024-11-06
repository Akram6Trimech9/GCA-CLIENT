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
import { TransfertFolderComponent } from './modals/transfert-folder/transfert-folder.component';
import { ToastrService } from 'ngx-toastr';

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
    private _userService: AuthService,
    private toastr: ToastrService 
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
        console.log('Fichiers téléchargés :', uploadedFiles);
        if (this.selectedFolder) {
          this.selectedFolder.files = this.selectedFolder.files || [];
          this.selectedFolder.files.push(...uploadedFiles);
        } else {
          this.rootFiles.push(...uploadedFiles);
        }
        this.toastr.success('Les fichiers ont été téléchargés avec succès !', 'Succès'); // Notification succès
        this.cdr.markForCheck();
      }
    }).catch((error) => {
      console.error('Modal fermée avec erreur', error);
      this.toastr.error('Échec du téléchargement des fichiers !', 'Erreur'); // Notification erreur
    });
  }
  
 
  deleteItem(): void {
    if (this.selectedFolder &&  this.selectedFolder?._id) {
      this._fileService.deleteFolder(this.selectedFolder?._id).subscribe({
          next:(value)=>{
        this.toastr.success('Le dossier a été supprimé avec succès !', 'Succès'); 
             
          },error:(err)=>{
            this.toastr.error( err, 'erreur'); 

          }

      })
       if (this.selectedFolder.subFolders) {
        
        this.selectedFolder.subFolders = this.selectedFolder.subFolders.filter(subFolder => subFolder !== this.selectedFolder);
        this.toastr.success('Le dossier a été supprimé avec succès !', 'Succès'); 
      } else {
        this.rootFolders = this.rootFolders.filter(folder => folder !== this.selectedFolder);
        this.toastr.success('Le dossier a été supprimé avec succès !', 'Succès'); 
      }
   

    } else if (this.selectedFile &&  this.selectedFile?._id) {
      this._fileService.deleteFile(this.selectedFile?._id).subscribe({
        next:(value)=>{
          this.toastr.success('Le fichier a été supprimé avec succès !', 'Succès'); 
           
        },error:(err)=>{
          this.toastr.error( err, 'erreur'); 

        }

    })
       this.rootFiles = this.rootFiles.filter(file => file !== this.selectedFile);
      this.toastr.success('Le fichier a été supprimé avec succès !', 'Succès'); 
      this.selectedFile = null;
    }
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

  transfert(): void {
    const modalRef = this.modalService.open(TransfertFolderComponent);
  
    if (this.selectedFile) {
      // If a file is selected, pass the file to the modal
      modalRef.componentInstance.file = this.selectedFile;
      modalRef.componentInstance.selectedFolder =  null;

    } else if (this.selectedFolder) {
      // If a folder is selected, pass the folder to the modal
      modalRef.componentInstance.file = null;

      modalRef.componentInstance.selectedFolder = this.selectedFolder;
    }
  
    // Pass the createdBy (current user) to the modal
    modalRef.componentInstance.createdBy = this.currentUser;
  
    // Handle modal result
    modalRef.result.then((result) => {
      this.deselectItems()
      console.log('Transfer successful:', result);
      // Perform any necessary updates after the transfer
      this.cdr.markForCheck(); // Trigger change detection
    }).catch((error) => {
      console.error('Modal dismissed with error:', error);
    });
  }
  
}
