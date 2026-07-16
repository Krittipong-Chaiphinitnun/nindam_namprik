import { useState, useEffect } from 'react';
import { Product } from '@/constants/products';

const PRODUCTS_API_URL =
  'https://raw.githubusercontent.com/Krittipong-Chaiphinitnun/nindam_namprik/refs/heads/main/product.json';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดสินค้า');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  const refetch = () => setTrigger(t => t + 1);

  return { products, loading, error, refetch };
}
