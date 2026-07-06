export interface Vendor {
  id: string;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
  taxId?: string;
  paymentTerms: string;
  creditLimit: number;
  currentBalance: number;
  rating: number;
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

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  orderDate: Date;
  requiredDate: Date;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'received' | 'cancelled';
  shippingAddress?: Address;
  notes?: string;
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  amount: number;
}

export interface PurchaseRequisition {
  id: string;
  requisitionNumber: string;
  departmentId: string;
  requestedBy: string;
  requestDate: Date;
  requiredDate: Date;
  items: RequisitionItem[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'ordered' | 'cancelled';
  reason: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequisitionItem {
  productId: string;
  quantity: number;
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high';
  reason?: string;
}

export interface VendorQuote {
  id: string;
  quoteNumber: string;
  vendorId: string;
  requisitionId?: string;
  validUntil: Date;
  items: QuoteItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'received' | 'reviewed' | 'accepted' | 'rejected';
  notes?: string;
  receivedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface QuoteItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  amount: number;
  leadTime?: number;
}

export interface GoodsReceipt {
  id: string;
  receiptNumber: string;
  purchaseOrderId: string;
  vendorId: string;
  warehouseId: string;
  receivedDate: Date;
  items: ReceiptItem[];
  status: 'draft' | 'partial' | 'completed' | 'cancelled';
  receivedBy: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReceiptItem {
  productId: string;
  orderedQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  unitCost: number;
  reason?: string;
}
