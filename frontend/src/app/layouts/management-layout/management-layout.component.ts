import {Component, inject} from '@angular/core';
import {AdminNavbarComponent} from '../../components/shared/admin-navbar/admin-navbar.component';
import {NotificationComponent} from '../../components/shared/notification/notification.component';
import {RouterOutlet} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {SellerNavbarComponent} from '../../components/shared/seller-navbar/seller-navbar.component';

@Component({
  selector: 'app-management-layout',
  imports: [
    AdminNavbarComponent,
    NotificationComponent,
    RouterOutlet,
    SellerNavbarComponent
  ],
  templateUrl: './management-layout.component.html',
  styleUrl: './management-layout.component.css'
})
export class ManagementLayoutComponent {
  protected authService = inject(AuthService);
}
