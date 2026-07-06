export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: Address;
  departmentId: string;
  positionId: string;
  managerId?: string;
  hireDate: Date;
  terminationDate?: Date;
  employmentStatus: 'active' | 'on_leave' | 'terminated' | 'resigned';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  salary: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  managerId?: string;
  parentId?: string;
  location?: string;
  budget?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: string;
  code: string;
  title: string;
  description?: string;
  departmentId: string;
  minSalary: number;
  maxSalary: number;
  requirements?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payroll {
  id: string;
  payrollNumber: string;
  employeeId: string;
  payPeriod: {
    startDate: Date;
    endDate: Date;
  };
  grossPay: number;
  deductions: Deduction[];
  netPay: number;
  status: 'draft' | 'calculated' | 'approved' | 'paid' | 'cancelled';
  payDate?: Date;
  paymentMethod: 'bank_transfer' | 'check' | 'cash';
  processedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deduction {
  type: 'tax' | 'insurance' | 'retirement' | 'other';
  description: string;
  amount: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid';
  startDate: Date;
  endDate: Date;
  days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  year: number;
  annual: number;
  annualUsed: number;
  sick: number;
  sickUsed: number;
  personal: number;
  personalUsed: number;
  updatedAt: Date;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: Date;
  projectCode?: string;
  task?: string;
  hours: number;
  type: 'regular' | 'overtime' | 'sick' | 'vacation' | 'holiday';
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewPeriod: {
    startDate: Date;
    endDate: Date;
  };
  rating: number;
  strengths?: string[];
  improvements?: string[];
  goals?: string[];
  comments?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'completed';
  reviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Training {
  id: string;
  title: string;
  description?: string;
  type: 'internal' | 'external' | 'online';
  startDate: Date;
  endDate: Date;
  location?: string;
  instructor?: string;
  cost: number;
  capacity: number;
  enrolled: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingEnrollment {
  id: string;
  trainingId: string;
  employeeId: string;
  enrollmentDate: Date;
  status: 'enrolled' | 'completed' | 'dropped' | 'cancelled';
  completionDate?: Date;
  score?: number;
  certificate?: string;
}
