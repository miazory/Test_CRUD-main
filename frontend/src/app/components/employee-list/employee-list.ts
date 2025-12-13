import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeListComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly state = computed(() => this.employeeService.state());
  readonly view = computed(() => this.employeeService.pagedEmployees());

  searchTerm = this.state().searchTerm;
  status = this.state().status;

  get totalPages(): number {
    return Math.max(Math.ceil(this.view().total / this.state().pageSize), 1);
  }

  get currentPage(): number {
    return this.view().page;
  }

  trackById(index: number, item: Employee): number {
    return item.id;
  }

  changePage(page: number): void {
    const total = this.totalPages;
    const target = Math.min(Math.max(page, 1), total);
    this.employeeService.setPage(target);
  }

  changePageSize(size: number): void {
    this.employeeService.setPageSize(size);
  }

  sortBy(key: any): void {
    this.employeeService.setSort(key);
  }

  applySearch(): void {
    this.employeeService.setSearchTerm(this.searchTerm);
    this.employeeService.setStatus(this.status);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.status = '';
    this.applySearch();
  }

  goToAdd(): void {
    this.router.navigate(['/employees/add']);
  }

  goToDetail(employee: Employee): void {
    this.router.navigate(['/employees', employee.id]);
  }

  triggerEdit(): void {
    this.notificationService.push('warning', 'Edit diklik (dummy).');
  }

  triggerDelete(): void {
    this.notificationService.push('danger', 'Delete diklik (dummy).');
  }
}
