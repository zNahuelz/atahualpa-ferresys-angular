import {Routes} from '@angular/router';
import {LoginComponent} from './components/shared/login/login.component';
import {DashboardComponent} from './components/shared/dashboard/dashboard.component';
import {loginGuard} from './guards/login.guard';
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
import {SaleModuleComponent} from './components/admin/sale-module/sale-module.component';
import {VoucherListComponent} from './components/admin/voucher/voucher-list/voucher-list.component';
import {VoucherDetailComponent} from './components/admin/voucher/voucher-detail/voucher-detail.component';
import {AccountListComponent} from './components/admin/account/account-list/account-list.component';
import {NewAccountComponent} from './components/admin/account/new-account/new-account.component';
import {ManagementLayoutComponent} from './layouts/management-layout/management-layout.component';
import {generalGuard} from './guards/general.guard';
import {UnauthorizedComponent} from './components/shared/unauthorized/unauthorized.component';
import {EditAccountComponent} from './components/admin/account/edit-account/edit-account.component';

export const routes: Routes = [
  {path: '', component: LoginComponent, title: "FERRETERIA ATAHUALPA - INICIO DE SESIÓN", canActivate: [loginGuard]},
  {
    path: 'd',
    component: ManagementLayoutComponent,
    title: "FERRETERIA ATAHUALPA - ???",
    canActivate: [generalGuard],
    data: {roles: ['ADMINISTRADOR','VENDEDOR']},
    children:
      [
        {path: '', component: DashboardComponent, title: 'FERRETERIA ATAHUALPA - DASHBOARD'},
        {path: 'product', component: ProductListComponent, title: "FERRETERIA ATAHUALPA - LISTADO DE PRODUCTOS"},
        {path: 'new-product', component: NewProductComponent, title: 'FERRETERIA ATAHUALPA - NUEVO PRODUCTO',data:{roles: ['ADMINISTRADOR']}},
        {path: 'edit-product/:id', component: EditProductComponent, title: 'FERRETERIA ATAHUALPA - GESTIONAR PRODUCTO'},
        {path: 'supplier', component: SupplierListComponent, title: 'FERRETERIA ATAHUALPA - LISTADO DE PROVEEDORES'},
        {path: 'new-supplier', component: NewSupplierComponent, title: 'FERRETERIA ATAHUALPA - NUEVO PROVEEDOR',data:{roles: ['ADMINISTRADOR']}},
        {path: 'edit-supplier/:id', component: EditSupplierComponent, title: 'FERRETERIA ATAHUALPA - GESTIONAR PROVEEDOR'},
        {path: 'unit-type-mgmt', component: UnitTypeManagementComponent, title: 'FERRETERIA ATAHUALPA - GESTIÓN DE PRESENTACIONES'},
        {path: 'customer', component: CustomerListComponent, title: 'FERRETERIA ATAHUALPA - LISTADO DE CLIENTES'},
        {path: 'new-customer', component: NewCustomerComponent, title: 'FERRETERIA ATAHUALPA - NUEVO CLIENTE'},
        {path: 'edit-customer/:id', component: EditCustomerComponent, title: 'FERRETERIA ATAHUALPA - GESTIONAR CLIENTE'},
        {path: 'sell-products', component: SaleModuleComponent, title: 'FERRETERIA ATAHUALPA - NUEVA VENTA'},
        {path: 'voucher', component: VoucherListComponent, title: 'FERRETERIA ATAHUALPA - COMPROBANTES DE PAGO'},
        {path: 'voucher/:id', component: VoucherDetailComponent, title: 'FERRETERIA ATAHUALPA - DETALLE DE COMPROBANTE'},
        {path: 'account', component: AccountListComponent, title: 'FERRETERIA ATAHUALPA - LISTADO DE CUENTAS DE USUARIO',data:{roles: ['ADMINISTRADOR']}},
        {path: 'new-account', component: NewAccountComponent, title: 'FERRETERIA ATAHUALPA - NUEVO USUARIO',data:{roles: ['ADMINISTRADOR']}},
        {path: 'edit-account/:id', component: EditAccountComponent, title: 'FERRETERIA ATAHUALPA - GESTIÓN DE CUENTAS DE USUARIO',data:{roles: ['ADMINISTRADOR']}},
        {path: 'profile', component: ProfileComponent, title: 'FERRETERIA ATAHUALPA - MI CUENTA'},
        {path: '401', component: UnauthorizedComponent, title: 'FERRETERIA ATAHUALPA - ACCESO RESTRINGIDO'},
      ]
  },
  {path: 'recover-account', component: RecoverAccountComponent, title: 'FERRETERIA ATAHUALPA - RECUPERAR CUENTA', canActivate: [loginGuard]},
  {path: '**', redirectTo: ''}
];
