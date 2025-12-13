import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-detail.html',
  styleUrl: './employee-detail.css',
})
export class EmployeeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);

  employee?: Employee;

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);
    this.employee = this.employeeService.getEmployee(id);

    if (!this.employee) {
      this.router.navigate(['/employees']);
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString('id-ID');
  }

  backToList(): void {
    this.router.navigate(['/employees']);
  }
}
