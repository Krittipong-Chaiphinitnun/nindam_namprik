import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Dimensions, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Product, ProductReview } from '@/constants/products';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/hooks/use-products';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { addToCart } = useCart();
  const { products, loading, error, refetch } = useProducts();
  const { user, isLoggedIn } = useAuth();

  const product = products.find(p => p.id === id);
  const [selectedWeight, setSelectedWeight] = useState(product?.weightOptions[0]?.label || '');
  const [quantity, setQuantity] = useState(1);

  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>([
    {
      id: 'rev1',
      username: 'คุณสมชาย สายแซ่บ',
      rating: 5,
      comment: 'หอมพริกคั่วมากครับ รสชาติจัดจ้าน ทานกับไข่ต้มอร่อยสุดๆ!',
      date: '2026-08-28',
    },
    {
      id: 'rev2',
      username: 'แม่ครัวเมืองเหนือ',
      rating: 5,
      comment: 'สูตรโบราณแท้ๆ รสชาติเหมือนที่คุณแม่ทำให้ทานตอนเด็กๆ เลยค่ะ',
      date: '2026-08-30',
    },
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleSubmitReview = () => {
    if (!isLoggedIn) {
      const msg = 'กรุณาเข้าสู่ระบบก่อนเขียนรีวิว';
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert('🔒 กรุณาเข้าสู่ระบบ', msg);
      router.push('/login' as any);
      return;
    }

    if (!newComment.trim()) {
      const msg = 'กรุณากรอกข้อความรีวิว';
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert('ข้อความเตือน', msg);
      return;
    }

    const newRev: ProductReview = {
      id: `rev_${Date.now()}`,
      username: user?.username || 'ผู้ใช้งาน',
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    setReviews(prev => [newRev, ...prev]);
    setNewComment('');
    setNewRating(5);

    const successMsg = 'ส่งรีวิวความแซ่บเรียบร้อยแล้ว ขอบคุณสำหรับคะแนนครับ! 🌶️';
    Platform.OS === 'web' ? window.alert(successMsg) : Alert.alert('✅ สำเร็จ', successMsg);
  };

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

  const basePrice = Number(product.price ?? (product as any).product_price ?? 0);
  const selectedOption = product.weightOptions?.find(o => o.label === selectedWeight) ||
    product.weightOptions?.[0] || { label: 'ขนาดมาตรฐาน', price: basePrice };
  const currentPrice = Number(selectedOption?.price ?? basePrice);

  const handleAddToCart = () => {
    if (!product || !product.id) {
      const errorMsg = 'ไม่พบข้อมูลสินค้าที่ต้องการเพิ่ม';
      Platform.OS === 'web' ? window.alert(errorMsg) : Alert.alert('❌ ผิดพลาด', errorMsg);
      return;
    }

    if (!isLoggedIn) {
      const alertMsg = 'กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ';
      if (Platform.OS === 'web') {
        window.alert(alertMsg);
      } else {
        Alert.alert('🔒 กรุณาเข้าสู่ระบบ', alertMsg);
      }
      router.push('/login' as any);
      return;
    }

    const weightToUse = selectedWeight || selectedOption.label || 'ขนาดมาตรฐาน';
    addToCart(product, quantity, weightToUse);
    const msg = `เพิ่ม "${product.thaiName || product.name || 'สินค้า'} (${weightToUse})" เข้าตะกร้าแล้ว!`;
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert('✅ สำเร็จ', msg);
    }
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
        {/* Product Image Container */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
        </View>

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
            {(product.weightOptions || []).map(option => {
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
            {(product.ingredients || []).map((ing, idx) => (
              <View key={idx} style={[styles.ingredientChip, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                <Text style={[styles.ingredientText, { color: themeColors.text }]}>{ing}</Text>
              </View>
            ))}
          </View>

          {/* Stock Status Badge */}
          <View style={styles.stockRow}>
            <Text style={[styles.stockLabel, { color: themeColors.icon }]}>จำนวนสินค้าคงเหลือในคลัง:</Text>
            <View style={[styles.stockBadge, { backgroundColor: (product.stock ?? 20) > 0 ? 'rgba(46, 125, 50, 0.1)' : 'rgba(255, 77, 77, 0.1)' }]}>
              <Text style={[styles.stockBadgeText, { color: (product.stock ?? 20) > 0 ? '#2E7D32' : '#FF4D4D' }]}>
                {(product.stock ?? 20) > 0 ? `📦 พร้อมส่ง ${product.stock} ชิ้น` : '❌ สินค้าหมดคลัง'}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          {/* Review & Rating Section */}
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            รีวิวความแซ่บ ({reviews.length + (product.reviewsCount || 0)})
          </Text>

          {/* Add Review Form for Logged In Users */}
          <View style={[styles.reviewFormCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <Text style={[styles.reviewFormTitle, { color: themeColors.text }]}>⭐ เขียนรีวิวและให้คะแนนดาว</Text>

            {/* Rating Star Picker */}
            <View style={styles.starSelectRow}>
              <Text style={[styles.metaText, { color: themeColors.icon }]}>ให้คะแนน:</Text>
              <View style={styles.starBtnsRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                    <IconSymbol
                      name="star.fill"
                      size={22}
                      color={star <= newRating ? '#FFB800' : themeColors.tabIconDefault}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Comment Input */}
            <TextInput
              style={[styles.reviewInput, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
              placeholder={isLoggedIn ? 'แบ่งปันความรู้สึกความแซ่บ...' : 'กรุณาเข้าสู่ระบบก่อนเขียนรีวิว...'}
              placeholderTextColor={themeColors.icon}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              numberOfLines={3}
              editable={isLoggedIn}
            />

            {/* Submit Review Button */}
            <TouchableOpacity
              style={[
                styles.submitReviewBtn,
                { backgroundColor: isLoggedIn ? themeColors.tint : themeColors.icon }
              ]}
              onPress={handleSubmitReview}>
              <IconSymbol name="paperplane.fill" size={14} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.submitReviewBtnText}>
                {isLoggedIn ? 'ส่งรีวิวความแซ่บ' : 'เข้าสู่ระบบเพื่อเขียนรีวิว'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reviews List */}
          <View style={styles.reviewsList}>
            {reviews.map(rev => (
              <View key={rev.id} style={[styles.reviewCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewUserCircle}>
                    <Text style={styles.reviewUserInitial}>{rev.username.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.reviewUsername, { color: themeColors.text }]}>{rev.username}</Text>
                    <Text style={[styles.reviewDate, { color: themeColors.icon }]}>{rev.date}</Text>
                  </View>
                  <View style={styles.reviewStarsRow}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <IconSymbol
                        key={star}
                        name="star.fill"
                        size={12}
                        color={star <= rev.rating ? '#FFB800' : themeColors.tabIconDefault}
                      />
                    ))}
                  </View>
                </View>
                <Text style={[styles.reviewComment, { color: themeColors.text }]}>{rev.comment}</Text>
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
          <TouchableOpacity
            style={[
              styles.addToCartBtn,
              { backgroundColor: (product.stock ?? 20) > 0 ? themeColors.tint : themeColors.icon }
            ]}
            onPress={handleAddToCart}
            disabled={(product.stock ?? 20) <= 0}>
            <IconSymbol name="cart.badge.plus" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.addToCartText}>
              {(product.stock ?? 20) > 0 ? `ใส่ตะกร้า • ฿${currentPrice * quantity}` : 'สินค้าหมดคลัง'}
            </Text>
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
  imageContainer: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 600,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  image: {
    width: '100%',
    height: 300,
    maxHeight: 350,
    borderRadius: 12,
    overflow: 'hidden',
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
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  stockLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewFormCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 16,
  },
  reviewFormTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  starSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  starBtnsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewInput: {
    height: 70,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 8,
    fontSize: 13,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  submitReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitReviewBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  reviewsList: {
    gap: 10,
  },
  reviewCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  reviewUserCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C92C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewUserInitial: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewUsername: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 11,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 13,
    lineHeight: 18,
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
