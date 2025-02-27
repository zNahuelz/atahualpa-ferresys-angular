import {Component, inject} from '@angular/core';
import {DatePipe, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgOptimizedImage,
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  protected authService = inject(AuthService);

  protected readonly Date = Date;
}
