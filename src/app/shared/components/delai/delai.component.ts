import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-delai',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="notification-wrapper" *ngIf="isVisible">
      <div class="notification-content">
        <div class="notification-character-wrapper">
          <img src="assets/pngegg.png" alt="Reminder Character" class="notification-character" [@characterAnimation]="characterAnimationState" />
        </div>
        <div class="notification-text-wrapper">
          <div class="notification-text-container">
            <div class="notification-text-bubble" *ngFor="let message of messages; let i = index" 
                 [@textBubbleAnimation]="i === currentMessageIndex ? 'active' : 'inactive'">
              <span class="notification-category">Délai : {{ message.category }}</span>  
              <span class="notification-details">Audience : {{ message.audianceId?.numero }}</span>
              <span class="notification-details">Affaire : {{ message.affaireId?.numeroAffaire }}</span>
              <a [routerLink]="['/administrator/audiance', message.affaireId._id]" class="notification-link">Vérifiez-le</a>
            </div>
          </div>
          <button class="close-btn" (click)="closeNotification()">✖️</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-wrapper {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      width: 300px; /* Reduced width */
      padding: 10px; /* Reduced padding */
      background: linear-gradient(135deg, #ffd146, #ff9b00);
      border-radius: 15px;  
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); 
      color: #313e4f;
      font-family: 'Montserrat', sans-serif;
      animation: slide-in 0.5s ease-out forwards;
      opacity: 0;
      transform: translateY(100%);
      transition: opacity 0.3s ease-in, transform 0.3s ease-out;
    }

    .notification-content {
      display: flex;
      align-items: center;
    }

    .notification-character-wrapper {
      margin-right: 10px;
    }

    .notification-character {
      width: 100px; /* Reduced character size */
      height: 100px;
      animation: character-bounce 1s infinite alternate;
    }

    .notification-text-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start; /* Align to the left */
    }

    .notification-text-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start; /* Align to the left */
      margin-bottom: 10px;
      width: 100%; /* Use full width */
    }

    .notification-text-bubble {
      background-color: rgba(255, 255, 255, 0.9); 
      padding: 10px; /* Adjusted padding */
      border-radius: 20px; 
      margin-bottom: 8px; 
      max-width: 100%; /* Use full width */
      opacity: 0;
      transform: translateX(20px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      font-size: 14px; /* Smaller font size */
    }

    .notification-category {
      font-weight: bold; /* Emphasize category */
      color: #313e4f;
    }

    .notification-details {
      font-size: 12px; /* Smaller font size */
      color: #555; /* Slightly muted color */
    }

    .notification-link {
      color: #ff9b00; /* Link color */
      text-decoration: none; /* Remove underline */
      font-weight: bold; /* Emphasize link */
      margin-top: 4px; /* Space above the link */
    }

    .close-btn {
      background: transparent;
      border: none;
      font-size: 24px; 
      cursor: pointer;
      color: #313e4f;
      transition: color 0.3s;
      align-self: flex-end; /* Align to the end */
    }

    .close-btn:hover {
      color: #ff9b00; 
    }

    @keyframes slide-in {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes character-bounce {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-10px);
      }
    }
  `],
  animations: [
    trigger('characterAnimation', [
      state('idle', style({ transform: 'translateY(0)' })),
      state('bounce', style({ transform: 'translateY(-10px)' })),
      transition('idle => bounce', [
        animate('0.5s ease-in-out')
      ]),
      transition('bounce => idle', [
        animate('0.5s ease-in-out')
      ])
    ]),
    trigger('textBubbleAnimation', [
      state('inactive', style({ opacity: 0, transform: 'translateX(20px)' })),
      state('active', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('inactive => active', [
        animate('0.3s ease-out')
      ])
    ])
  ]
})
export class DelaiComponent implements OnInit {
  @Input() messages: any;
  @Input() soundUrl: string = 'assets/audio.mp3';

  isVisible: boolean = true;
  characterAnimationState: string = 'idle';
  currentMessageIndex: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.playSound();
    this.startCharacterAnimation();
    this.showNextMessage();
  }

  playSound(): void {
    const audio = new Audio(this.soundUrl);
    audio.play();
  }

  closeNotification(): void {
    this.isVisible = false;
  }

  startCharacterAnimation(): void {
    setInterval(() => {
      this.characterAnimationState = this.characterAnimationState === 'idle' ? 'bounce' : 'idle';
    }, 2000);
  }

  showNextMessage(): void {
    setTimeout(() => {
      this.currentMessageIndex = (this.currentMessageIndex + 1) % this.messages.length; 
      this.showNextMessage(); 
    }, 3000);  
  }
}
