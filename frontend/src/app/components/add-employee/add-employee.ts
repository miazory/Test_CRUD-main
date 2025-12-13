import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee';
import { NotificationService } from '../../services/notification';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployeeComponent {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly groupOptions = computed(() => this.employeeService.getGroupOptions());
  groupSearch = '';

  readonly form = this.fb.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', Validators.required],
    basicSalary: [null as number | null, [Validators.required, Validators.min(0)]],
    status: ['Active', Validators.required],
    group: ['', Validators.required],
    description: ['', Validators.required],
  });

  get maxBirthDate(): string {
    return new Date().toISOString().slice(0, 16);
  }

  filteredGroups(): string[] {
    const term = this.groupSearch.trim().toLowerCase();
    return this.groupOptions().filter((g) => g.toLowerCase().includes(term));
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as Omit<Employee, 'id'>;
    const birthDate = value.birthDate as string;
    if (birthDate && new Date(birthDate) > new Date()) {
      this.notificationService.push('warning', 'Tanggal lahir tidak boleh melebihi hari ini.');
      return;
    }

    this.employeeService.addEmployee({
      ...value,
      birthDate,
      basicSalary: Number(value.basicSalary),
    });

    this.notificationService.push('success', 'Employee berhasil ditambahkan.');
    this.router.navigate(['/employees']);
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
