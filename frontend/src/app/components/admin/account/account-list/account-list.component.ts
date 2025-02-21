import {Component, inject} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {AuthService} from '../../../../services/auth.service';
import {User} from '../../../../models/user.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {Product} from '../../../../models/product.model';
import {MatIcon} from '@angular/material/icon';
import {MatSort} from '@angular/material/sort';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-account-list',
  imports: [
    MatProgressSpinner,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatSort,
    MatTable,
    RouterLink,
    MatHeaderCellDef
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css'
})
export class AccountListComponent {
  private authService = inject(AuthService);
  loading = false;
  loadError = false;
  //TODO: Eliminar y resetear cuentas.
  users: User[] = [];
  dataSource = new MatTableDataSource<User>();
  displayedColumns = [
    'id', 'username', 'name', 'paternal_surname', 'maternal_surname', 'phone', 'email', 'role', 'toolbox'
  ]

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    this.authService.getUsers().subscribe({
      next: response => {
        this.users = response;
        this.dataSource.data = response;
        if (this.users.length <= 0) {
          this.loading = false;
          this.loadError = true;
        } else {
          this.loading = false;
        }
      },
      error: error => {
        this.loading = false;
        this.loadError = true;
      }
    });
  }
}
