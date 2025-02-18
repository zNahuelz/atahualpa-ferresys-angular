import {Component, inject} from '@angular/core';
import {Product} from '../../../models/product.model';
import {CartHelper} from '../../../models/cart-helper.entity';
import {MatFormField, MatLabel} from '@angular/material/form-field';
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
import {MatDialog} from '@angular/material/dialog';
import {AddToCartDialogComponent} from '../add-to-cart-dialog/add-to-cart-dialog.component';
import {integersOnly} from '../../../validators/custom-validators';
import {VoucherService} from '../../../services/voucher.service';
import {SUCCESS_MESSAGES as sm, ERROR_MESSAGES as em} from '../../../utils/app.constants';


@Component({
  selector: 'app-sale-module',
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
  templateUrl: './sale-module.component.html',
  styleUrl: './sale-module.component.css'
})
export class SaleModuleComponent {
  //TODO: TEST AND REFACTOR.
  private productService = inject(ProductService);
  private customerService = inject(CustomerService);
  private voucherTypeService = inject(VoucherTypeService);
  private voucherService = inject(VoucherService);
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
  searchError = false;
  protected readonly SEARCH_MODES = SM_PRODUCT_SEARCH_MODES;

  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  lastPage = 1;
  hidePagination = false;

  searchCustomerForm = new FormGroup({
    dni: new FormControl('', [Validators.minLength(1), Validators.maxLength(11), Validators.required, integersOnly()]),
  });

  searchProductForm = new FormGroup({
    keyword: new FormControl('', [Validators.minLength(1), integersOnly(), Validators.required]),
    searchType: new FormControl(0, [Validators.required]),
  });

  documentType = new FormControl(1, [Validators.required]);

  ngOnInit() {
    this.fetchVoucherType();
    this.fetchProducts();
    this.searchProductForm.get('searchType')?.valueChanges.subscribe((val) => {
      this.handleSearchType(val!!);
    });
  }


  searchProduct() {
    switch (this.searchProductForm.get('searchType')?.value) {
      case 0:
        this.fetchProductById(parseInt(this.searchProductForm.value.keyword!!) || 0);
        break;
      case 1:
        this.fetchProductsByName(this.searchProductForm.value.keyword!!);
        break;
      default:
        break;
    }
  }

  handleSearchType(val: number) {
    const keywordControl = this.searchProductForm.get('keyword');
    switch (val) {
      case 0:
        //By ID
        keywordControl?.setValidators([Validators.required, Validators.minLength(1), integersOnly()]);
        keywordControl?.reset();
        break;
      case 1:
        //By name
        keywordControl?.setValidators([Validators.required, Validators.minLength(3)]);
        keywordControl?.reset();
        break;
      default:
        break;
    }
    keywordControl?.updateValueAndValidity();
  }

  handleKeywordKeydown(e: KeyboardEvent, searchType: number) {
    if (searchType === 0) {
      if (
        [46, 8, 9, 27, 13].includes(e.keyCode) || // Special keys
        (e.keyCode >= 48 && e.keyCode <= 57) || // Number keys
        (e.keyCode >= 96 && e.keyCode <= 105) // Numpad keys
      ) {
        return;
      }
      e.preventDefault();
    }
  }

  showAddToCart(product: Product, cartItems: CartHelper[]) {
    const dialogRef = this.dialog.open(AddToCartDialogComponent, {
      width: '400px',
      height: '350px',
      data: {product, cartItems}
    });
    dialogRef.afterClosed().subscribe((r: CartHelper) => {
      if (r) {
        this.addToCart(r);
      }
    });
  }

  addToCart(i: CartHelper) {
    const existingItem = this.cartItems.find((e) => e.product?.id === i.product?.id);

    if (existingItem) {
      if (existingItem.amount!! + i.amount!! <= i.product?.stock!!) {
        existingItem.amount!! += i.amount!!;
        existingItem.subtotal = existingItem.amount!! * existingItem.product?.sell_price!!;
      }
    } else {
      this.cartItems = [...this.cartItems, i];
    }
  }

  removeFromCart(i: CartHelper) {
    const item = this.cartItems.find((e) => e.product?.id === i.product?.id);
    this.cartItems.splice(this.cartItems.indexOf(item!!), 1);
  }

  getSubtotal() {
    let subT = 0;
    if (this.cartItems.length > 0) {
      this.cartItems.forEach((e) => {
        subT += e.subtotal!!;
      });
    }
    this.igv = parseFloat((subT * 0.18).toFixed(2));

    return (subT - this.igv).toFixed(2);
  }

  getTotal() {
    return (parseFloat(this.getSubtotal()) + this.igv).toFixed(2);
  }

  saveSale() {
    this.submitting = true;
    let saleInfo = {
      voucherType: this.documentType.value,
      customerId: this.customer!!.id,
      cartItems: this.cartItems,
      paid: true,
      subtotal: parseFloat(this.getSubtotal()),
      igv: this.igv,
      total: parseFloat(this.getTotal()),
    }
    this.voucherService.createVoucher(saleInfo).subscribe({
      next: response => {
        Swal.fire(sm.SUCCESS_TAG, `${sm.SALE_COMPLETED} Correlativo asignado: ${response.id || '00'} puede visualizar su comprobante de venta en la sección correspondiente.`, 'success').then((r) => {
          if (r.isConfirmed || r.isDismissed || r.dismiss) {
            window.location.reload();
          }
        });
      },
      error: error => {
        Swal.fire(em.ERROR_TAG, em.SERVER_ERROR, 'error').then((r) => {
          if (r.isConfirmed || r.isDismissed || r.dismiss) {
            window.location.reload();
          }
        });
      }
    });
  }


  searchCustomer() {
    let dni = this.searchCustomerForm.value.dni!!;
    if (dni === '0') {
      dni = '00000000';
    }
    this.customerService.getCustomerByDni(dni).subscribe({
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
    this.productService.getProductsPaginatedInStock(this.currentPage).subscribe({
      next: (response => {
        this.products = response.data;
        this.totalItems = response.total;
        this.lastPage = response.last_page;
        this.hidePagination = false;
        this.loading = false;
      }),
      error: (error) => {
        this.hidePagination = true;
        this.loadError = true;
        this.loading = false;
      }
    });
  }

  fetchProductById(id: number) {
    this.loading = true;
    this.hidePagination = true;
    this.products.length = 0;
    this.productService.getProductByIdInStock(id).subscribe({
      next: response => {
        this.products.length = 0;
        this.products.push(response);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  fetchProductsByName(name: string) {
    this.loading = true;
    this.hidePagination = true;
    this.products.length = 0;
    this.productService.getProductsByNameInStock(name).subscribe({
      next: response => {
        this.products = response;
        if (this.products.length <= 0) {
          this.searchError = true;
        }
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.searchError = true;
      }
    });
  }

  resetProductList() {
    this.totalItems = 0;
    this.currentPage = 1;
    this.pageSize = 10;
    this.lastPage = 1;
    this.searchProductForm.reset({
      searchType: 0,
      keyword: ''
    });
    this.hidePagination = true;
    this.fetchProducts();
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

  isReadyToSell() {
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

  reloadPage() {
    window.location.reload();
  }
}
