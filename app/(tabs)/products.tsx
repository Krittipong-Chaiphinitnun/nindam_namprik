import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView, Dimensions, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { PRODUCTS, Product } from '@/constants/products';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

export default function ProductsShowcaseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'priceAsc' | 'priceDesc'>('rating');

  // Sync category parameter from Home screen if passed
  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category);
    }
  }, [params.category]);

  const categories = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'wet', name: 'น้ำพริกเปียก' },
    { id: 'dry', name: 'น้ำพริกแห้ง' },
    { id: 'crispy', name: 'กากหมู/กรอบ' },
    { id: 'mild', name: 'เผ็ดน้อย' },
  ];

  // Process list
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch =
      product.thaiName.includes(searchQuery) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.includes(searchQuery);

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    return 0;
  });

  const renderProductItem = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity
        style={[styles.gridCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
        onPress={() => router.push(`/product/${item.id}` as any)}>
        <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" />
        
        {/* Hot badge based on spice level */}
        {item.spicyLevel >= 4 && (
          <View style={styles.spicyBadge}>
            <Text style={styles.spicyBadgeText}>เผ็ดซี๊ด 🌶️</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]} numberOfLines={1}>
            {item.thaiName}
          </Text>
          <Text style={[styles.cardDesc, { color: themeColors.icon }]} numberOfLines={1}>
            {item.description}
          </Text>

          {/* Rating and Spice */}
          <View style={styles.cardMetaRow}>
            <View style={styles.metaLabel}>
              <IconSymbol name="star.fill" size={12} color="#FFB800" style={{ marginRight: 2 }} />
              <Text style={[styles.metaText, { color: themeColors.text }]}>{item.rating}</Text>
            </View>
            <View style={styles.metaLabel}>
              <IconSymbol name="flame.fill" size={12} color="#FF4D4D" style={{ marginRight: 2 }} />
              <Text style={[styles.metaText, { color: themeColors.text }]}>{item.spicyLevel}/5</Text>
            </View>
          </View>

          {/* Price and Button */}
          <View style={styles.cardFooter}>
            <Text style={[styles.priceText, { color: themeColors.tint }]}>฿{item.price}</Text>
            <View style={[styles.buyBtn, { backgroundColor: themeColors.tint }]}>
              <IconSymbol name="chevron.right" size={14} color="#fff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <Text style={[styles.title, { color: themeColors.text }]}>แผงโชว์น้ำพริก</Text>
        <View style={[styles.searchBar, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <IconSymbol name="magnifyingglass" size={18} color={themeColors.icon} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="ค้นหาน้ำพริกสุดโปรด..."
            placeholderTextColor={themeColors.icon}
            style={[styles.searchInput, { color: themeColors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={{ color: themeColors.tint, fontWeight: 'bold' }}>ล้าง</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Chips Scroll */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chipBtn,
                  {
                    backgroundColor: isSelected ? themeColors.tint : themeColors.card,
                    borderColor: isSelected ? themeColors.tint : themeColors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(cat.id)}>
                <Text style={[styles.chipText, { color: isSelected ? '#fff' : themeColors.text }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Sort selection bar */}
      <View style={[styles.sortBar, { borderBottomColor: themeColors.border }]}>
        <Text style={[styles.resultCount, { color: themeColors.icon }]}>
          พบสินค้าทั้งหมด {filteredProducts.length} รายการ
        </Text>
        <View style={styles.sortOptions}>
          <TouchableOpacity onPress={() => setSortBy('rating')}>
            <Text style={[styles.sortLink, sortBy === 'rating' && { color: themeColors.tint, fontWeight: 'bold' }, { color: themeColors.icon }]}>
              คะแนนดีสุด
            </Text>
          </TouchableOpacity>
          <Text style={{ color: themeColors.border }}>|</Text>
          <TouchableOpacity onPress={() => setSortBy(sortBy === 'priceAsc' ? 'priceDesc' : 'priceAsc')}>
            <Text
              style={[
                styles.sortLink,
                (sortBy === 'priceAsc' || sortBy === 'priceDesc') && { color: themeColors.tint, fontWeight: 'bold' },
                { color: themeColors.icon }
              ]}>
              ราคา {sortBy === 'priceAsc' ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid List */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <IconSymbol name="info.circle.fill" size={48} color={themeColors.icon} />
          <Text style={[styles.emptyText, { color: themeColors.icon }]}>ไม่พบคู่แท้ความแซ่บในหมวดหมู่นี้</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 10,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  chipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    marginTop: 4,
  },
  resultCount: {
    fontSize: 12,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  sortLink: {
    fontSize: 12,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridCard: {
    width: width * 0.44,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  spicyBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  spicyBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 11,
    marginBottom: 6,
  },
  cardMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  metaLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  buyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 80,
  },
  emptyText: {
    fontSize: 14,
  },
});
