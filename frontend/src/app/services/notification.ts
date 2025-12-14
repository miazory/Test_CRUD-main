import { Injectable, computed, signal } from '@angular/core';

export type NotificationType = 'success' | 'warning' | 'danger' | 'info';

export interface NotificationMessage {
  id: number;
  text: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly messagesSignal = signal<NotificationMessage[]>([]);

  readonly messages = computed(() => this.messagesSignal());

  push(type: NotificationType, text: string): void {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const message: NotificationMessage = { id, type, text };
    this.messagesSignal.update((current) => [...current, message]);

    setTimeout(() => this.dismiss(id), 3500);
  }

  dismiss(id: number): void {
    this.messagesSignal.update((current) => current.filter((msg) => msg.id !== id));
  }
}
