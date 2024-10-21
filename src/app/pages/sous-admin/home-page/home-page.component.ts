import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { CabinetService } from '../../../services/cabinet.service';
import { Cabinet } from '../../../core/models/cabinet';
import { AuthService } from '../../../core/service/auth.service';


 

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'], 
 })
export class HomePageComponent implements OnInit {

  cabinet!: Cabinet

  constructor( private _authService : AuthService ,private _transaction : TransactionService , private _cabinetService : CabinetService) {}
   transactions !: any[] ;
    currentUser : any
  ngOnInit() {
   this.currentUser =  this._authService.getCurrentUser()
       this._cabinetService.getCabinetBySousAdmin(this.currentUser._id).subscribe({ 
         next:(value)=>{ 
            this.cabinet= value
            console.log(this.cabinet,"cabinet")
         } ,error:(err)=>{ 
           console.log(err)
         }
       }) ;
       this._transaction.getBySousAdmin(this.currentUser._id).subscribe({ 
         next:(value)=>{ 
          this.transactions = value
          console.log(this.transactions,"transactions")

         } ,error:(err)=>{ 
           console.log(err)
         }
       })
  }
}
