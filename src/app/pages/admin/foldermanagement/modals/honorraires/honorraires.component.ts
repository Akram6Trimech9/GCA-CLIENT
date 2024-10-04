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
  newTranche = { tranche: null, date: '', method: '' ,natureTranche:'' };

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
        method: this.newTranche.method ,
        natureTranche:this.newTranche.natureTranche
      }
      this.credit.payedCredit.push(record);
      this.newTranche = { tranche: null, date: '', method: '' ,natureTranche :'' };  
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
  editTranche(payment: any ) {
     payment.editMode = true;
    payment.editCopy = { ...payment };  

  }
  saveTranche(payment: any, credit: any) {
    payment.editMode = false;

  
    // Find the tranche (payment) in credit.payedCredit by its _id
    const trancheIndex = this.credit.payedCredit.findIndex((tranche: any) => tranche._id === payment._id);
  
    if (trancheIndex !== -1) {
      // Update the found tranche with new payment data
      this.credit.payedCredit[trancheIndex] = { ...payment };
   
      // Call the service to update the tranche in the backend
      this._honorraireService.updateTranche(payment._id, credit, payment).subscribe({
        next: (value) => {
         },
        error: (err) => {
          console.error('Error updating tranche:', err);
        }
      });
    } else {
      console.error('Tranche not found!');
    }
  }
  
  
  cancelEditTranche(payment: any) {
    payment.part = payment.editCopy.part;
    payment.date = payment.editCopy.date;
    payment.method = payment.editCopy.method;
    payment.natureTranche = payment.editCopy.natureTranche;
    payment.editMode = false;
    delete payment.editCopy;
  }
  
  
  generateFacture(credit: any, payment: any) {
    this._honorraireService.getCreditInvoice(credit, payment).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${payment}.pdf`;
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error generating PDF:', err);
       }
    });
  }
  formatDateForInput(date:any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return [year, month, day].join('-');
  }
  formatISODate(dateString:any) {
    return dateString.split('T')[0]; // Extract just the date portion
  }
  
}