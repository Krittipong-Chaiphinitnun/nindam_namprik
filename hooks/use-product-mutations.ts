import { useState } from 'react';

const BASE_URL = 'http://119.59.102.161:3006/api/products';

export interface ProductPayload {
  id?: string;
  name: string;
  thai_name: string;
  price: number;
  category: 'dry' | 'wet' | 'crispy' | 'mild';
  description: string;
  long_description: string;
  spicy_level: number;
  rating?: number;
  reviews_count?: number;
  image: string;
  ingredients?: string[];
  weight_options?: { label: string; price: number }[];
}

interface MutationState {
  loading: boolean;
  error: string | null;
}

export function useProductMutations() {
  const [state, setState] = useState<MutationState>({ loading: false, error: null });

  const run = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setState({ loading: true, error: null });
    try {
      const result = await fn();
      setState({ loading: false, error: null });
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
      console.error('[useProductMutations] Error:', err);
      setState({ loading: false, error: msg });
      return null;
    }
  };

  /** POST /api/products */
  const createProduct = (data: ProductPayload) =>
    run(async () => {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`สร้างสินค้าไม่สำเร็จ (${res.status})`);
      return res.json();
    });

  /** PUT /api/products/:id */
  const updateProduct = (id: string, data: Partial<ProductPayload>) =>
    run(async () => {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`แก้ไขสินค้าไม่สำเร็จ (${res.status})`);
      return res.json();
    });

  /** DELETE /api/products/:id */
  const deleteProduct = async (id: string) => {
    setState({ loading: true, error: null });
    console.log('Payload for DELETE:', id);
    try {
      const res = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, { 
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        const msg = `ลบไม่สำเร็จ HTTP ${res.status}: ${errText}`;
        console.error(`[DELETE] Server error: ${msg}`);
        setState({ loading: false, error: msg });
        return { error: msg };
      }
      
      setState({ loading: false, error: null });
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
      console.error('[DELETE] Exception:', err);
      setState({ loading: false, error: msg });
      return { error: msg };
    }
  };

  return {
    loading: state.loading,
    error: state.error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
