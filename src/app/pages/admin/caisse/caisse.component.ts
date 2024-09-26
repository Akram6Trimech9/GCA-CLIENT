import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepenseService } from '../../../services/depense.service';
import { AuthService } from '../../../core/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-caisse',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './caisse.component.html',
  styleUrl: './caisse.component.scss'
})
export class CaisseComponent implements OnInit {
  resources!: any[] 
  newResource: any = { montant: 0, description: '', Date: new Date() };
  isEditing: boolean = false;
  resourceForm!: FormGroup;
 constructor(private depenseService :DepenseService , private _authService : AuthService,     private toastr: ToastrService ,
  private fb: FormBuilder,
 ){
  this.resourceForm = this.fb.group({
    montant: [0, [Validators.required]],
    description: ['', [Validators.required]],
    Date: [new Date().toISOString().substring(0, 10), [Validators.required]]
  });
 }
 total : Number =0
 currentUser: any
  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser()  

    this.depenseService.getTotalByAdmin(this.currentUser._id).subscribe({
      next:(value:any)=>{
        if(value.total){
          this.total = value.total
        }else{
          this.total =  0
        }
      },error:(err)=>{ 
        console.log(err)
      }
    })
    this.depenseService.getAllResources(this.currentUser._id).subscribe({
       next:(value)=>{
 
         if(!value){
          this.resources = []
         }else{
          this.resources = value
         }
       },error:(err)=>{
        console.log(err)
       }
    })
  }
  addResource() {
    if (this.resourceForm.valid) {
       this.depenseService.createResource(this.currentUser._id,this.resourceForm.value.montant, this.resourceForm.value.description , this.resourceForm.value.Date).subscribe({
          next:(value)=>{
            this.resources.push({ ...this.resourceForm.value });

          },error:(err)=>{
            console.log(err,"err")
          }
       })

      this.resourceForm.reset({
        montant: 0,
        description: '',
        Date: new Date().toISOString().substring(0, 10)
      });
      this.toastr.success("Ressource ajoutée avec succès!", "Succès");
    } else {
      this.toastr.error("Veuillez remplir tous les champs obligatoires!", "Erreur");
    }
  }
  edit() {
    this.depenseService.getDepenseStatus(this.currentUser._id).subscribe({
      next: (value) => {
        if (value.hasDepense) {
          this.depenseService.updateTotal(value.depenseId, this.total).subscribe({
            next: (value) => {
              this.total = value.total;
              this.isEditing = false;
              this.toastr.success("Total mis à jour avec succès!", "Succès");
            },
            error: (err) => {
              console.error(err);
              this.toastr.error("Erreur lors de la mise à jour du total.", "Erreur");
            }
          });
        } else {
          this.depenseService.createDepense(this.currentUser._id).subscribe({
            next: (value) => {
              this.isEditing = false;
              this.toastr.success("Dépense créée avec succès!", "Succès");
            },
            error: (err) => {
              console.error(err);
              this.toastr.error("Erreur lors de la création de la dépense.", "Erreur");
            }
          });
        }
      },
      error: (err) => {
        console.error(err);
        this.toastr.error("Erreur lors de la récupération du statut des dépenses.", "Erreur");
      }
    });
  }

 
 
  updateTotal() {
      // Logic for when the total is edited, if needed
      // For example, you could validate or format the input
  }
  editResource(resource: any) {
    // Implement the logic to edit the resource
    // For example, prefill the form with the selected resource data
    this.resourceForm.patchValue({
        montant: resource.montant,
        description: resource.description,
        Date: resource.Date.toISOString().substring(0, 10)
    });
    this.isEditing = true; // Set editing mode if necessary
}

deleteResource(resource: any) {
  

    const index = this.resources.indexOf(resource);

    if (index > -1) {
       this.depenseService.removeResource(this.currentUser._id, resource._id).subscribe({
         next:(value)=>{
 this.resources.splice(index, 1);
        this.toastr.success("Ressource supprimée avec succès!", "Succès");
         },error:(err)=>{
   console.log(err)
         }
       })
       
    } else {
        this.toastr.error("Erreur lors de la suppression de la ressource.", "Erreur");
    }
}

}
