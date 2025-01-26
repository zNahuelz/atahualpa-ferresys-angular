import { Routes } from '@angular/router';
import { LoginComponent } from './components/shared/login/login.component';
import { DashboardComponent } from './components/shared/dashboard/dashboard.component';
import { adminGuard } from './guards/admin.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent, title: "FERRETERIA ATAHUALPA - INICIO DE SESIÓN", canActivate: [loginGuard] },
    { path: 'd', component: DashboardComponent, title: "FERRETERIA ATAHUALPA - DASHBOARD", canActivate: [adminGuard]},
    { path: '**', redirectTo: '' }
];
