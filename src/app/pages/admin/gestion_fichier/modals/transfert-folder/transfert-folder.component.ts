import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GsFolder } from '../../../../../core/models/folder';
import { FileService } from '../../../../../services/file.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../../core/service/auth.service';
import { IUser } from '../../../../../core/models/user';
import { File } from '../../../../../core/models/file';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-transfert-folder',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './transfert-folder.component.html',
  styleUrls: ['./transfert-folder.component.css'],
})
export class TransfertFolderComponent implements OnInit {
  @Input() selectedFolder: GsFolder = {} as GsFolder || null;
  @Input() createdBy: any;
  @Input() file: File = {} as File || null;
  users : IUser[]   = [] ;
  selectedUser!: IUser;

  constructor(
    public activeModal: NgbActiveModal, 
    private _fileService: FileService, 
    private _userService: AuthService,
    private toastr: ToastrService // Toastr service
  ) {}

  ngOnInit(): void {
    this._userService.getAllAdmins().subscribe({
      next: (value : any) => {
        // Exclude current user (createdBy) from the list
        this.users = value?.data?.filter((user:any) => user._id !== this.createdBy);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  transfert() {
    if (!this.selectedUser) {
      this.toastr.error('Please select an admin to transfer the file/folder.');
      return;
    }

    const record = {
      userId: this.selectedUser._id,
    };
    console.log(this.selectedFolder)

    if (this.file) {
      this._fileService.transfertFile({ ...record, fileId: this.file._id }).subscribe({
        next: (value) => {
          this.toastr.success('File transferred successfully!');
          this.activeModal.close();  
        },
        error: (err) => {
          this.toastr.error('Error transferring file.');
        }
      });
    } else if (this.selectedFolder && this.selectedFolder._id) {
      console.log("jksdfdsf dd ")
      this._fileService.transfertFolder({ ...record, folderId: this.selectedFolder._id }).subscribe({
        next: (value) => {
          this.toastr.success('Folder transferred successfully!');
          this.activeModal.close();  
        },
        error: (err) => {
          this.toastr.error('Error transferring folder.');
        }
      });
    }
  }
}
