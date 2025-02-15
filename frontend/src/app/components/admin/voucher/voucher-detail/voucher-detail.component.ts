import {Component, inject} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {VoucherService} from '../../../../services/voucher.service';
import {DatePipe, Location} from '@angular/common';
import {Voucher} from '../../../../models/voucher.model';
import Swal from 'sweetalert2';
import {ERROR_MESSAGES as em} from '../../../../utils/app.constants';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-voucher-detail',
  imports: [
    MatProgressSpinner,
    DatePipe
  ],
  templateUrl: './voucher-detail.component.html',
  styleUrl: './voucher-detail.component.css'
})
export class VoucherDetailComponent {
  private activatedRoute = inject(ActivatedRoute);
  private voucherService = inject(VoucherService);
  private snackbar = inject(MatSnackBar);
  location = inject(Location);
  router = inject(Router);
  loading = false;
  voucher = new Voucher();

  voucherId = this.activatedRoute.snapshot.paramMap.get('id');

  ngOnInit() {
    this.fetchVoucherById(parseInt(this.voucherId!!));
  }

  fetchVoucherById(id: number) {
    this.loading = true;
    this.voucherService.getVoucherById(id).subscribe({
      next: response => {
        this.voucher = response;
        this.loading = false;
      },
      error: error => {
        this.loading = true;
        this.router.navigate(['/d/voucher'])
      }
    });
  }

  downloadVoucher() {
    this.snackbar.open('Descargando comprobante...', 'Cerrar', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 1500,
    });
    this.voucherService.downloadVoucherById(parseInt(this.voucherId!!)).subscribe({
      next: file => {
        const temp = document.createElement('a');
        temp.href = window.URL.createObjectURL(file);
        temp.download = `BOL-${this.voucherId}-${this.voucher.customer?.dni}.pdf`;
        temp.click();
        window.URL.revokeObjectURL(temp.href);
        temp.remove();
      },
      error: error => {
        Swal.fire(em.ERROR_TAG, em.VOUCHER_DOWNLOAD_FAILED, 'error').then((r) => {
          if (r.isDismissed || r.dismiss || r.isConfirmed) {
            window.location.reload();
          }
        });
      }
    });
  }
}
