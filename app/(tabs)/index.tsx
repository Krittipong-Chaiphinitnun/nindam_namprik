import { IconSymbol } from '@/components/ui/icon-symbol';
import { Product } from '@/constants/products';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProducts } from '@/hooks/use-products';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { products, loading, error, refetch } = useProducts();

  const categories = [
    { id: 'all', name: 'ทั้งหมด', icon: 'bag.fill' },
    { id: 'wet', name: 'แบบเปียก', icon: 'flame.fill' },
    { id: 'dry', name: 'แบบแห้ง', icon: 'flame.fill' },
    { id: 'crispy', name: 'กากหมู/กรอบ', icon: 'star.fill' },
  ];

  const featuredProducts = products.slice(0, 3); // Top 3 featured items

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
      onPress={() => router.push(`/product/${item.id}` as any)}>
      <Image source={{ uri: item.image }} style={styles.productImage} contentFit="cover" />

      {/* Best Seller Badge */}
      {item.rating >= 4.9 && (
        <View style={[styles.badge, { backgroundColor: themeColors.tint }]}>
          <Text style={styles.badgeText}>ขายดี 🔥</Text>
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={[styles.productTitle, { color: themeColors.text }]} numberOfLines={1}>
          {item.thaiName}
        </Text>

        {/* Rating and Price */}
        <View style={styles.productMeta}>
          <View style={styles.ratingRow}>
            <IconSymbol name="star.fill" size={14} color="#FFB800" />
            <Text style={[styles.ratingText, { color: themeColors.text }]}>{item.rating}</Text>
          </View>
          <Text style={[styles.productPrice, { color: themeColors.tint }]}>฿{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={themeColors.tint} />
          <Text style={[styles.stateText, { color: themeColors.icon }]}>กำลังโหลดสินค้า...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.centerState}>
          <IconSymbol name="wifi.slash" size={48} color={themeColors.icon} />
          <Text style={[styles.stateText, { color: themeColors.text }]}>โหลดข้อมูลไม่สำเร็จ</Text>
          <Text style={[styles.stateSubText, { color: themeColors.icon }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: themeColors.tint }]} onPress={refetch}>
            <Text style={styles.retryBtnText}>ลองใหม่อีกครั้ง</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Top Welcome Bar */}
      <View style={styles.headerBar}>
        <View>
          <Text style={[styles.welcomeSub, { color: themeColors.icon }]}>สวัสดีความแซ่บ 👋</Text>
          <Text style={[styles.welcomeTitle, { color: themeColors.text }]}>น้ำพริกคุณน้าสูตรโบราณ</Text>
        </View>
        <TouchableOpacity style={[styles.cartIconBtn, { backgroundColor: themeColors.card }]} onPress={() => router.push('/(tabs)/cart' as any)}>
          <IconSymbol name="cart.fill" size={20} color={themeColors.tint} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Promo Hero Banner */}
        <View style={[styles.heroBanner, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={styles.heroTextContainer}>
            <Text style={[styles.heroTitle, { color: themeColors.tint }]}>อร่อยแซ่บทะลุพิกัด!</Text>
            <Text style={[styles.heroDesc, { color: themeColors.text }]}>
              รับส่วนลด 10% เมื่อใช้โค้ดกระตุ้นลิ้น
            </Text>
            <View style={styles.couponContainer}>
              <Text style={styles.couponLabel}>CODE:</Text>
              <Text style={[styles.couponCode, { color: themeColors.tint }]}>SPICY10</Text>
            </View>
          </View>
          <Image
            source={{ uri: 'https://aroifin.com/wp-content/uploads/2025/09/11092025-pork-crackling-chilli-paste-cover.webp' }}
            style={styles.heroImage}
            contentFit="cover"
          />
        </View>

        {/* Quick Categories */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>ประเภทน้ำพริก</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryBtn, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
              onPress={() => router.push({ pathname: '/(tabs)/products' as any, params: { category: cat.id } } as any)}>
              <View style={[styles.catIconCircle, { backgroundColor: 'rgba(201,44,44,0.08)' }]}>
                <IconSymbol name={cat.icon as any} size={18} color={themeColors.tint} />
              </View>
              <Text style={[styles.categoryLabel, { color: themeColors.text }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>น้ำพริกแนะนำห้ามพลาด</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/products' as any)}>
            <Text style={[styles.seeAllText, { color: themeColors.tint }]}>ดูทั้งหมด</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />

        {/* Brand Story Callout */}
        <View style={[styles.storyCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={styles.storyHeader}>
            <IconSymbol name="info.circle.fill" size={20} color={themeColors.tint} style={{ marginRight: 8 }} />
            <Text style={[styles.storyTitle, { color: themeColors.text }]}>กรรมวิธีการผลิตน้ำพริกคุณน้า</Text>
          </View>
          <Text style={[styles.storyContent, { color: themeColors.icon }]}>
            น้ำพริกของเราทุกกระปุกต้มเคี่ยว คั่วและโขลกด้วยฝีมือคุณน้าอย่างตั้งใจ
            คัดวัตถุดิบคุณภาพสูงส่งตรงจากฟาร์มชุมชน เผ็ดแท้จากพริกขี้หนูสวน ไม่ผสมสีและไม่ใส่สารกันบูด
            อร่อยปลอดภัยเหมือนคุณแม่ตำให้ทานที่บ้าน
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  stateText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stateSubText: {
    fontSize: 13,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 12,
  },
  welcomeSub: {
    fontSize: 13,
    fontWeight: '500',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 2,
  },
  cartIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  heroBanner: {
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 140,
  },
  heroTextContainer: {
    flex: 1.2,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  couponLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8F7E78',
  },
  couponCode: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  heroImage: {
    flex: 0.8,
    height: '120%',
    width: '100%',
    borderRadius: 12,
    marginRight: -10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 4,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
  },
  catIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  featuredList: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 8,
  },
  productCard: {
    width: width * 0.44,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',//
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 3,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  storyCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  storyContent: {
    fontSize: 13,
    lineHeight: 20,
  },
});
