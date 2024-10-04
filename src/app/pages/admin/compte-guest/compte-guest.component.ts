import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compte-guest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compte-guest.component.html',
  styleUrls: ['./compte-guest.component.scss']
})
export class CompteGuestComponent implements OnInit {
  idGuest!: string;
  guestForm!: FormGroup;

  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService 
  ) {}

  guest: any;

  ngOnInit(): void {
    // Initialize form
    this.guestForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      address: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    });

    // Get the idGuest from the route params
    this.idGuest = this._route.snapshot.paramMap.get('id') || '';
    
    // Fetch guest data and patch the form values
    this._authService.getGuestById(this.idGuest).subscribe({
      next: (guestData) => {
        this.guest = guestData;

        // Patch form values
        this.guestForm.patchValue({
          username: this.guest.firstName,
          firstName: this.guest.firstName,
          lastName: this.guest.lastName,
          email: this.guest.email || '',
          phone: this.guest.number || ''
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.guestForm.valid) {
      const record: any = {
        username: this.guestForm.value.username,
        lastname: this.guestForm.value.lastName,
        email: this.guestForm.value.email,
        telephone1: this.guestForm.value.phone,
        password: this.guestForm.value.password,
        address: this.guestForm.value.address,
        dateOfBirth: this.guestForm.value.dateOfBirth,
      };

      this._authService.registerGuest(record, this.idGuest).subscribe({
        next: (response) => {
          this.toastr.success('User added successfully');
        },
        error: (error) => {
          this.toastr.error('Failed to add user');
        },
      });
    } else {
      this.toastr.warning('Please fill in all required fields');
    }
  }

  // Getter for form controls
  get f(): { [key: string]: AbstractControl } {
    return this.guestForm.controls;
  }
}
