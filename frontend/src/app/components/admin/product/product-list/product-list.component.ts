import {Component, inject} from '@angular/core';
import {Product} from '../../../../models/product.model';
import {ProductService} from '../../../../services/product.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {PRODUCT_SEARCH_MODES as SEARCH_MODES} from '../../../../utils/app.constants';
import {UnitType} from '../../../../models/unit-type.model';
import {Supplier} from '../../../../models/supplier.model';
import {UnitTypeService} from '../../../../services/unit-type.service';
import {SupplierService} from '../../../../services/supplier.service';
import {integersOnlyValidator} from '../../../../validators/custom-validators'
import {MatDialog} from '@angular/material/dialog';
import {ProductDetailDialogComponent} from '../product-detail-dialog/product-detail-dialog.component';
import Swal from 'sweetalert2';
import {ERROR_MESSAGES as em, SUCCESS_MESSAGES as sm} from '../../../../utils/app.constants';
import {RouterModule} from '@angular/router';
import {AuthService} from '../../../../services/auth.service';


@Component({
  selector: 'app-product-list',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  private productService = inject(ProductService);
  private supplierService = inject(SupplierService);
  private unitTypeService = inject(UnitTypeService);
  protected authService = inject(AuthService);
  private dialog = inject(MatDialog);
  products: Product[] = [];
  unitTypes: UnitType[] = [];
  suppliers: Supplier[] = [];

  loading = false;
  loadError = false;
  hidePagination = false;
  unitTypesLoaded = false;
  suppliersLoaded = false;
  searchFailed = false;

  unitTypesHidden = true;
  suppliersHidden = true;
  keywordHidden = false;

  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  lastPage = 1;
  dataSource = new MatTableDataSource<Product>();
  protected readonly SEARCH_MODES = SEARCH_MODES;
  displayedColumns = [
    'id', 'name', 'buy_price', 'sell_price', 'stock', 'unit_type', 'supplier', 'toolbox'
  ]

  searchForm = new FormGroup({
    keyword: new FormControl('', [Validators.required, Validators.minLength(1), integersOnlyValidator()]),
    searchType: new FormControl(0, [Validators.required]),
    selectedSupplier: new FormControl(null, []),
    selectedUnitType: new FormControl(null, []),
  });


  ngOnInit() {
    this.fetchProducts();
    this.fetchUnitTypes();
    this.fetchSuppliers();
    this.searchForm.get('searchType')?.valueChanges.subscribe((val) => {
      this.handleSearchType(val!!);
    })
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getProductsPaginated(this.currentPage).subscribe({
      next: (response => {
        this.products = response.data;
        this.dataSource = new MatTableDataSource<Product>(this.products);
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

  fetchUnitTypes() {
    this.unitTypeService.getUnitTypes().subscribe({
      next: response => {
        this.unitTypes = response;
        if (this.unitTypes.length > 0) {
          this.unitTypesLoaded = true;
        }
      },
      error: error => {
        this.unitTypesLoaded = false;
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
      },
      error: error => {
        this.suppliersLoaded = false;
      }
    })
  }

  handleSearchType(val: number) {
    const keywordControl = this.searchForm.get('keyword');
    const suppliersControl = this.searchForm.get('selectedSupplier');
    const unitTypeControl = this.searchForm.get('selectedUnitType');
    switch (val) {
      case 0:
        //By ID
        this.keywordHidden = false;
        this.unitTypesHidden = true;
        this.suppliersHidden = true;
        keywordControl?.setValidators([Validators.required, Validators.minLength(1), integersOnlyValidator()]);
        suppliersControl?.clearValidators();
        unitTypeControl?.clearValidators();
        keywordControl?.reset();
        suppliersControl?.reset();
        unitTypeControl?.reset();
        break;
      case 1:
        //By name
        this.keywordHidden = false;
        this.unitTypesHidden = true;
        this.suppliersHidden = true;
        keywordControl?.setValidators([Validators.required, Validators.minLength(3)]);
        suppliersControl?.clearValidators();
        unitTypeControl?.clearValidators();
        keywordControl?.reset();
        suppliersControl?.reset();
        unitTypeControl?.reset();
        break;
      case 2:
        //By Supplier
        if (this.suppliersLoaded) {
          this.keywordHidden = true;
          this.unitTypesHidden = true;
          this.suppliersHidden = false;
          keywordControl?.clearValidators();
          unitTypeControl?.clearValidators();
          suppliersControl?.setValidators([Validators.required]);
          keywordControl?.reset();
          suppliersControl?.reset();
          unitTypeControl?.reset();
        }
        break;
      case 3:
        //By Unit Type
        if (this.unitTypesLoaded) {
          this.keywordHidden = true;
          this.unitTypesHidden = false;
          this.suppliersHidden = true;
          keywordControl?.clearValidators();
          suppliersControl?.clearValidators();
          unitTypeControl?.setValidators([Validators.required]);
          keywordControl?.reset();
          suppliersControl?.reset();
          unitTypeControl?.reset();
        }
        break;
      default:
        break;
    }
    keywordControl?.updateValueAndValidity();
    suppliersControl?.updateValueAndValidity();
    unitTypeControl?.updateValueAndValidity();
  }

  handleKeywordKeydown(e: KeyboardEvent, searchType: number) {
    if (searchType === 0) {
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

  searchProducts() {
    const keywordControl = this.searchForm.get('keyword');
    const suppliersControl = this.searchForm.get('selectedSupplier');
    const unitTypeControl = this.searchForm.get('selectedUnitType');
    switch (this.searchForm.value.searchType) {
      case 0:
        this.fetchProductById(parseInt(keywordControl?.value!!));
        break;
      case 1:
        this.fetchProductsByName(keywordControl?.value!!);
        break;
      case 2:
        this.fetchProductsBySupplier(suppliersControl?.value!!);
        break;
      case 3:
        this.fetchProductsByUnitType(unitTypeControl?.value!!);
        break;
      default:
        break;
    }
  }

  fetchProductById(id: number) {
    this.productService.getProductById(id).subscribe({
      next: response => {
        this.showProductDetail(response);
      },
      error: error => {
        Swal.fire(em.PRODUCT_NOT_FOUND, `El producto de ID: ${id} no ha sido encontrado o no esta disponible.`, 'info');
      }
    });
  }

  fetchProductsByName(name: string) {
    this.loading = true;
    this.productService.getProductsByName(name).subscribe({
      next: response => {
        this.handleProductSearchResponse(response);
      },
      error: error => {
        this.handleProductSearchError();
      }
    });
  }

  fetchProductsBySupplier(supplierId: number) {
    this.loading = true;
    this.productService.getProductsBySupplier(supplierId).subscribe({
      next: response => {
        this.handleProductSearchResponse(response);
      },
      error: error => {
        this.handleProductSearchError();
      }
    })
  }

  fetchProductsByUnitType(unitTypeId: number) {
    this.loading = true;
    this.productService.getProductsByUnitType(unitTypeId).subscribe({
      next: response => {
        this.handleProductSearchResponse(response);
      },
      error: error => {
        this.handleProductSearchError();
      }
    })
  }

  handleProductSearchResponse(response: Product[]) {
    this.products = response;
    this.dataSource = new MatTableDataSource<Product>(this.products);
    if (this.products.length <= 0) {
      this.searchFailed = true;
      this.loading = false;
      this.hidePagination = true;
    } else {
      this.hidePagination = true;
      this.loading = false;
      this.searchFailed = false;
    }
  }

  handleProductSearchError() {
    this.loading = false;
    this.searchFailed = true;
    this.hidePagination = true;
    this.loadError = true;
  }

  showProductDetail(product: Product) {
    const dialogRef = this.dialog.open(ProductDetailDialogComponent, {
      width: '600px',
      height: '560px',
      data: product,
    });
  }

  showDeleteDialog(p: Product) {
    let text = `Usted esta a punto de eliminar el siguiente producto: ${p.name}`;
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
        this.deleteProduct(p.id!!);
      }
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: response => {
        Swal.fire(sm.SUCCESS_TAG, sm.PRODUCT_DELETED, 'success').then((r) => {
          if (r.isDismissed || r.dismiss || r.isConfirmed) {
            window.location.reload();
          }
        });
      },
      error: error => {
        Swal.fire(em.ERROR_TAG, em.PRODUCT_NOT_FOUND, 'error');
      }
    })
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
