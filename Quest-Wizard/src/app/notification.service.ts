import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly message = signal<string | null>(null);
  readonly show = signal<boolean>(false);
  private timer: any;

  showNotification(msg: string, duration = 4000): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.message.set(msg);
    this.show.set(true);

    this.timer = setTimeout(() => {
      this.show.set(false);
      this.timer = null;
    }, duration);
  }
}