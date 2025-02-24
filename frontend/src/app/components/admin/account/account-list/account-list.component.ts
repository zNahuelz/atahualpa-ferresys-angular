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
import {MatSort} from '@angular/material/sort';
import Swal from 'sweetalert2';
import {SUCCESS_MESSAGES as sm, ERROR_MESSAGES as em} from '../../../../utils/app.constants';
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
    MatRow,
    MatRowDef,
    MatSort,
    MatTable,
    MatHeaderCellDef,
    RouterLink
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css'
})
export class AccountListComponent {
  private authService = inject(AuthService);
  loading = false;
  loadError = false;
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

  deleteAccount(user: User) {
    Swal.fire({
      title: 'Eliminación de Cuenta',
      html: `¿Está seguro de eliminar la siguiente cuenta de usuario? <br> NOMBRE DE USUARIO: ${user.username} <br> E-MAIL: ${user.email}`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#54BE3D',
      cancelButtonColor: '#D3211F',
    }).then((r) => {
      if (r.isConfirmed) {
        this.loading = true;
        this.authService.deleteAccount(user.id!!).subscribe({
          next: response => {
            this.loading = false;
            Swal.fire(sm.SUCCESS_TAG, sm.ACCOUNT_DELETED, 'success').then((r) => {
              if (r.isConfirmed || r.isDismissed || r.dismiss) {
                window.location.reload();
              }
            });
          },
          error: error => {
            this.loading = false;
            Swal.fire(em.ERROR_TAG, em.SERVER_ERROR, 'error').then((r) => {
              if (r.isConfirmed || r.isDismissed || r.dismiss) {
                window.location.reload();
              }
            });
          }
        });
      }
      this.loading = false;
    });
  }

  resetAccount(user: User) {
    Swal.fire({
      title: 'Reseteo de Credenciales',
      html: `¿Está seguro de resetear las credenciales de la siguiente cuenta de usuario? <br> NOMBRE DE USUARIO: ${user.username} <br> E-MAIL: ${user.email}`,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Resetear',
      confirmButtonColor: '#54BE3D',
      cancelButtonColor: '#D3211F',
    }).then((r) => {
      if (r.isConfirmed) {
        this.authService.resetAccount(user.id!!).subscribe({
          next: response => {
            this.loading = false;
            Swal.fire(sm.SUCCESS_TAG, sm.ACCOUNT_RESET, 'success').then((r) => {
              if (r.isConfirmed || r.isDismissed || r.dismiss) {
                window.location.reload();
              }
            });
          },
          error: error => {
            console.log(error);
            this.loading = false;
            Swal.fire(em.ERROR_TAG, em.SERVER_ERROR, 'error').then((r) => {
              if (r.isConfirmed || r.isDismissed || r.dismiss) {
                window.location.reload();
              }
            });
          }
        })
      }
      this.loading = false
    });
  }

}
