import {Component, inject} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {MatSort} from '@angular/material/sort';
import {RouterLink} from '@angular/router';
import {Supplier} from '../../../../models/supplier.model';
import {SupplierService} from '../../../../services/supplier.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {
  ERROR_MESSAGES as em,
  SUCCESS_MESSAGES as sm,
  SUPPLIER_SEARCH_MODES as SEARCH_MODE
} from '../../../../utils/app.constants';
import {integersOnlyValidator} from '../../../../validators/custom-validators';
import {SupplierDetailDialogComponent} from '../supplier-detail-dialog/supplier-detail-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-supplier-list',
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
    MatHeaderCellDef,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule
  ],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css'
})
export class SupplierListComponent {
  private supplierService = inject(SupplierService);
  private dialog = inject(MatDialog);
  protected authService = inject(AuthService);
  loading = false;
  loadError = false;
  searchFailed = false;
  suppliers: Supplier[] = [];

  hidePagination = false;
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  lastPage = 1;
  dataSource = new MatTableDataSource<Supplier>();
  displayedColumns = [
    'id', 'name', 'ruc', 'address', 'phone', 'email', 'description', 'toolbox',
  ]
  protected readonly SEARCH_MODES = SEARCH_MODE;

  searchForm = new FormGroup({
    keyword: new FormControl('', [Validators.required, Validators.minLength(1), integersOnlyValidator()]),
    searchType: new FormControl(0, [Validators.required]),
  });

  ngOnInit() {
    this.fetchSuppliers();
    this.searchForm.get('searchType')?.valueChanges.subscribe((val) => {
      this.handleSearchType(val!!);
    })
  }

  fetchSuppliers() {
    this.loading = true;
    this.supplierService.getSuppliersPaginated(this.currentPage).subscribe({
      next: response => {
        this.suppliers = response.data;
        this.dataSource = new MatTableDataSource<Supplier>(this.suppliers);
        this.totalItems = response.total;
        this.lastPage = response.last_page;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.loadError = true;
      }
    })
  }

  fetchSuppliersByName(name: string) {
    this.loading = true;
    this.supplierService.getSuppliersByName(name).subscribe({
      next: response => {
        this.suppliers = response;
        this.dataSource = new MatTableDataSource(this.suppliers);
        if (this.suppliers.length <= 0) {
          this.searchFailed = true;
          this.loading = false;
          this.hidePagination = true;
        } else {
          this.hidePagination = true;
          this.loading = false;
          this.searchFailed = false;
        }
      },
      error: error => {
        this.handleSupplierSearchError();
      }
    })
  }

  fetchSupplierById(id: number) {
    this.supplierService.getSupplierById(id).subscribe({
      next: response => {
        this.showSupplierDetail(response);
      },
      error: error => {
        Swal.fire(em.SUPPLIER_NOT_FOUND, `El proveedor de ID: ${id} no ha sido encontrado o no esta disponible.`, 'info');
      }
    })
  }

  fetchSupplierByRuc(ruc: string) {
    this.supplierService.getSupplierByRuc(ruc).subscribe({
      next: response => {
        this.showSupplierDetail(response);
      },
      error: error => {
        Swal.fire(em.SUPPLIER_NOT_FOUND, `El proveedor de RUC: ${ruc} no ha sido encontrado o no esta disponible.`, 'info');
      }
    })
  }

  showSupplierDetail(supplier: Supplier) {
    const dialogRef = this.dialog.open(SupplierDetailDialogComponent, {
      width: '600px',
      height: '560px',
      data: supplier,
    });
  }

  showDeleteDialog(s: Supplier) {
    let text = `Usted esta a punto de eliminar el siguiente proveedor: ${s.name}`;
    Swal.fire({
      title: 'Confirmación de Solicitud',
      text: text,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#54BE3D',
      cancelButtonColor: '#D3211F',
    }).then((op) => {
      if (op.isConfirmed) {
        this.deleteSupplier(s.id!!);
      }
    });
  }

  deleteSupplier(id: number) {
    this.supplierService.deleteSupplier(id).subscribe({
      next: response => {
        Swal.fire(sm.SUCCESS_TAG, sm.SUPPLIER_DELETED, 'success').then((r) => {
          if (r.isDismissed || r.dismiss || r.isConfirmed) {
            window.location.reload();
          }
        });
      },
      error: error => {
        Swal.fire(em.ERROR_TAG, em.SUPPLIER_NOT_FOUND, 'error');
      }
    })
  }

  handleSupplierSearchError() {
    this.loading = false;
    this.searchFailed = true;
    this.hidePagination = true;
  }

  searchSuppliers() {
    const keywordControl = this.searchForm.get('keyword');
    switch (this.searchForm.value.searchType) {
      case 0:
        this.fetchSupplierById(parseInt(keywordControl?.value!!));
        break;
      case 1:
        this.fetchSuppliersByName(keywordControl?.value!!);
        break;
      case 2:
        this.fetchSupplierByRuc(keywordControl?.value!!);
        break;
      default:
        break;
    }
  }

  handleSearchType(val: number) {
    const keywordControl = this.searchForm.get('keyword');
    switch (val) {
      case 0: //By Id
        keywordControl?.setValidators([Validators.required, Validators.minLength(1), integersOnlyValidator()]);
        break;
      case 1: //By Name
        keywordControl?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(150)]);
        break;
      case 2: //By RUC
        keywordControl?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11), integersOnlyValidator()]);
        break;
      default:
        break;
    }
    keywordControl?.setValue('');
    keywordControl?.updateValueAndValidity();
  }

  handleKeywordKeydown(e: KeyboardEvent, searchType: number) {
    if (searchType === 0 || searchType === 2) {
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
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.fetchSuppliers();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchSuppliers();
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
