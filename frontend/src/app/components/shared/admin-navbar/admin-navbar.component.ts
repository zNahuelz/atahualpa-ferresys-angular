import {Component, inject} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {AuthService} from '../../../services/auth.service';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {
  protected authService = inject(AuthService);
}
