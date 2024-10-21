import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output  } from '@angular/core';
import { AffairesComponent } from '../affaires/affaires.component';
import { ProcesComponent } from '../proces/proces.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, AffairesComponent , ProcesComponent],
  templateUrl: './categry.component.html',
  styleUrls: ['./category.component.css'],  
 })
export class CategoryComponent {
  @Output() folderSelected = new EventEmitter<string>();
  @Input() selectedClient : any ;
  @Input() Folder : any ; 
  @Input() selectedAffaires : any ;
  selectedFolder: 'affaires' | 'procesCheques' | null = null;

  selectFolder(folder: 'affaires' | 'procesCheques') {
    this.selectedFolder = folder;
    this.folderSelected.emit(folder);  
  }

   deselectFolder() {
    this.selectedFolder = null;
  }
}
