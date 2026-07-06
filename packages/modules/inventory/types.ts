export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number;
  reorderQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  location: string;
  address?: string;
  managerId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stock {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
  allocatedQuantity: number;
  availableQuantity: number;
  lastUpdated: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  warehouseId: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  reference?: string;
  reason: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  performedBy: string;
  performedAt: Date;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  items: TransferItem[];
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  requestedBy: string;
  requestedAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface TransferItem {
  productId: string;
  quantity: number;
  receivedQuantity?: number;
}

export interface StockCount {
  id: string;
  countNumber: string;
  warehouseId: string;
  items: CountItem[];
  status: 'draft' | 'in_progress' | 'completed' | 'verified';
  countedBy: string;
  countedAt: Date;
  verifiedBy?: string;
  verifiedAt?: Date;
  notes?: string;
}

export interface CountItem {
  productId: string;
  systemQuantity: number;
  countedQuantity: number;
  variance: number;
  reason?: string;
}
