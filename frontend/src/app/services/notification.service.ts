import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Notification} from '../models/notification.entity';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor() {
  }

  private notifications: Notification[] = [];
  private notificationSubject = new Subject<Notification[]>();
  notification$ = this.notificationSubject.asObservable();

  showNotification(message: string, type: string): void {
    const n = new Notification(message, type);
    this.notifications.push(n);
    this.notificationSubject.next([...this.notifications]);
  }

  hideNotification(index: number): void {
    this.notifications.splice(index, 1);
    this.notificationSubject.next([...this.notifications]);
  }

  clearNotifications(): void {
    this.notifications = [];
    this.notificationSubject.next([...this.notifications]);
  }

}
