import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../../../../../services/file.service';
import { GsFolder } from '../../../../../core/models/folder';

@Component({
  selector: 'app-create-folder',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.css'],  
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFolderComponent { 
  @Input() parentFolder : GsFolder = {} as GsFolder  || null;   
  @Input() createdBy: any 
  folder !: GsFolder  
  folderName: string = '';
  folderNameInvalid: boolean = false;  
  constructor(public activeModal: NgbActiveModal, private _fileService: FileService) {}

  createFolder() {
    if (!this.folderName.trim()) {  
      this.folderNameInvalid = true; 
      return;  
    }
   let  record : any ={ 
      name :this.folderName ,
      createdBy: this.createdBy._id
   }
    if(this.parentFolder){ 
      record = {...record ,   parentFolderId : this.parentFolder._id , isRoot: false } 
    }else{ 
      record = {...record , isRoot: true } 
    }

    this._fileService.createFolder(record).subscribe({
       next:(value)=>{ 
        this.folder = value
         this.activeModal.close(this.folder);

       },error:(err)=>{ 
          console.log(err)
       } 
    })

  }
}
