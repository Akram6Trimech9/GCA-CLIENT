import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/service/auth.service';
import { DossiersService } from '../../../services/dossiers.service';
import { CreditService } from '../../../services/credit.service';
import { HonorrairesComponent } from '../foldermanagement/modals/honorraires/honorraires.component';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-honorraire',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './honorraire.component.html',
  styleUrl: './honorraire.component.scss'
})
export class HonorraireComponent implements OnInit{

  // this.currentUser = this._authService.getCurrentUser()  
  // if(this.currentUser?._id){ 
  //    this.adminId = this.currentUser?._id

  //    this.getClients(this.adminId)
  @ViewChild('paymentModal') paymentModal: any;

  // }
  // getClients(id:any){
  //   this._userService.getAllClients(id).subscribe({
  //      next:(value:any)=> {
  //          this.clients = value.data
  //      },error:(err)=>{
  //   console.log(err)
  //      }
  //   })
  // }
  currentUser: any;
  adminId : any
  credits: any[]= []
  ngOnInit() {
      this.currentUser = this._userService.getCurrentUser()  
  if(this.currentUser?._id){ 
     this.adminId = this.currentUser?._id
     this.loadClients(this.adminId)
  }
 

  }
payment:any

loadCreditByAvocat(id : any){ 
     this._creditService.getCreditByAvocat(id).subscribe({
       next:(res)=>{
        this.credits = res
        
       },
       error:(err)=>{ 
        console.log(err,"okkk")
       }
     })
}
loadCreditByClient(id : any){ 
  this._creditService.getCreditByClient(id).subscribe({
    next:(res)=>{
     this.credits = res.credits
     this.calculateTotalHonoraires()
    },
    error:(err)=>{ 
     console.log(err,"okkk")
    }
  })
}
  constructor(private modalService: NgbModal ,
    private toastr: ToastrService
,    private _userService : AuthService , private  _folderService : DossiersService , private _creditService : CreditService) {}

  //function to open modal
  openModalFunction(content:any){
  this.modalService.open(content);
  }
  
  //function to close modal
  closeModalFunction(){
  this.modalService.dismissAll();
  }
  totalCredit : any ; 
  clients : any[] = [];   
  affaires : any[] = [];  

  selectedClient: string = '';
  selectedAffaire: string = '';
  selectedClientInfo :any
  credit = {
    totalCredit: 0,
    payedCredit: [
      {
        part: 0,
        date: '',
        method: '',
        natureTranche:''
      }
    ]
  };



  // Fetch clients from backend
  loadClients(id:any) {
     this._userService.getAllClients(id).subscribe({
           next:(value:any)=> {
               this.clients = value.data
           },error:(err)=>{
            this.toastr.error('Erreur lors du chargement des clients', 'Erreur');

           }
        })
  }

  // Fetch affaires when a client is selected
  onClientSelect(event: any) {
    const clientId = event.target.value
    this._folderService.getFolderByClient(clientId).subscribe({ 
       next:(value)=>{ 
          this.affaires = value
       },error(err){
        console.log(err)
       }
    })
    // this._folderService.getFolderByClient
    // this.http.get(`/api/affaires/${this.selectedClient}`).subscribe((data: any) => {
    //   this.affaires = data;
    // });
  }

  // Action when affaire is selected
  onAffaireSelect() {
    // Logic for selecting affaire, if needed
  }

  addPayment() {
    const newPayment = {
        part: 0,  // default values
        date: '',
        method: '',
        natureTranche:''

    };
    this.credit.payedCredit.push(newPayment);
}


 
  saveCredit() {
    const creditData = {
      totalCredit: this.credit.totalCredit,
      payedCredit: this.credit.payedCredit,
      client: this.selectedClient,
      affaire: this.selectedAffaire
    };
    this._creditService.postCredit(creditData).subscribe({
      next: (value) => {
        // this.credits.push(value.newCredit);
        this.toastr.success('Crédit enregistré avec succès', 'Succès');

        this.closeModalFunction()
      },
      error: (err) => {
        this.toastr.error('Erreur lors de l\'enregistrement du crédit', 'Erreur');

        console.log(err);
      }
    });
  }
  deleteCredit(id: any) {
    this._creditService.deleteCredit(id).subscribe({
      next: (value) => {
         this.credits = this.credits.filter(item => item._id !== id);
         this.toastr.success('Crédit supprimé avec succès', 'Succès');

      },
      error: (err) => {
        this.toastr.error('Erreur lors de la suppression du crédit', 'Erreur');
      }
    });
  }
  
  openHonorairesModal(client: any , affaire:any , credit:any) {
    console.log(client,affaire,'dsds')
    const modalRef = this.modalService.open(HonorrairesComponent, {
      size: 'lg',  
      backdrop: 'static',  
    });
  
     modalRef.componentInstance.credit = credit;

     modalRef.componentInstance.client = client;
    modalRef.componentInstance.affaire = affaire;

    modalRef.result.then(
      result => {
        console.log('Modal closed with:', result);
      },
      reason => {
        console.log('Modal dismissed');
      }
    );
  }

  searchTerm: string = '';
  filteredClients: any[] = [];
 

  filterClients() {
    this.selectedClient = ''
    if (this.searchTerm) {
       this._userService.searchClient(this.adminId,this.searchTerm).subscribe({
           next:(value : any)=>{ 
            this.filteredClients = value.data
            },error:(err)=>{ 
             console.log(err)
           }
       })
    } else {
      this.filteredClients = [];
    }
  }

  selectClient(client: any) {
    this.selectedClient = client._id; 
    this.selectedClientInfo = {...client  }
    this.searchTerm = `${client.lastname} ${client.username}`; 
    this.loadCreditByClient(client._id)
    this.filteredClients = [];
   }
   totalHonoraires: number = 0;

   calculateTotalHonoraires() {
       if (this.credits && this.credits.length > 0) {
           this.totalHonoraires = this.credits.reduce((sum, credit) => sum + credit.totalCredit, 0);
       } else {
           this.totalHonoraires = 0;
       }
   }
   
   selectedCredit: any;

 
openPaymentModal(item: any) {
  this.selectedCredit = item; // Set the selected credit
  const modalRef = this.modalService.open(this.paymentModal, {
      size: 'lg',
      backdrop: 'static'
  });

  modalRef.result.then(
      result => {
          console.log('Modal closed with:', result);
      },
      reason => {
          console.log('Modal dismissed');
      }
  );
}
removePayment(index: number) {
       this.credit.payedCredit.splice(index, 1);
 }
removePaymentFromBd(index: number, id : any) {
  console.log(id)
  if (this.selectedCredit && this.selectedCredit.payedCredit) {
      this._creditService.deleteTranch(id,this.selectedCredit._id).subscribe({ 
        next:(value) => { 
          this.selectedCredit.payedCredit.splice(index, 1);

        },error:(err)=>{ 
            console.log(err)
        }
      })
  }
 
} 

}
