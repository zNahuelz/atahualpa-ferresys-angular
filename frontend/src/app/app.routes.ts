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
import {UnitTypeListComponent} from './components/admin/unit-type/unit-type-list/unit-type-list.component';
import {NewUnitTypeComponent} from './components/admin/unit-type/new-unit-type/new-unit-type.component';
import {EditUnitTypeComponent} from './components/admin/unit-type/edit-unit-type/edit-unit-type.component';
import {
  UnitTypeManagementComponent
} from './components/admin/unit-type/unit-type-management/unit-type-management.component';

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
        {path: 'unit-type', component: UnitTypeListComponent, title: 'FERRETERIA ATAHUALPA - LISTADO DE PRESENTACIONES'},
        {path: 'new-unit-type', component: NewUnitTypeComponent, title: 'FERRETERIA ATAHUALPA - NUEVA PRESENTACIÓN'},
        {path: 'edit-unit-type/:id', component: EditUnitTypeComponent, title: 'FERRETERIA ATAHUALPA - GESTIONAR PRESENTACIÓN'},
        {path: 'unit-type-mgmt', component: UnitTypeManagementComponent, title: 'FERRETERIA ATAHUALPA - GESTIÓN DE PRESENTACIONES'},
        {path: 'profile', component: ProfileComponent, title: 'FERRETERIA ATAHUALPA - MI CUENTA'},
      ]
  },
  {path: '**', redirectTo: ''}
];
