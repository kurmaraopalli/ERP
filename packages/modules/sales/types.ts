export interface Customer {
  id: string;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
  taxId?: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: string;
  salesRepId?: string;
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

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  orderDate: Date;
  requiredDate: Date;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  status: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: Address;
  billingAddress?: Address;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  amount: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customerId: string;
  validUntil: Date;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  id: string;
  title: string;
  customerId: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expectedCloseDate: Date;
  assignedTo: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task';
  customerId?: string;
  opportunityId?: string;
  subject: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: Date;
  completedDate?: Date;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}
