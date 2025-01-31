import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {Product} from '../../../../models/product.model';
import {ProductService} from '../../../../services/product.service';
import {NotificationService} from '../../../../services/notification.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {PRODUCT_SEARCH_MODES as SEARCH_MODES} from '../../../../utils/app.constants';
import {UnitType} from '../../../../models/unit-type';
import {Supplier} from '../../../../models/supplier.model';
import {UnitTypeService} from '../../../../services/unit-type.service';
import {SupplierService} from '../../../../services/supplier.service';
import {allowIntegers} from '../../../../utils/app.helpers';
import {integersOnly} from '../../../../validators/custom-validators'


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
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  private productService = inject(ProductService);
  private supplierService = inject(SupplierService);
  private unitTypeService = inject(UnitTypeService);
  products: Product[] = [];
  unitTypes: UnitType[] = [];
  suppliers: Supplier[] = [];

  loading = false;
  loadError = false;
  searchCompleted = false;
  unitTypesLoaded = false;
  suppliersLoaded = false;

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
    'id', 'name', 'buy_price', 'sell_price', 'stock', 'unit_type', 'supplier','toolbox'
  ]

  searchForm = new FormGroup({
    keyword: new FormControl('', [Validators.required,Validators.minLength(1),integersOnly()]),
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
        this.loading = true;
        this.loadError = true;
        console.log(error);
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

  handleSearchType(val: number) {
    const keywordControl = this.searchForm.get('keyword');
    const suppliersControl = this.searchForm.get('selectedSupplier');
    const unitTypeControl = this.searchForm.get('selectedUnitType');
    switch (val) {
      case 0:
        console.log('POR ID')
        this.keywordHidden = false;
        this.unitTypesHidden = true;
        this.suppliersHidden = true;
        keywordControl?.setValidators([Validators.required,Validators.minLength(1),integersOnly()]);
        suppliersControl?.clearValidators();
        unitTypeControl?.clearValidators();
        keywordControl?.reset();
        //TODO: RESET SELECTS ON CHANGE TOO!
        break;
      case 1:
        console.log('POR NOMBRE')
        this.keywordHidden = false;
        this.unitTypesHidden = true;
        this.suppliersHidden = true;
        keywordControl?.setValidators([Validators.required,Validators.minLength(3)]);
        suppliersControl?.clearValidators();
        unitTypeControl?.clearValidators();
        keywordControl?.reset();
        break;
      case 2:
        console.log('POR PROVEEDOR')
        this.keywordHidden = true;
        this.unitTypesHidden = true;
        this.suppliersHidden = false;
        keywordControl?.clearValidators();
        unitTypeControl?.clearValidators();
        suppliersControl?.setValidators([Validators.required]);
        keywordControl?.reset();
        break;
      case 3:
        console.log('POR PRESENTACION')
        this.keywordHidden = true;
        this.unitTypesHidden = false;
        this.suppliersHidden = true;
        keywordControl?.clearValidators();
        suppliersControl?.clearValidators();
        unitTypeControl?.setValidators([Validators.required]);
        keywordControl?.reset();
        break;
      default:
        break;
    }
    keywordControl?.updateValueAndValidity();
    suppliersControl?.updateValueAndValidity();
    unitTypeControl?.updateValueAndValidity();
  }

  handleKeywordKeydown(e: KeyboardEvent,searchType: number) {
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

//TODO: CONTINUE HERE (MAYBE)!!
  searchProducts() {
    switch (this.searchForm.value.searchType) {
      case 0:
        console.log('POR ID')
        break;
      case 1:
        console.log('POR NOMBRE')
        break;
      case 2:
        console.log('POR PROVEEDOR')
        break;
      case 3:
        console.log('POR PRESENTACION')
        break;
      default:
        break;
    }
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

  reloadPage(){
    window.location.reload();
  }
}
