import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { ProcesService } from '../../../services/proces.service';

@Component({
  selector: 'app-poces-single',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl:'./poces-single.component.html',
  styleUrls: ['./poces-single.component.scss'],
})
export class PocesSingleComponent implements OnInit {
  currentUser: any;
  proces: any[] = [];
  filters: FormGroup;
  page: number = 1;
  limit: number = 2;
  totalProces: number = 0;
  filterApplied: boolean = false; 

   processTypes: string[] = ['plaintes', 'procés directe', 'chéque'];

  constructor(
    private _authService: AuthService,
    private _procesService: ProcesService,
    private fb: FormBuilder
  ) {
     this.filters = this.fb.group({
       folderNumber: [''],  
      username: [''],     
      lastname: [''],    
      nbreTribunal: [null], 
      type: ['']   
    });
  }

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();
    this.loadAffaires();
  }

  loadAffaires() {
    const avocatId = this.currentUser._id;  
    const filterValues = this.filters.value;

     this._procesService.searchProces({
      ...filterValues,
      page: this.page,
      limit: this.limit
    }).subscribe(response => {
      this.proces = response.data;
      this.totalProces = response.total;

       if (Object.values(this.filters.value).some(val => !!val)) {
        this.filterApplied = true; 
      }
    });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadAffaires();
  }

  onFilterChange() {
    this.page = 1; 
    this.loadAffaires();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalProces / this.limit); 
  }
  resetFilters() {
    this.filters.reset();
    this.filterApplied = false;  
    this.loadAffaires();  
  }
  
}
