import { Component, OnInit } from '@angular/core';
import { CreditService } from '../../../services/credit.service';
import { AuthService } from '../../../core/service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meshonorraire',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meshonorraire.component.html',
  styleUrl: './meshonorraire.component.scss'
})
export class MeshonorraireComponent implements OnInit {
  credits: any[] = [];  
  currentUser: any;
  totalAmount: number = 0;  // Changed from Number to number

  constructor(private _honnoraireService: CreditService, private _authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();
    this.getHonnoraireClien();
  }

  getHonnoraireClien() {
    this._honnoraireService.getCreditByClient(this.currentUser._id).subscribe({
      next: (value) => {
        this.credits = value.credits;  
        console.log(this.credits);
        this.calculateTotalAmount(); 
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  calculateTotalAmount() {
    this.totalAmount = 0; // Reset totalAmount before calculation
    this.credits.forEach(item => {
      console.log(item,"item")
      // Assuming item.totalCredit is already a number. If it can be a string, then use Number(item.totalCredit)
      this.totalAmount += item.totalCredit; // Using '+=' for cleaner code
    });
  }
}
