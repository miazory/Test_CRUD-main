export interface Employee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  basicSalary: number;
  status: 'Active' | 'Inactive';
  group: string;
  description: string;
}
