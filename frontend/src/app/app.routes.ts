import {Routes} from '@angular/router';
import {LoginComponent} from './components/shared/login/login.component';
import {DashboardComponent} from './components/shared/dashboard/dashboard.component';
import {adminGuard} from './guards/admin.guard';
import {loginGuard} from './guards/login.guard';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {ProductListComponent} from './components/admin/product/product-list/product-list.component';
import {NewProductComponent} from './components/admin/product/new-product/new-product.component';

export const routes: Routes = [
  {path: '', component: LoginComponent, title: "FERRETERIA ATAHUALPA - INICIO DE SESIÓN", canActivate: [loginGuard]},
  {
    path: 'd',
    component: AdminLayoutComponent,
    title: "FERRETERIA ATAHUALPA - ???",
    canActivate: [adminGuard],
    children:
      [
        {path: '', component: DashboardComponent, title: "FERRETERIA ATAHUALPA - DASHBOARD"},
        {path: 'product', component: ProductListComponent, title: "FERRETERIA ATAHUALPA - LISTADO DE PRODUCTOS"},
        {path: 'new-product', component: NewProductComponent, title: 'FERRETERIA ATAHUALPA - NUEVO PRODUCTO'},
      ]
  },
  {path: '**', redirectTo: ''}
];
