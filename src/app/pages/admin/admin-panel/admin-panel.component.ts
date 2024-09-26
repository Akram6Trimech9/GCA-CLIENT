import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepenseService } from '../../../services/depense.service';
import { intervenantService } from '../../../services/inventaire.service';
import { AudianceService } from '../../../services/audiance.service';
import { DossiersService } from '../../../services/dossiers.service';
import { AuthService } from '../../../core/service/auth.service';
import { CreditService } from '../../../services/credit.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  currentUser: any;
  folder: any; 
  depense: number = 0;

  constructor(private _authService: AuthService, private depenseService: DepenseService, private interventaireService: intervenantService, private audianceService: AudianceService, private folderService: DossiersService , private honnoraireService : CreditService) {}

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();  
    this.getFolder();
    this.getDepense();
    this.getHonnoraire()
  }

  getFolder() {
    this.folderService.getFolderByAdminId(this.currentUser._id).subscribe({
      next: (value) => {
        this.folder = value.length;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getDepense() {
    this.depenseService.getTotalByAdmin(this.currentUser._id).subscribe({ 
      next: (value) => { 
        if (value.total) { 
          this.depense = value.total;
        }
        console.log(value);
      },
      error: (err) => { 
        console.log(err);
      }
    });
  }

  getHonnoraire(){
    this.honnoraireService.getCreditByAvocat(this.currentUser._id).subscribe({ 
       next:(value)=>{
           console.log(value)
       }, error:(err)=>{ 
            console.log(err)
       }
    })
  }
}
