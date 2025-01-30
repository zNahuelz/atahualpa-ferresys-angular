import {Component, inject} from '@angular/core';
import {ProductService} from '../../../../services/product.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {UnitTypeService} from '../../../../services/unit-type.service';
import {SupplierService} from '../../../../services/supplier.service';
import {UnitType} from '../../../../models/unit-type';
import {Supplier} from '../../../../models/supplier.model';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {Location} from '@angular/common';
import {
  greaterThanZeroValidator,
  greaterThanZeroWithDecimalsValidator,
  notZeroValidator
} from '../../../../validators/custom-validators';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {Product} from '../../../../models/product.model';
import {NotificationService} from '../../../../services/notification.service';

@Component({
  selector: 'app-new-product',
  imports: [ReactiveFormsModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSlideToggleModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {
  private productService = inject(ProductService);
  private unitTypeService = inject(UnitTypeService);
  private supplierService = inject(SupplierService);
  private notificationService = inject(NotificationService);
  location = inject(Location);
  loading = true;
  suppliersLoaded = false;
  unitTypesLoaded = false;
  loadError = false;
  submitting = false;

  unitTypes: UnitType[] = [];
  suppliers: Supplier[] = [];

  newProductForm = new FormGroup({
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
  }

  onSubmit() {
    this.submitting = true;
    const product = new Product(
      this.newProductForm.value.name!!,
      this.newProductForm.value.description!!,
      parseFloat(this.newProductForm.value.buy_price!!),
      parseFloat(this.newProductForm.value.sell_price!!),
      parseInt(this.newProductForm.value.stock!!),
      this.newProductForm.value.supplier_id!!,
      this.newProductForm.value.unit_type_id!!,
      this.newProductForm.value.visible!!
    );
    this.productService.createProduct(product).subscribe({
      next: response => {
        this.notificationService.showNotification(`Producto: ${response.product.name} creado correctamente.`, 'alert-success');
        this.resetForm(); //TODO: Check this!
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    })
    console.log(product);
  }

  allowIntegers(e: KeyboardEvent) {
    if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === ',') {
      e.preventDefault();
    }
  }

  disableNegatives(e: KeyboardEvent) {
    if (e.key === '-' || e.key === 'e') {
      e.preventDefault();
    }
  }

  disableCharacters(e: KeyboardEvent) {
    if (e.key === '"' || e.key === "'") {
      e.preventDefault();
    }
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
        console.log(error);
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
        console.log(error);
      }
    })
  }

  resetForm() {
    this.newProductForm.reset();
    this.newProductForm.markAsPristine();
    this.newProductForm.markAsUntouched();
  }

}
