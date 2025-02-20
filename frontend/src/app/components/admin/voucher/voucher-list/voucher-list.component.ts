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
import Swal from 'sweetalert2';
import {ERROR_MESSAGES as em} from '../../../../utils/app.constants';
import {formatDateToY_m_d} from '../../../../utils/app.helpers';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatSort} from '@angular/material/sort';
import {Router, RouterLink} from '@angular/router';
import {DatePipe, NgClass} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {
  VOUCHER_SEARCH_MODES as SEARCH_MODES,
  VOUCHER_FILTER_TYPES as FILTER_MODES
} from '../../../../utils/app.constants';
import {integersOnlyValidator} from '../../../../validators/custom-validators';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from '@angular/material/datepicker';

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
    NgClass,
    ReactiveFormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatDateRangeInput,
    MatFormFieldModule,
    MatDatepickerModule,
    DatePipe
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './voucher-list.component.html',
  styleUrl: './voucher-list.component.css'
})
export class VoucherListComponent {
  private voucherService = inject(VoucherService);
  router = inject(Router);
  loading = false;
  loadError = false;
  hidePagination = false;
  hideRange = true;
  hideDatepicker = false;
  vouchers: Voucher[] = [];
  dataSource = new MatTableDataSource<Voucher>();
  displayedColumns = [
    'id', 'customer_data', 'voucher_type', 'subtotal', 'igv', 'total', 'paid', 'created_at', 'toolbox'
  ]
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  lastPage = 1;
  selectedDate?: Date;
  selectedDateString = '';
  paginationType = 0; //0 -> By Month 1 -> By Range 2 -> By Customer Dni.
  protected readonly SEARCH_MODES = SEARCH_MODES;
  protected readonly FILTER_MODES = FILTER_MODES;

  searchForm = new FormGroup({
    keyword: new FormControl('', [Validators.required, integersOnlyValidator()]),
    searchType: new FormControl(0, [Validators.required]),
  });

  filterForm = new FormGroup({
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    selectedMonth: new FormControl(null, [Validators.required]),
    filterType: new FormControl(0, [Validators.required]),
  });

  ngOnInit() {
    this.fetchVouchersByMonth();
    this.searchForm.get('searchType')?.valueChanges.subscribe((val) => {
      this.handleSearchType(val!!);
    });

    this.filterForm.get('filterType')?.valueChanges.subscribe((val) => {
      this.handleFilterType(val!!);
    });
  }

  searchVouchers() {
    switch (this.searchForm.value.searchType) {
      case 0:
        this.loading = true;
        this.voucherService.getVoucherById(parseInt(this.searchForm.value.keyword!!)).subscribe({
          next: result => {
            this.router.navigate([`/d/voucher/${result.id}`]);
          },
          error: error => {
            this.searchForm.setValue({searchType: 0, keyword: ''});
            this.loading = false;
            Swal.fire(em.ERROR_TAG, em.VOUCHER_NOT_FOUND, 'error');
          }
        });
        break;
      case 1:
        this.loading = true;
        this.paginationType = 2;
        this.currentPage = 1;
        this.fetchVouchersByCustomerDni();
        break;
      default:
        break;
    }
  }

  filterVouchers() {
    switch (this.filterForm.value.filterType) {
      case 0: //Month-Year
        this.currentPage = 1;
        const date = new Date(this.filterForm.value.selectedMonth!!);
        this.selectedDate = date;
        this.fetchVouchersByMonth();
        break;
      case 1: //Range
        this.currentPage = 1;
        this.selectedDate = undefined;
        this.fetchVouchersByRange();
        break;
      default:
        break;
    }
  }

  fetchVouchersByCustomerDni() {
    this.voucherService.getVouchersByCustomerDni(this.currentPage, this.searchForm.value.keyword!!).subscribe({
      next: response => {
        this.vouchers = response.data;
        this.dataSource = new MatTableDataSource<Voucher>(this.vouchers);
        this.totalItems = response.total;
        this.lastPage = response.last_page;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
        Swal.fire(em.ERROR_TAG, em.VOUCHER_NOT_FOUND_DNI, 'error').then((r) => {
          if (r.isConfirmed || r.isDismissed || r.dismiss) {
            window.location.reload();
          }
        });
      }
    });
  }

  fetchVouchersByMonth() {
    if (this.selectedDate === undefined) {
      this.selectedDate = new Date();
      this.selectedDateString = formatDateToY_m_d(this.selectedDate);
    } else {
      this.selectedDateString = formatDateToY_m_d(this.selectedDate);
    }
    this.loading = true;
    this.voucherService.getVouchersByMonth(this.currentPage, this.selectedDateString).subscribe({
      next: (response) => {
        this.handleApiResponse(response);
      },
      error: error => {
        Swal.fire(em.ERROR_TAG, em.VOUCHERS_ERROR_BY_DATE, 'error');
      }
    });
  }

  fetchVouchersByRange() {
    this.loading = true;
    let start = formatDateToY_m_d(new Date(this.filterForm.value.startDate!!));
    let end = formatDateToY_m_d(new Date(this.filterForm.value.endDate!!));
    this.voucherService.getVouchersByRange(this.currentPage, start, end).subscribe({
      next: response => {
        this.handleApiResponse(response);
      },
      error: error => {
        Swal.fire(em.ERROR_TAG, em.VOUCHERS_ERROR_BY_RANGE, 'error').then((r) => {
          if (r.isConfirmed || r.isDismissed || r.dismiss) {
            window.location.reload();
          }
        });
      }
    });
  }

  handleApiResponse(response: any) {
    this.vouchers = response.data;
    this.dataSource = new MatTableDataSource<Voucher>(this.vouchers);
    this.totalItems = response.total;
    this.lastPage = response.last_page;
    this.loading = false;
    if (this.vouchers.length <= 0) {
      this.loadError = true;
    }
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
        //By DNI-RUC
        keywordControl?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(11), integersOnlyValidator()]);
        keywordControl?.reset();
        break;
      default:
        break;
    }
    keywordControl?.updateValueAndValidity();
  }

  handleFilterType(val: number) {
    const startDateControl = this.filterForm.get('startDate');
    const endDateControl = this.filterForm.get('endDate');
    const selectedMonthControl = this.filterForm.get('selectedMonth');
    switch (this.filterForm.value.filterType) {
      case 0: //M-Y
        this.hideRange = true;
        this.hideDatepicker = false;
        selectedMonthControl?.reset();
        selectedMonthControl!!.setValidators([Validators.required]);
        startDateControl!!.clearValidators();
        endDateControl!!.clearValidators();
        break;
      case 1: //RANGE
        this.hideRange = false;
        this.hideDatepicker = true;
        startDateControl?.reset();
        endDateControl?.reset();
        startDateControl!!.setValidators([Validators.required]);
        endDateControl!!.setValidators([Validators.required]);
        selectedMonthControl!!.clearValidators();
        break;
      default:
        break;
    }
    startDateControl!!.updateValueAndValidity();
    endDateControl!!.updateValueAndValidity();
    selectedMonthControl!!.updateValueAndValidity();
  }

  handleKeywordKeydown(e: KeyboardEvent) {
    if (
      [46, 8, 9, 27, 13].includes(e.keyCode) ||
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      return;
    }
    e.preventDefault();
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
        case 1:
          this.fetchVouchersByRange();
          break;
        case 2:
          this.fetchVouchersByCustomerDni();
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
        case 1:
          this.fetchVouchersByRange();
          break;
        case 2:
          this.fetchVouchersByCustomerDni();
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

  reloadPage() {
    window.location.reload();
  }

}
