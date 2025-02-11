import {Routes} from '@angular/router';
import {LoginComponent} from './components/shared/login/login.component';
import {DashboardComponent} from './components/shared/dashboard/dashboard.component';
import {adminGuard} from './guards/admin.guard';
import {loginGuard} from './guards/login.guard';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {ProductListComponent} from './components/admin/product/product-list/product-list.component';
import {NewProductComponent} from './components/admin/product/new-product/new-product.component';
import {EditProductComponent} from './components/admin/product/edit-product/edit-product.component';
import {SupplierListComponent} from './components/admin/supplier/supplier-list/supplier-list.component';
import {EditSupplierComponent} from './components/admin/supplier/edit-supplier/edit-supplier.component';
import {NewSupplierComponent} from './components/admin/supplier/new-supplier/new-supplier.component';
import {ProfileComponent} from './components/shared/profile/profile.component';
import {
  UnitTypeManagementComponent
} from './components/admin/unit-type/unit-type-management/unit-type-management.component';
import {CustomerListComponent} from './components/admin/customer/customer-list/customer-list.component';
import {NewCustomerComponent} from './components/admin/customer/new-customer/new-customer.component';
import {EditCustomerComponent} from './components/admin/customer/edit-customer/edit-customer.component';
import {RecoverAccountComponent} from './components/shared/recover-account/recover-account.component';
import {SellModuleComponent} from './components/admin/sell-module/sell-module.component';

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
        {path: 'edit-product/:id', component: EditProductComponent, title: 'FERRETERIA ATAHUALPA - GESTIONAR PRODUCTO'},
        {path: 'supplier', component: SupplierListComponent, title: 'FERRETERIA ATAHUALPA - LISTADO DE PROVEEDORES'},
        {path: 'new-supplier', component: NewSupplierComponent, title: 'FERRETERIA ATAHUALPA - NUEVO PROVEEDOR'},
        {path: 'edit-supplier/:id', component: EditSupplierComponent, title: 'FERRETERIA ATAHUALPA - GESTIONAR PROVEEDOR'},
        {path: 'unit-type-mgmt', component: UnitTypeManagementComponent, title: 'FERRETERIA ATAHUALPA - GESTIÓN DE PRESENTACIONES'},
        {path: 'customer', component: CustomerListComponent, title: 'FERRETERIA ATAHUALPA - LISTADO DE CLIENTES'},
        {path: 'new-customer', component: NewCustomerComponent, title: 'FERRETERIA ATAHUALPA - NUEVO CLIENTE'},
        {path: 'edit-customer/:id', component: EditCustomerComponent, title: 'FERRETERIA ATAHUALPA - GESTIONAR CLIENTE'},
        {path: 'sell-products', component: SellModuleComponent, title: 'FERRETERIA ATAHUALPA - NUEVA VENTA'},
        {path: 'profile', component: ProfileComponent, title: 'FERRETERIA ATAHUALPA - MI CUENTA'},
      ]
  },
  {path: 'recover-account', component: RecoverAccountComponent, title: 'FERRETERIA ATAHUALPA - RECUPERAR CUENTA', canActivate: [loginGuard]},
  {path: '**', redirectTo: ''}
];
