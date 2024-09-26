import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lock',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './lock.component.html',
  styleUrl: './lock.component.scss'
})
export class LockComponent {
  password: string = '';
  @Output() unlocked = new EventEmitter<void>();

  unlock() {
    if (this.password === 'PASSWORD') {
      this.unlocked.emit();
    } else {
      alert('Incorrect password!');
    }
  }
}
