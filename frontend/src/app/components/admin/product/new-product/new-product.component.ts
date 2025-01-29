import {Component, inject} from '@angular/core';
import {ProductService} from '../../../../services/product.service';

@Component({
  selector: 'app-new-product',
  imports: [],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {
private productService = inject(ProductService);
loading = true;
suppliersLoaded = false;
unitTypesLoaded = false;

}
