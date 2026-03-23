import { Material, MaterialStats } from './types';
import { v4 as uuidv4 } from 'uuid';

const CSV_FILE = 'materials.csv';

async function readCSV(): Promise<Material[]> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', CSV_FILE);
    
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    
    if (lines.length <= 1) {
      return [];
    }
    
    const headers = lines[0].split(',');
    const materials: Material[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= 12) {
        materials.push({
          id: values[0],
          name: values[1],
          category: values[2],
          quantity: parseFloat(values[3]),
          unit: values[4],
          unitPrice: parseFloat(values[5]),
          totalCost: parseFloat(values[6]),
          supplier: values[7],
          orderDate: values[8],
          deliveryDate: values[9],
          status: values[10] as Material['status'],
          location: values[11],
          notes: values[12] || ''
        });
      }
    }
    
    return materials;
  } catch (error) {
    console.error('Error reading CSV:', error);
    return [];
  }
}

async function writeCSV(materials: Material[]): Promise<void> {
  const fs = await import('fs');
  const path = await import('path');
  
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
  
  const filePath = path.join(dir, CSV_FILE);
  
  const header = 'id,name,category,quantity,unit,unitPrice,totalCost,supplier,orderDate,deliveryDate,status,location,notes';
  const rows = materials.map(m => 
    `${m.id},${m.name},${m.category},${m.quantity},${m.unit},${m.unitPrice},${m.totalCost},${m.supplier},${m.orderDate},${m.deliveryDate},${m.status},${m.location},${m.notes || ''}`
  );
  
  const content = [header, ...rows].join('\n');
  await fs.promises.writeFile(filePath, content, 'utf-8');
}

export async function getAllMaterials(): Promise<Material[]> {
  return await readCSV();
}

export async function getMaterialById(id: string): Promise<Material | null> {
  const materials = await readCSV();
  return materials.find(m => m.id === id) || null;
}

export async function createMaterial(data: Omit<Material, 'id' | 'totalCost'>): Promise<Material> {
  const materials = await readCSV();
  
  const newMaterial: Material = {
    ...data,
    id: uuidv4(),
    totalCost: data.quantity * data.unitPrice
  };
  
  materials.push(newMaterial);
  await writeCSV(materials);
  
  return newMaterial;
}

export async function updateMaterial(id: string, data: Partial<Material>): Promise<Material | null> {
  const materials = await readCSV();
  const index = materials.findIndex(m => m.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updated = { ...materials[index], ...data };
  if (updated.quantity && updated.unitPrice) {
    updated.totalCost = updated.quantity * updated.unitPrice;
  }
  
  materials[index] = updated;
  await writeCSV(materials);
  
  return updated;
}

export async function deleteMaterial(id: string): Promise<boolean> {
  const materials = await readCSV();
  const filtered = materials.filter(m => m.id !== id);
  
  if (filtered.length === materials.length) {
    return false;
  }
  
  await writeCSV(filtered);
  return true;
}

export async function getMaterialStats(): Promise<MaterialStats> {
  const materials = await readCSV();
  
  return {
    totalMaterials: materials.length,
    totalCost: materials.reduce((sum, m) => sum + m.totalCost, 0),
    pendingOrders: materials.filter(m => m.status === 'pending').length,
    deliveredOrders: materials.filter(m => m.status === 'delivered').length
  };
}