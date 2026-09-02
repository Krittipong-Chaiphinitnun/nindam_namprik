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
  long_description?: string;
  spicy_level: number;
  rating?: string | number;
  reviews_count?: number;
  stock?: number;
  ingredients?: string[] | string;
  weight_options?: { label: string; price: number }[] | string;
  image: string;
}

interface ApiResponse {
  success: boolean;
  data: ApiProduct[];
}

/** Map API snake_case shape → app Product interface */
function mapApiProduct(item: ApiProduct): Product {
  let parsedIngredients: string[] = [];
  if (Array.isArray(item.ingredients)) {
    parsedIngredients = item.ingredients;
  } else if (typeof item.ingredients === 'string' && item.ingredients.trim()) {
    try {
      parsedIngredients = JSON.parse(item.ingredients);
    } catch {
      parsedIngredients = item.ingredients.split(',').map(s => s.trim());
    }
  }
  if (!parsedIngredients || parsedIngredients.length === 0) {
    parsedIngredients = ['พริกสด 40%', 'กระเทียมไทย 25%', 'หอมแดงจี่ 20%', 'เครื่องปรุงรส 15%'];
  }

  let parsedWeightOptions: { label: string; price: number }[] = [];
  if (Array.isArray(item.weight_options)) {
    parsedWeightOptions = item.weight_options;
  } else if (typeof item.weight_options === 'string' && item.weight_options.trim()) {
    try {
      parsedWeightOptions = JSON.parse(item.weight_options);
    } catch {
      parsedWeightOptions = [];
    }
  }
  const basePrice = Number(item.price || 0);
  if (!parsedWeightOptions || parsedWeightOptions.length === 0) {
    parsedWeightOptions = [
      { label: '150g', price: basePrice },
      { label: '300g', price: Math.round(basePrice * 1.8) || basePrice },
    ];
  }

  return {
    id: String(item.id),
    name: item.name || item.thai_name || 'Namprik',
    thaiName: item.thai_name || item.name || 'น้ำพริกคุณน้า',
    price: basePrice,
    category: item.category || 'wet',
    description: item.description || 'น้ำพริกสูตรเด็ด รสชาติเผ็ดแซ่บกลมกล่อม',
    longDescription:
      item.long_description ||
      item.description ||
      'น้ำพริกคุณน้าสูตรโบราณ คัดสรรวัตถุดิบคุณภาพสูงส่งตรงจากชุมชน เผ็ดแท้จากพริกสวน ไม่ใส่สารกันบูด คลุกข้าวสวยร้อนๆ อร่อยแซ่บลงตัวที่สุด',
    spicyLevel: Number(item.spicy_level ?? 3),
    rating: Number(item.rating ?? 4.8),
    reviewsCount: Number(item.reviews_count ?? 12),
    stock: Number(item.stock ?? 20),
    ingredients: parsedIngredients,
    weightOptions: parsedWeightOptions,
    image: item.image || 'https://aroifin.com/wp-content/uploads/2025/09/11092025-pork-crackling-chilli-paste-cover.webp',
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

