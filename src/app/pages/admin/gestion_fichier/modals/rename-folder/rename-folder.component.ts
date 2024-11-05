import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-rename-folder',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl:'./rename-folder.component.html' , 
  styleUrl: './rename-folder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenameFolderComponent { }
