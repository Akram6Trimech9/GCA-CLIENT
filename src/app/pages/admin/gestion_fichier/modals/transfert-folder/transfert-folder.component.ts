import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-transfert-folder',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>transfert-folder works!</p>`,
  styleUrl: './transfert-folder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransfertFolderComponent { }
