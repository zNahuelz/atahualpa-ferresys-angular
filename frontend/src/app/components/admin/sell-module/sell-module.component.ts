import {Component, inject} from '@angular/core';
import {Product} from '../../../models/product.model';
import {CartHelper} from '../../../models/cart-helper.entity';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Customer} from '../../../models/customer.model';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {ProductService} from '../../../services/product.service';
import {CustomerService} from '../../../services/customer.service';
import {VoucherTypeService} from '../../../services/voucher-type.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {SM_PRODUCT_SEARCH_MODES} from '../../../utils/app.constants';
import {VoucherType} from '../../../models/voucher-type.model';
import Swal from 'sweetalert2';
import {Router, RouterLink} from '@angular/router';
import {ProductDetailDialogComponent} from '../product/product-detail-dialog/product-detail-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AddToCartDialogComponent} from '../add-to-cart-dialog/add-to-cart-dialog.component';


@Component({
  selector: 'app-sell-module',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    MatSelect,
    MatProgressSpinner,
    MatOption,
    RouterLink
  ],
  templateUrl: './sell-module.component.html',
  styleUrl: './sell-module.component.css'
})
export class SellModuleComponent {
  private productService = inject(ProductService);
  private customerService = inject(CustomerService);
  private voucherTypeService = inject(VoucherTypeService);
  private dialog = inject(MatDialog);
  router = inject(Router);
  loading = false;
  loadError = false;
  products: Product[] = [];
  cartItems: CartHelper[] = [];
  voucherTypes: VoucherType[] = [];
  customer?: Customer;
  subtotal = 0;
  igv = 0;
  total = 0;
  readyToSell = false;
  submitting = false;
  protected readonly SEARCH_MODES = SM_PRODUCT_SEARCH_MODES;

  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  lastPage = 1;
  hidePagination = false;

  searchCustomerForm = new FormGroup({
    dni: new FormControl('', [Validators.required]),
  });

  searchProductForm = new FormGroup({
    keyword: new FormControl('', [Validators.required]),
    searchType: new FormControl(0, [Validators.required]),
  });

  documentType = new FormControl(1, [Validators.required]);

  ngOnInit() {
    this.fetchVoucherType();
    this.fetchProducts();
  }


  searchProduct() {

  }

  addToCart(product: Product) {
    const dialogRef = this.dialog.open(AddToCartDialogComponent, {
      width: '400px',
      height: '250px',
      data: product,
    });
  }


  searchCustomer() {
    this.customerService.getCustomerByDni(this.searchCustomerForm.value.dni!!).subscribe({
      next: response => {
        this.customer = response;
      },
      error: error => {
        this.customer = undefined;
        Swal.fire({
          text: 'Error',
          html: `Cliente de DNI: ${this.searchCustomerForm.value.dni!!} no encontrado. ¿Desea ir al registro?`,
          icon: 'question',
          showCancelButton: true,
          cancelButtonText: 'VOLVER',
          confirmButtonText: 'REGISTRAR',
          confirmButtonColor: '#54BE3D',
          cancelButtonColor: '#D3211F',
        }).then((r) => {
          if (r.isConfirmed) {
            this.router.navigate(['d/new-customer']);
          }
        });
      }
    });
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getProductsPaginated(this.currentPage).subscribe({
      next: (response => {
        this.products = response.data;
        this.totalItems = response.total;
        this.lastPage = response.last_page;
        this.loading = false;
      }),
      error: (error) => {
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  fetchVoucherType() {
    this.loading = true;
    this.voucherTypeService.getVoucherTypes().subscribe({
      next: response => {
        this.loading = false;
        this.voucherTypes = response;
      },
      error: error => {
        this.loadError = true;
      }
    });
  }

  isReadyToSell(){
    return this.documentType!!.value != 0 && this.cartItems.length >= 1 && this.customer != undefined;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.fetchProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchProducts();
    }
  }

  isLastPage() {
    return this.currentPage === this.lastPage;
  }

  isFirstPage() {
    return this.currentPage === 1;
  }
}
