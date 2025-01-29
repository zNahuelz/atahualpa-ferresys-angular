import {Component, inject} from '@angular/core';
import {Notification} from '../../../models/notification.entity';
import {NotificationService} from '../../../services/notification.service';
import {of} from 'rxjs';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  notifications: Notification[] = [];

  private notificationService = inject(NotificationService);

  ngOnInit() {
    this.notificationService.notification$.subscribe(notification => {
      this.notifications = notification;
    });
  }

  closeNotification(index: number) {
    this.notificationService.hideNotification(index);
  }

  protected readonly of = of;
}
