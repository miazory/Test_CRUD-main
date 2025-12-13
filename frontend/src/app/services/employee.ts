import { Injectable, computed, signal } from '@angular/core';
import { Employee } from '../models/employee';

export type SortKey = keyof Pick<Employee, 'username' | 'firstName' | 'lastName' | 'email' | 'basicSalary' | 'status' | 'group'>;
export type SortDirection = 'asc' | 'desc';

export interface EmployeeQueryState {
  searchTerm: string;
  status: '' | 'Active' | 'Inactive';
  page: number;
  pageSize: number;
  sortBy: SortKey;
  sortDirection: SortDirection;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly groups = [
    'Engineering',
    'Design',
    'Product',
    'Marketing',
    'Sales',
    'Support',
    'Finance',
    'HR',
    'Operations',
    'QA',
  ];

  private readonly employeesSignal = signal<Employee[]>(this.buildDummyEmployees());
  private readonly stateSignal = signal<EmployeeQueryState>({
    searchTerm: '',
    status: '',
    page: 1,
    pageSize: 10,
    sortBy: 'username',
    sortDirection: 'asc',
  });

  readonly state = computed(() => this.stateSignal());

  readonly pagedEmployees = computed(() => {
    const state = this.stateSignal();
    let items = [...this.employeesSignal()];

    if (state.searchTerm.trim()) {
      const term = state.searchTerm.toLowerCase();
      items = items.filter(
        (e) =>
          e.username.toLowerCase().includes(term) ||
          e.firstName.toLowerCase().includes(term) ||
          e.lastName.toLowerCase().includes(term) ||
          e.email.toLowerCase().includes(term)
      );
    }

    if (state.status) {
      items = items.filter((e) => e.status === state.status);
    }

    items.sort((a, b) => this.compare(a, b, state.sortBy, state.sortDirection));

    const total = items.length;
    const lastPage = Math.max(Math.ceil(total / state.pageSize), 1);
    const currentPage = Math.min(Math.max(state.page, 1), lastPage);
    const start = (currentPage - 1) * state.pageSize;
    const paged = items.slice(start, start + state.pageSize);

    return { total, items, page: currentPage, pageItems: paged };
  });

  getGroupOptions(): string[] {
    return [...this.groups];
  }

  getEmployee(id: number): Employee | undefined {
    return this.employeesSignal().find((e) => e.id === id);
  }

  addEmployee(newEmployee: Omit<Employee, 'id'>): Employee {
    const nextId = this.getNextId();
    const employee: Employee = { ...newEmployee, id: nextId };
    this.employeesSignal.update((list) => [...list, employee]);
    return employee;
  }

  setSearchTerm(term: string): void {
    this.stateSignal.update((s) => ({ ...s, searchTerm: term, page: 1 }));
  }

  setStatus(status: '' | 'Active' | 'Inactive'): void {
    this.stateSignal.update((s) => ({ ...s, status, page: 1 }));
  }

  setPage(page: number): void {
    this.stateSignal.update((s) => ({ ...s, page }));
  }

  setPageSize(size: number): void {
    this.stateSignal.update((s) => ({ ...s, pageSize: size, page: 1 }));
  }

  setSort(sortBy: SortKey): void {
    this.stateSignal.update((s) => {
      const direction: SortDirection =
        s.sortBy === sortBy ? (s.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
      return { ...s, sortBy, sortDirection: direction };
    });
  }

  resetPaging(): void {
    this.stateSignal.update((s) => ({ ...s, page: 1 }));
  }

  private getNextId(): number {
    const ids = this.employeesSignal().map((e) => e.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }

  private compare(a: Employee, b: Employee, key: SortKey, direction: SortDirection): number {
    const multiplier = direction === 'asc' ? 1 : -1;
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * multiplier;
    }

    return aValue.toString().localeCompare(bValue.toString()) * multiplier;
  }

  private buildDummyEmployees(): Employee[] {
    const statuses: Array<'Active' | 'Inactive'> = ['Active', 'Inactive'];
    const result: Employee[] = [];
    for (let i = 1; i <= 100; i++) {
      const group = this.groups[i % this.groups.length];
      const status = statuses[i % 2];
      result.push({
        id: i,
        username: `user${i}`,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        email: `user${i}@example.com`,
        birthDate: new Date(1990, (i % 12), (i % 28) + 1).toISOString(),
        basicSalary: 3000000 + i * 10000,
        status,
        group,
        description: `Employee number ${i} in ${group} group.`,
      });
    }
    return result;
  }
}
