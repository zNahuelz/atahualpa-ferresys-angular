import {Component} from '@angular/core';
import {AdminNavbarComponent} from "../../components/shared/admin-navbar/admin-navbar.component";
import {RouterOutlet} from '@angular/router';
import {NotificationComponent} from '../../components/shared/notification/notification.component';

@Component({
  selector: 'app-admin-layout',
  imports: [
    AdminNavbarComponent,
    RouterOutlet,
    NotificationComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
