import {Component, inject} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-seller-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, RouterModule],
  templateUrl: './seller-navbar.component.html',
  styleUrl: './seller-navbar.component.css'
})
export class SellerNavbarComponent {
  protected authService = inject(AuthService);
}
