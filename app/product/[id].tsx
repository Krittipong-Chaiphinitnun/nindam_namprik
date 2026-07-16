import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, SafeAreaView, Dimensions, Platform, ActivityIndicator } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Product } from '@/constants/products';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/hooks/use-products';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { addToCart } = useCart();
  const { products, loading, error, refetch } = useProducts();

  const product = products.find(p => p.id === id);
  const [selectedWeight, setSelectedWeight] = useState(product?.weightOptions[0]?.label || '');
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.notFound}>
          <ActivityIndicator size="large" color={themeColors.tint} />
          <Text style={{ color: themeColors.icon, fontSize: 16 }}>กำลังโหลดข้อมูลสินค้า...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.notFound}>
          <IconSymbol name="wifi.slash" size={48} color={themeColors.icon} />
          <Text style={{ color: themeColors.text, fontSize: 18 }}>โหลดข้อมูลไม่สำเร็จ</Text>
          <TouchableOpacity style={styles.backBtn} onPress={refetch}>
            <Text style={{ color: '#fff' }}>ลองใหม่อีกครั้ง</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.notFound}>
          <Text style={{ color: themeColors.text, fontSize: 18 }}>ไม่พบสินค้าที่คุณต้องการ</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={{ color: '#fff' }}>ย้อนกลับ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const selectedOption = product.weightOptions.find(o => o.label === selectedWeight) || product.weightOptions[0];
  const currentPrice = selectedOption.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedWeight);
    alert(`เพิ่ม "${product.thaiName} (${selectedWeight})" เข้าตะกร้าแล้ว!`);
  };

  const renderSpiceLevel = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <IconSymbol
          key={i}
          name="flame.fill"
          size={20}
          color={i <= product.spicyLevel ? '#FF4D4D' : themeColors.tabIconDefault}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={styles.spiceRow}>{stars}</View>;
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Custom Header with Back Button */}
      <SafeAreaView style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: themeColors.card }]} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={themeColors.tint} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>{product.thaiName}</Text>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: themeColors.card }]} onPress={() => router.push('/(tabs)/cart' as any)}>
          <IconSymbol name="cart.fill" size={20} color={themeColors.tint} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Product Image */}
        <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />

        <View style={styles.detailsContainer}>
          {/* Title & Thai Name */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: themeColors.text }]}>{product.thaiName}</Text>
              <Text style={[styles.subtitle, { color: themeColors.icon }]}>{product.name}</Text>
            </View>
            <View style={[styles.priceTag, { backgroundColor: themeColors.tint }]}>
              <Text style={styles.priceTagText}>฿{currentPrice}</Text>
            </View>
          </View>

          {/* Rating and Reviews */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <IconSymbol name="star.fill" size={16} color="#FFB800" style={{ marginRight: 4 }} />
              <Text style={[styles.metaText, { color: themeColors.text, fontWeight: 'bold' }]}>
                {product.rating}
              </Text>
              <Text style={[styles.metaText, { color: themeColors.icon }]}>
                {' '}
                ({product.reviewsCount} รีวิว)
              </Text>
            </View>

            <View style={styles.spiceContainer}>
              <Text style={[styles.metaText, { color: themeColors.icon, marginRight: 6 }]}>ความเผ็ด:</Text>
              {renderSpiceLevel()}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          {/* Description */}
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>รายละเอียดความแซ่บ</Text>
          <Text style={[styles.description, { color: themeColors.icon }]}>{product.longDescription}</Text>

          {/* Sizing Selector */}
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginTop: 20 }]}>เลือกขนาดกระปุก</Text>
          <View style={styles.weightRow}>
            {product.weightOptions.map(option => {
              const isSelected = selectedWeight === option.label;
              return (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.weightCard,
                    {
                      backgroundColor: isSelected ? themeColors.tint : themeColors.card,
                      borderColor: isSelected ? themeColors.tint : themeColors.border,
                    },
                  ]}
                  onPress={() => setSelectedWeight(option.label)}>
                  <Text style={[styles.weightLabel, { color: isSelected ? '#fff' : themeColors.text }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.weightPrice, { color: isSelected ? 'rgba(255,255,255,0.85)' : themeColors.icon }]}>
                    ฿{option.price}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Ingredients */}
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginTop: 20 }]}>ส่วนประกอบสำคัญ</Text>
          <View style={styles.ingredientsRow}>
            {product.ingredients.map((ing, idx) => (
              <View key={idx} style={[styles.ingredientChip, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                <Text style={[styles.ingredientText, { color: themeColors.text }]}>{ing}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer / Buy Bar */}
      <SafeAreaView style={[styles.footer, { backgroundColor: themeColors.card, borderTopColor: themeColors.border }]}>
        <View style={styles.footerRow}>
          {/* Quantity Selector */}
          <View style={[styles.qtySelector, { borderColor: themeColors.border }]}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}>
              <IconSymbol name="minus.circle.fill" size={24} color={quantity <= 1 ? themeColors.icon : themeColors.tint} />
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: themeColors.text }]}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(q => q + 1)}>
              <IconSymbol name="plus.circle.fill" size={24} color={themeColors.tint} />
            </TouchableOpacity>
          </View>

          {/* Add To Cart */}
          <TouchableOpacity style={[styles.addToCartBtn, { backgroundColor: themeColors.tint }]} onPress={handleAddToCart}>
            <IconSymbol name="cart.badge.plus" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.addToCartText}>ใส่ตะกร้า • ฿{currentPrice * quantity}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#C92C2C',
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 40,
    borderBottomWidth: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  image: {
    width: width,
    height: width * 0.8,
  },
  detailsContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  priceTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  priceTagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
  },
  spiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spiceRow: {
    flexDirection: 'row',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  weightCard: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  weightPrice: {
    fontSize: 13,
  },
  ingredientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  ingredientChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 20,
  },
  ingredientText: {
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 8,
    height: 48,
  },
  qtyBtn: {
    padding: 4,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    textAlign: 'center',
    minWidth: 28,
  },
  addToCartBtn: {
    flex: 1,
    height: 48,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
