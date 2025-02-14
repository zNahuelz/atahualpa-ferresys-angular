import {Component, inject} from '@angular/core';
import {VoucherService} from '../../../../services/voucher.service';
import {Voucher} from '../../../../models/voucher.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {Product} from '../../../../models/product.model';
import Swal from 'sweetalert2';
import {SUCCESS_MESSAGES as sm, ERROR_MESSAGES as em} from '../../../../utils/app.constants';
import {formatDateToY_m_d} from '../../../../utils/app.helpers';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatSort} from '@angular/material/sort';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-voucher-list',
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
    NgClass
  ],
  templateUrl: './voucher-list.component.html',
  styleUrl: './voucher-list.component.css'
})
export class VoucherListComponent {
  private voucherService = inject(VoucherService);
  loading = false;
  hidePagination = false;
  vouchers: Voucher[] = [];
  dataSource = new MatTableDataSource<Voucher>();
  displayedColumns = [
    'id', 'customer_data', 'voucher_type', 'subtotal', 'igv', 'total', 'paid', 'toolbox'
  ]
  totalItems = 0;
  currentPage = 1;
  pageSize = 50;
  lastPage = 1;
  selectedDate?: Date;
  selectedDateString = '';
  paginationType = 0; //0 -> By Month 1 -> By Range 2 -> By Customer Dni.

  ngOnInit() {
    this.fetchVouchersByMonth();
  }


  fetchVouchersByMonth() {
    if (this.selectedDate === undefined) {
      this.selectedDate = new Date();
      this.selectedDateString = formatDateToY_m_d(this.selectedDate);
    } else {
      this.selectedDateString = formatDateToY_m_d(this.selectedDate);
    }
    this.loading = true;
    this.resetPagination();
    this.voucherService.getVouchersByMonth(this.currentPage, this.selectedDateString).subscribe({
      next: (response) => {
        this.vouchers = response.data;
        this.dataSource = new MatTableDataSource<Voucher>(this.vouchers);
        this.totalItems = response.total;
        this.lastPage = response.last_page;
        this.loading = false;
        console.log(this.vouchers);
      },
      error: error => {
        console.log(error);
        Swal.fire(em.ERROR_TAG, em.VOUCHERS_ERROR_BY_DATE, 'error');
      }
    });
  }


  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  nextPage(fetchType: number) {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      switch (fetchType) {
        case 0:
          this.fetchVouchersByMonth();
          break;
        default:
          break;
      }
    }
  }

  prevPage(fetchType: number) {
    if (this.currentPage > 1) {
      this.currentPage--;
      switch (fetchType) {
        case 0:
          this.fetchVouchersByMonth();
          break;
        default:
          break;
      }
    }
  }

  isLastPage() {
    return this.currentPage === this.lastPage;
  }

  isFirstPage() {
    return this.currentPage === 1;
  }

  resetPagination() {
    this.totalItems = 0;
    this.currentPage = 1;
    this.pageSize = 50;
    this.lastPage = 1;
  }

  reloadPage() {
    window.location.reload();
  }
}
