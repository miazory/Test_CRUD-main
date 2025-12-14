import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { LoginComponent } from './components/login/login';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { AddEmployeeComponent } from './components/add-employee/add-employee';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', pathMatch: 'full', redirectTo: 'employees' },
  { path: 'employees', component: EmployeeListComponent, canActivate: [authGuard] },
  { path: 'employees/add', component: AddEmployeeComponent, canActivate: [authGuard] },
  { path: 'employees/edit/:id', component: AddEmployeeComponent, canActivate: [authGuard] },
  { path: 'employees/:id', component: EmployeeDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'employees' },
];
