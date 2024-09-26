import { Component, OnInit } from '@angular/core';
import { RdvService } from '../../../services/rdv.service';
import { AuthService } from '../../../core/service/auth.service';
import { CommonModule } from '@angular/common';
import { DossiersService } from '../../../services/dossiers.service';

@Component({
  selector: 'app-mes-rendez-vous',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mes-rendez-vous.component.html',
  styleUrl: './mes-rendez-vous.component.scss'
})
export class MesRendezVousComponent implements OnInit{
  rdvs : any[]=[]
  currentUser: any
 constructor(private _rendezvousService : RdvService , private _authService : AuthService , private _folderService : DossiersService){

 }
  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();  

     this._rendezvousService.getRdvByClient(this.currentUser._id).subscribe({
       next:(value)=>{
        this.rdvs = value
       },error:(err)=>{
        console.log(err)
       }
     })
  }
}
