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
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

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
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);
  products: Product[] = [];
  loading = false;
  loadError = false;
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  lastPage = 1;
  dataSource = new MatTableDataSource<Product>();

  searchForm = new FormGroup({
    keyword: new FormControl(''),
  });


  displayedColumns = [
    'id', 'name', 'buy_price', 'sell_price', 'stock', 'unit_type', 'supplier'
  ]

  ngOnInit() {
    this.fetchProducts();
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

  getProductsByName(name: string){
    this.loading = true;
    this.productService.getProductsByName(name).subscribe({
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
    })
  }

  searchByName(){
    this.getProductsByName(this.searchForm.value.keyword!!);
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

  isLastPage(){
    return this.currentPage === this.lastPage;
  }
  isFirstPage(){
    return this.currentPage === 1;
  }
}
