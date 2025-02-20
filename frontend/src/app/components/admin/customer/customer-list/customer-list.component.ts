import {Component, inject} from '@angular/core';
import {CustomerService} from '../../../../services/customer.service';
import {Customer} from '../../../../models/customer.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {CUSTOMER_SEARCH_MODES} from '../../../../utils/app.constants';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {integersOnlyValidator} from '../../../../validators/custom-validators';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatSort} from '@angular/material/sort';
import {RouterLink} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CustomerDetailDialogComponent} from '../customer-detail-dialog/customer-detail-dialog.component';
import Swal from 'sweetalert2';
import {SUCCESS_MESSAGES as sm, ERROR_MESSAGES as em} from '../../../../utils/app.constants';

@Component({
  selector: 'app-customer-list',
  imports: [
    MatProgressSpinner,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatRow,
    MatRowDef,
    MatSelect,
    MatSort,
    MatTable,
    ReactiveFormsModule,
    RouterLink,
    MatHeaderCellDef
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent {
  private customerService = inject(CustomerService);
  private dialog = inject(MatDialog);
  customers: Customer[] = [];
  loading = false;
  loadError = false;

  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  lastPage = 1;
  dataSource = new MatTableDataSource<Customer>();
  protected readonly SEARCH_MODES = CUSTOMER_SEARCH_MODES;
  displayedColumns = [
    'id', 'name', 'surname', 'dni', 'phone', 'email', 'toolbox'
  ]

  searchForm = new FormGroup({
    keyword: new FormControl('', [Validators.required, Validators.minLength(1), integersOnlyValidator()]),
    searchType: new FormControl(0, [Validators.required]),
  });

  ngOnInit(): void {
    this.fetchCustomers();
    this.searchForm.get('searchType')?.valueChanges.subscribe((val) => {
      this.handleSearchType(val!!);
    })
  }

  fetchCustomers() {
    this.loading = true;
    this.customerService.getCustomersPaginated(this.currentPage).subscribe({
      next: response => {
        this.customers = response.data;
        this.dataSource = new MatTableDataSource<Customer>(this.customers);
        this.totalItems = response.total;
        this.lastPage = response.last_page;
        this.loading = false;
        if (this.customers.length <= 0) {
          this.loadError = true;
        }
      },
      error: error => {
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  fetchCustomerById(id: number) {
    this.customerService.getCustomerById(id).subscribe({
      next: response => {
        this.showCustomerDetail(response);
      },
      error: error => {
        Swal.fire(em.ERROR_TAG, em.CUSTOMER_NOT_FOUND, 'error').then((r) => {
          if (r.isDismissed || r.dismiss || r.isConfirmed) {
            this.searchForm.get('searchType')?.setValue(0);
            this.searchForm.get('keyword')?.setValue('');
          }
        })
      }
    });
  }

  fetchCustomerByDni(dni: string) {
    this.customerService.getCustomerByDni(dni).subscribe({
      next: response => {
        this.showCustomerDetail(response);
      },
      error: error => {
        Swal.fire(em.ERROR_TAG, em.CUSTOMER_NOT_FOUND, 'error').then((r) => {
          if (r.isDismissed || r.dismiss || r.isConfirmed) {
            this.searchForm.get('searchType')?.setValue(0);
            this.searchForm.get('keyword')?.setValue('');
          }
        })
      }
    });
  }

  handleSearchType(val: number) {
    const keywordControl = this.searchForm.get('keyword');
    switch (val) {
      case 0:
        //By ID
        keywordControl?.setValidators([Validators.required, Validators.minLength(1), integersOnlyValidator()]);
        keywordControl?.reset();
        break;
      case 1:
        //By DNI
        keywordControl?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8), integersOnlyValidator()]);
        keywordControl?.reset();
        break;
      default:
        break;
    }
    keywordControl?.updateValueAndValidity();
  }

  handleKeywordKeydown(e: KeyboardEvent) {
    // Allow: backspace, delete, tab, escape, enter, and numbers
    if (
      [46, 8, 9, 27, 13].includes(e.keyCode) || // Special keys
      (e.keyCode >= 48 && e.keyCode <= 57) || // Number keys
      (e.keyCode >= 96 && e.keyCode <= 105) // Numpad keys
    ) {
      return; // Allow the input
    }
    e.preventDefault();
  }

  showCustomerDetail(customer: Customer) {
    const dialogRef = this.dialog.open(CustomerDetailDialogComponent, {
      width: '600px',
      height: '560px',
      data: customer,
    });
  }

  searchCustomer() {
    switch (this.searchForm.get('searchType')?.value) {
      case 0:
        this.fetchCustomerById(parseInt(this.searchForm.value.keyword!!));
        break;
      case 1:
        this.fetchCustomerByDni(this.searchForm.value.keyword!!);
        break;
      default:
        break;
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.fetchCustomers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchCustomers();
    }
  }

  isLastPage() {
    return this.currentPage === this.lastPage;
  }

  isFirstPage() {
    return this.currentPage === 1;
  }

  reloadPage() {
    window.location.reload();
  }

}
