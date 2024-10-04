import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
 import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AffaireService } from '../../../services/affaire.service';

@Component({
  selector: 'app-affaires-single-component',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './affaires-single-component.component.html',
  styleUrls: ['./affaires-single-component.component.scss']
})
export class AffairesSingleComponentComponent implements OnInit {
  currentUser: any;
  affaires: any[] = [];
  filters: FormGroup;
  page: number = 1;
  limit: number = 10;
  totalAffaires: number = 0;

  constructor(
    private _authService: AuthService,
    private _affaireService: AffaireService,
    private fb: FormBuilder
  ) {
    this.filters = this.fb.group({
      clientName: [''],
      folderNumber: [''],
      degre: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();
    this.loadAffaires();
  }

  loadAffaires() {
    const avocatId = this.currentUser._id;  
    const filterValues = this.filters.value;

    this._affaireService.getAllAffaireByAvocat(avocatId, {
      ...filterValues,
      page: this.page,
      limit: this.limit
    }).subscribe(response => {
      this.affaires = response.affaires;
      this.totalAffaires = response.total;
    });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadAffaires();
  }

  onFilterChange() {
    this.page = 1; // Reset to the first page on filter change
    this.loadAffaires();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalAffaires / this.limit); // Calculate total pages
  }
}
