import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AffaireService } from '../../../services/affaire.service';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-mes-affaires',
  standalone: true,
  imports: [CommonModule ,FormsModule ],
  templateUrl: './mes-affaires.component.html',
  styleUrl: './mes-affaires.component.scss'
})
export class MesAffairesComponent implements OnInit {

  currentUser  : any
  affaires !: any[]
   constructor( private _affaireService : AffaireService , private _authService : AuthService){

   }

   ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser()  
    this.getAffaireByClient()
   }


   getAffaireByClient(){
     this._affaireService.getAllAffaireByClient(this.currentUser._id).subscribe({
      next:(value)=>{
        this.affaires = value
         console.log(value)

      } , error:(err)=>{ 
         console.log(err)
      }
     })
   }
}
