import { useState, useEffect } from 'react';
import { Product } from '@/constants/products';

const PRODUCTS_API_URL = 'http://119.59.102.161:3006/api/products';

// Shape of each item returned by the API (snake_case fields)
interface ApiProduct {
  id: string;
  name: string;
  thai_name: string;
  price: string | number;
  category: 'dry' | 'wet' | 'crispy' | 'mild';
  description: string;
  long_description: string;
  spicy_level: number;
  rating: string | number;
  reviews_count: number;
  ingredients?: string[];
  weight_options?: { label: string; price: number }[];
  image: string;
}

interface ApiResponse {
  success: boolean;
  data: ApiProduct[];
}

/** Map API snake_case shape → app Product interface */
function mapApiProduct(item: ApiProduct): Product {
  return {
    id: item.id,
    name: item.name,
    thaiName: item.thai_name,
    price: Number(item.price),
    category: item.category,
    description: item.description,
    longDescription: item.long_description,
    spicyLevel: item.spicy_level,
    rating: Number(item.rating),
    reviewsCount: item.reviews_count,
    ingredients: item.ingredients ?? [],
    weightOptions: item.weight_options ?? [],
    image: item.image,
  };
}

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
        const response = await fetch(PRODUCTS_API_URL, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: ApiResponse = await response.json();
        if (!json.success) {
          throw new Error('API returned success: false');
        }
        const mapped = json.data.map(mapApiProduct);
        if (!cancelled) {
          setProducts(mapped);
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

