import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Added FormsModule for two-way data binding
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreditService } from '../../../../../services/credit.service';

@Component({
  selector: 'app-honorraires',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './honorraires.component.html',
  styleUrls: ['./honorraires.component.scss']
})
export class HonorrairesComponent  implements OnInit{
  @Input() client: any; 
  @Input() credit: any;
  @Input() affaire: any;
  total:any ;
  edit: boolean = false;
  newTranche = { tranche: null, date: '', method: '' };

  constructor(public activeModal: NgbActiveModal ,private  _honorraireService : CreditService) {}

  ngOnInit(): void {
    console.log(this.client, this.affaire, this.credit);
  }

  // Calculate total payed
  totalPayed(payments: { part: number; method: string, date: string }[]): number {
    return payments.reduce((total, payment) => total + payment.part, 0);
  }

   addTranche() {
    if (this.newTranche.tranche && this.newTranche.date && this.newTranche.method) {
      const record ={ 
        part: this.newTranche.tranche, 
        date: this.newTranche.date, 
        method: this.newTranche.method 
      }
      this.credit.payedCredit.push(record);
      this.newTranche = { tranche: null, date: '', method: '' };  
      this._honorraireService.addTranch(this.credit?._id,record).subscribe({
        next:(value)=>{
             console.log(value)
        },error:(err)=>{ 
           console.log(err)
        }
      })
    }
  }

  // Enable editing of honoraires
  editClient() {
    this.edit = true;
  }

   saveClient() {
    this.edit = false;
    if(this.total !== this.credit.totalCredit){
        this._honorraireService.updateTotal({totalCredit:this.total},this.credit._id).subscribe({
           next:(value)=>{ 
            this.credit.totalCredit = this.total
           },error:(err)=>{ 
             console.log(err)
           }
        })
    }
   }

   cancelEdit() {
    this.edit = false;
   }

   close() {
    this.activeModal.close();
  }
}