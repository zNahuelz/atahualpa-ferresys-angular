import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SupplierService} from '../../../../services/supplier.service';
import {Supplier} from '../../../../models/supplier.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-edit-supplier',
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './edit-supplier.component.html',
  styleUrl: './edit-supplier.component.css'
})
export class EditSupplierComponent {
  private activatedRoute = inject(ActivatedRoute);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  supplier = new Supplier();
  loading = true;

  supplierId = this.activatedRoute.snapshot.paramMap.get('id');

  ngOnInit() {
    this.fetchSupplierById(parseInt(this.supplierId!!));
  }

  fetchSupplierById(id: number) {
    this.supplierService.getSupplierById(id).subscribe({
      next: result => {
        this.supplier = result;
        this.loading = false;
        console.log(result);
      },
      error: error => {
        this.loading = false;
        this.router.navigate(['/d/supplier'])
      }
    });
  }
}
