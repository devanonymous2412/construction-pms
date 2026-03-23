export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  supplier: string;
  orderDate: string;
  deliveryDate: string;
  status: MaterialStatus;
  location: string;
  notes?: string;
}

export interface MaterialStats {
  totalMaterials: number;
  totalCost: number;
  pendingOrders: number;
  deliveredOrders: number;
}

export type MaterialCategory = 
  | 'Steel'
  | 'Concrete'
  | 'Brick'
  | 'Sand'
  | 'Gravel'
  | 'Cement'
  | 'Wood'
  | 'Glass'
  | 'Insulation'
  | 'Other';

export type MaterialStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';
