import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class NotificationComponent {
  private readonly notificationService = inject(NotificationService);
  readonly messages = computed(() => this.notificationService.messages());

  dismiss(id: number): void {
    this.notificationService.dismiss(id);
  }
}
