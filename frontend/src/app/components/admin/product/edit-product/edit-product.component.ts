import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../services/product.service';
import {Product} from '../../../../models/product.model';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-edit-product',
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductService);
  router = inject(Router);
  product = new Product();
  loading = true;

  productId = this.activatedRoute.snapshot.paramMap.get('id');

  ngOnInit() {
    this.fetchProductById(parseInt(this.productId!!));
  }

  fetchProductById(id: number) {
    this.productService.getProductById(id).subscribe({
      next: response => {
        this.product = response;
        this.loading = false;
      },
      error: error => {
        this.loading = true;
        this.router.navigate(['/d/product'])
      }
    });
  }
}
