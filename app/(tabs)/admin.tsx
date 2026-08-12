import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product } from '@/constants/products';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useProducts } from '@/hooks/use-products';
import { useProductMutations, ProductPayload } from '@/hooks/use-product-mutations';
import ProductFormModal from '@/components/product-form-modal';

const CATEGORY_LABELS: Record<string, string> = {
  wet: 'น้ำพริกเปียก',
  dry: 'น้ำพริกแห้ง',
  crispy: 'กากหมู/กรอบ',
  mild: 'เผ็ดน้อย',
};

export default function AdminScreen() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];

  const { products, loading: productsLoading, error: productsError, refetch } = useProducts();
  const { loading: mutLoading, createProduct, updateProduct, deleteProduct } = useProductMutations();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openAdd = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const handleDelete = (product: Product) => {
    if (!product || !product.id) {
      Alert.alert('❌ ผิดพลาด', 'ไม่พบ ID ของสินค้า (เป็น undefined หรือ null)');
      return;
    }

    Alert.alert(
      '🗑️ ลบสินค้า',
      `คุณต้องการลบ "${product.thaiName || product.name}" ใช่ไหม?\nการกระทำนี้ไม่สามารถย้อนกลับได้`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบเลย',
          style: 'destructive',
          onPress: async () => {
            console.log('Confirmed delete ID:', product.id);
            const result = await deleteProduct(product.id);

            // เช็กค่าจาก result.success ที่ได้จาก useProductMutations
            if (result && result.success) {
              Alert.alert('✅ สำเร็จ', `ลบ "${product.thaiName || product.name}" เรียบร้อยแล้ว`);
              refetch(); // โหลดรายการสินค้าใหม่ทันที
            } else {
              Alert.alert('❌ ผิดพลาด', result?.error || 'ไม่สามารถลบสินค้าได้');
            }
          },
        },
      ],
    );
  };

  const handleSubmit = async (data: ProductPayload) => {
    let result: unknown = null;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, data);
    } else {
      result = await createProduct(data);
    }

    if (result !== null) {
      setModalVisible(false);
      Alert.alert('✅ สำเร็จ', editingProduct ? 'แก้ไขสินค้าเรียบร้อยแล้ว' : 'เพิ่มสินค้าใหม่เรียบร้อยแล้ว');
      refetch();
    } else {
      Alert.alert('❌ ผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่');
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
      {/* Product Image */}
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      {/* Info */}
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardTitle, { color: c.text }]} numberOfLines={1}>
              {item.thaiName}
            </Text>
            <Text style={[styles.cardSub, { color: c.icon }]} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <View style={[styles.catBadge, { backgroundColor: c.tint + '22', borderColor: c.tint + '55' }]}>
            <Text style={[styles.catBadgeText, { color: c.tint }]}>
              {CATEGORY_LABELS[item.category] ?? item.category}
            </Text>
          </View>
        </View>

        <View style={styles.cardMeta}>
          {/* Price */}
          <View style={styles.metaItem}>
            <Text style={[styles.metaValue, { color: c.tint }]}>฿{item.price}</Text>
          </View>
          {/* Rating */}
          <View style={styles.metaItem}>
            <Text style={{ fontSize: 11, marginRight: 3 }}>⭐</Text>
            <Text style={[styles.metaValue, { color: c.text }]}>{item.rating}</Text>
          </View>
          {/* Spicy */}
          <View style={styles.metaItem}>
            <Text style={{ fontSize: 11, marginRight: 3 }}>🌶️</Text>
            <Text style={[styles.metaValue, { color: c.text }]}>{item.spicyLevel}/5</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: c.tint + '15', borderColor: c.tint + '40' }]}
            onPress={() => openEdit(item)}>
            <IconSymbol name="pencil" size={14} color={c.tint} />
            <Text style={[styles.actionBtnText, { color: c.tint }]}>แก้ไข</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#FF4D4D15', borderColor: '#FF4D4D40' }]}
            onPress={() => handleDelete(item)}>
            <IconSymbol name="trash" size={14} color="#FF4D4D" />
            <Text style={[styles.actionBtnText, { color: '#FF4D4D' }]}>ลบ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: c.border }]}>
        <View>
          <Text style={[styles.headerTitle, { color: c.text }]}>⚙️ จัดการสินค้า</Text>
          <Text style={[styles.headerSub, { color: c.icon }]}>
            {productsLoading ? 'กำลังโหลด...' : `สินค้าทั้งหมด ${products.length} รายการ`}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: c.tint }]}
          onPress={openAdd}>
          <IconSymbol name="plus" size={18} color="#fff" />
          <Text style={styles.addBtnText}>เพิ่มสินค้า</Text>
        </TouchableOpacity>
      </View>

      {/* Body */}
      {productsLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={c.tint} />
          <Text style={[styles.centerText, { color: c.icon }]}>กำลังโหลดสินค้า...</Text>
        </View>
      ) : productsError ? (
        <View style={styles.center}>
          <IconSymbol name="wifi.slash" size={48} color={c.icon} />
          <Text style={[styles.centerText, { color: c.text }]}>โหลดข้อมูลไม่สำเร็จ</Text>
          <Text style={[{ color: c.icon, fontSize: 12, textAlign: 'center' }]}>{productsError}</Text>
          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: c.tint }]} onPress={refetch}>
            <Text style={styles.retryBtnText}>ลองใหม่</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ fontSize: 40 }}>📦</Text>
              <Text style={[styles.centerText, { color: c.icon }]}>ยังไม่มีสินค้า</Text>
              <Text style={[{ color: c.icon, fontSize: 13 }]}>กดปุ่ม "เพิ่มสินค้า" เพื่อเริ่มต้น</Text>
            </View>
          }
        />
      )}

      {/* Mutation loading overlay */}
      {mutLoading && (
        <View style={styles.overlay}>
          <View style={[styles.overlayBox, { backgroundColor: c.card }]}>
            <ActivityIndicator size="large" color={c.tint} />
            <Text style={[styles.overlayText, { color: c.text }]}>กำลังดำเนินการ...</Text>
          </View>
        </View>
      )}

      {/* Form Modal */}
      <ProductFormModal
        visible={modalVisible}
        product={editingProduct}
        loading={mutLoading}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyInBetween: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardImage: {
    width: 90,
    height: '100%',
    minHeight: 110,
  },
  cardBody: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardSub: {
    fontSize: 11,
    marginTop: 2,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    flexShrink: 0,
  },
  catBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  centerText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBox: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  overlayText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
