import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../services/product.service';
import {Product} from '../../../../models/product.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {
  greaterThanZeroValidator,
  greaterThanZeroWithDecimalsValidator,
  notZeroValidator
} from '../../../../validators/custom-validators';
import {UnitTypeService} from '../../../../services/unit-type.service';
import {SupplierService} from '../../../../services/supplier.service';
import {UnitType} from '../../../../models/unit-type.model';
import {Supplier} from '../../../../models/supplier.model';
import {Location} from '@angular/common';
import Swal from 'sweetalert2';
import {SUCCESS_MESSAGES as sm, ERROR_MESSAGES as em} from '../../../../utils/app.constants';
import {allowIntegers, disableNegatives, disableCharacters} from '../../../../utils/app.helpers';

@Component({
  selector: 'app-edit-product',
  imports: [
    MatProgressSpinner,
    FormsModule,
    MatError,
    MatFabButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private unitTypeService = inject(UnitTypeService);
  private supplierService = inject(SupplierService);
  allowIntegers = allowIntegers;
  disableNegatives = disableNegatives;
  disableCharacters = disableCharacters;
  location = inject(Location);
  router = inject(Router);
  product = new Product();
  loading = true;
  loadError = false;
  suppliersLoaded = false;
  unitTypesLoaded = false;
  submitting = false;

  unitTypes: UnitType[] = [];
  suppliers: Supplier[] = [];

  productId = this.activatedRoute.snapshot.paramMap.get('id');

  editProductForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
    description: new FormControl('', [Validators.maxLength(255)]),
    buy_price: new FormControl('', [Validators.required, Validators.pattern('^\\d+(\\.\\d{1,2})?$'), greaterThanZeroWithDecimalsValidator()]),
    sell_price: new FormControl('', [Validators.required, Validators.pattern('^\\d+(\\.\\d{1,2})?$'), greaterThanZeroWithDecimalsValidator()]),
    stock: new FormControl('', [Validators.required, Validators.pattern('^\\d+$'), greaterThanZeroValidator()]),
    supplier_id: new FormControl(0, [Validators.required, notZeroValidator()]),
    unit_type_id: new FormControl(0, [Validators.required, notZeroValidator()]),
    visible: new FormControl(true),
  });

  ngOnInit() {
    this.fetchUnitTypes();
    this.fetchSuppliers();
    this.fetchProductById(parseInt(this.productId!!));
  }

  fetchProductById(id: number) {
    this.productService.getProductById(id).subscribe({
      next: response => {
        this.product = response;
        this.editProductForm.patchValue({
          name: this.product.name,
          description: this.product.description,
          buy_price: this.product.buy_price!!.toString(),
          sell_price: this.product.sell_price!!.toString(),
          stock: this.product.stock!!.toString(),
          supplier_id: this.product.supplier_id,
          unit_type_id: this.product.unit_type?.id,
          visible: this.product.visible
        });
        this.loading = false;
      },
      error: error => {
        this.loading = true;
        this.router.navigate(['/d/product'])
      }
    });
  }

  fetchUnitTypes() {
    this.unitTypeService.getUnitTypes().subscribe({
      next: response => {
        this.unitTypes = response;
        if (this.unitTypes.length > 0) {
          this.unitTypesLoaded = true;
        }
      },
      error: error => {
        this.loading = false;
        this.unitTypesLoaded = false;
        this.loadError = true;
      }
    });
  }

  fetchSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: response => {
        this.suppliers = response;
        if (this.suppliers.length > 0) {
          this.suppliersLoaded = true;
        }
        if (this.unitTypesLoaded && this.suppliersLoaded) {
          this.loading = false;
        }
      },
      error: error => {
        this.loading = false;
        this.suppliersLoaded = false;
        this.loadError = true;

      }
    })
  }

  onSubmit() {
    this.submitting = true;
    const product = new Product(
      this.editProductForm.value.name!!,
      this.editProductForm.value.description!!,
      parseFloat(this.editProductForm.value.buy_price!!),
      parseFloat(this.editProductForm.value.sell_price!!),
      parseInt(this.editProductForm.value.stock!!),
      this.editProductForm.value.supplier_id!!,
      this.editProductForm.value.unit_type_id!!,
      this.editProductForm.value.visible!!
    );
    this.productService.updateProduct(product, parseInt(this.productId!!)).subscribe({
      next: response => {
        this.submitting = false;
        Swal.fire(sm.SUCCESS_TAG, sm.PRODUCT_UPDATED, 'success').then((r) => {
          if (r.isConfirmed || r.dismiss || r.isDismissed) {
            this.router.navigate(['/d/product'])
          }
        });
      },
      error: error => {
        Swal.fire(em.ERROR_TAG, em.PRODUCT_UPDATE_FAILED, 'error').then((r) => {
          if (r.isConfirmed || r.dismiss || r.isDismissed) {
            this.router.navigate(['/d/product'])
          }
        })
      }
    })
  }

  resetForm() {
    window.location.reload();
  }

}
