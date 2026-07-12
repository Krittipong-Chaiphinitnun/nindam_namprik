import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart, CartItem } from '@/context/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    promoDiscount,
    promoCode,
    applyPromo,
    deliveryFee
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const success = applyPromo(promoInput);
    if (success) {
      setPromoMessage({ text: `ใช้คูปอง "${promoInput.toUpperCase()}" สำเร็จ!`, success: true });
    } else {
      setPromoMessage({ text: 'ไม่พบโค้ดลดนี้ หรือโค้ดยังไม่เปิดใช้', success: false });
    }
  };

  const renderCartItem = (item: CartItem) => {
    return (
      <View key={`${item.id}-${item.selectedWeight}`} style={[styles.itemCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
        <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
        
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, { color: themeColors.text }]} numberOfLines={1}>
            {item.thaiName}
          </Text>
          <Text style={[styles.itemWeight, { color: themeColors.icon }]}>ขนาด: {item.selectedWeight}</Text>
          
          <View style={styles.qtyRow}>
            {/* Quantity Controller */}
            <View style={[styles.qtySelector, { borderColor: themeColors.border }]}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.id, item.selectedWeight, item.quantity - 1)}>
                <IconSymbol name="minus.circle.fill" size={20} color={themeColors.tint} />
              </TouchableOpacity>
              <Text style={[styles.qtyText, { color: themeColors.text }]}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.id, item.selectedWeight, item.quantity + 1)}>
                <IconSymbol name="plus.circle.fill" size={20} color={themeColors.tint} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.itemPriceText, { color: themeColors.tint }]}>฿{item.price * item.quantity}</Text>
          </View>
        </View>

        {/* Remove Button */}
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => removeFromCart(item.id, item.selectedWeight)}>
          <IconSymbol name="trash.fill" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    );
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.emptyContainer}>
          <IconSymbol name="cart.fill" size={64} color={themeColors.icon} style={{ marginBottom: 16 }} />
          <Text style={[styles.emptyTitle, { color: themeColors.text }]}>ตะกร้าของคุณยังว่างเปล่า</Text>
          <Text style={[styles.emptySub, { color: themeColors.icon }]}>
            เพิ่มความแซ่บกระตุ้นลิ้นด้วยน้ำพริกสูตรเด็ดที่เรามีให้คุณเลือกซื้อได้เลย!
          </Text>
          <TouchableOpacity
            style={[styles.shopBtn, { backgroundColor: themeColors.tint }]}
            onPress={() => router.push('/(tabs)/products' as any)}>
            <Text style={styles.shopBtnText}>ไปช้อปน้ำพริกกันเลย</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>ตะกร้าความแซ่บ</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Items List */}
        <View style={styles.itemsList}>{cartItems.map(renderCartItem)}</View>

        {/* Promo Code Box */}
        <View style={[styles.promoCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>มีโค้ดส่วนลดไหมน้า?</Text>
          <Text style={[styles.cardSubText, { color: themeColors.icon }]}>
            ลองใส่โค้ด <Text style={{ fontWeight: 'bold', color: themeColors.tint }}>SPICY10</Text> หรือ <Text style={{ fontWeight: 'bold', color: themeColors.tint }}>FREESHIP</Text>
          </Text>
          <View style={styles.promoInputRow}>
            <TextInput
              style={[styles.promoInput, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
              placeholder="กรอกรหัสส่วนลด..."
              placeholderTextColor={themeColors.icon}
              autoCapitalize="characters"
              value={promoInput}
              onChangeText={setPromoInput}
            />
            <TouchableOpacity style={[styles.promoApplyBtn, { backgroundColor: themeColors.tint }]} onPress={handleApplyPromo}>
              <Text style={styles.promoApplyBtnText}>ใช้โค้ด</Text>
            </TouchableOpacity>
          </View>
          {promoMessage && (
            <Text style={[styles.promoMsgText, { color: promoMessage.success ? 'green' : 'red' }]}>
              {promoMessage.text}
            </Text>
          )}
        </View>

        {/* Price calculation block */}
        <View style={[styles.summaryCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>สรุปยอดรวม</Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeColors.icon }]}>ยอดรวมสินค้า</Text>
            <Text style={[styles.summaryValue, { color: themeColors.text }]}>฿{subtotal}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeColors.icon }]}>ค่าจัดส่ง</Text>
            <Text style={[styles.summaryValue, { color: themeColors.text }]}>
              {deliveryFee === 0 ? 'ส่งฟรี' : `฿${deliveryFee}`}
            </Text>
          </View>
          {deliveryFee > 0 && (
            <Text style={[styles.deliveryNotice, { color: themeColors.icon }]}>
              *ช้อปครบ ฿300 ส่งฟรีทั่วไทย! (ยังขาดอีก ฿{Math.max(0, 300 - subtotal)})
            </Text>
          )}

          {promoDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: 'green' }]}>
                ส่วนลดคูปอง ({promoCode})
              </Text>
              <Text style={[styles.summaryValue, { color: 'green' }]}>-฿{promoDiscount}</Text>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: themeColors.text }]}>ยอดสุทธิ</Text>
            <Text style={[styles.totalValue, { color: themeColors.tint }]}>฿{cartTotal}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout button */}
      <View style={[styles.checkoutFooter, { backgroundColor: themeColors.card, borderTopColor: themeColors.border }]}>
        <View style={styles.checkoutFooterInfo}>
          <Text style={[styles.footerTotalLabel, { color: themeColors.icon }]}>ทั้งหมด {cartItems.length} รายการ</Text>
          <Text style={[styles.footerTotalPrice, { color: themeColors.tint }]}>฿{cartTotal}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutBtn, { backgroundColor: themeColors.tint }]}
          onPress={() => router.push('/checkout' as any)}>
          <Text style={styles.checkoutBtnText}>ชำระเงินเลย</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    gap: 16,
  },
  itemsList: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    position: 'relative',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    width: '85%',
  },
  itemWeight: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 6,
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 4,
    height: 32,
  },
  qtyBtn: {
    padding: 2,
  },
  qtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  itemPriceText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  removeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  promoCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 12,
    marginBottom: 10,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  promoApplyBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  promoApplyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  promoMsgText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  deliveryNotice: {
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutFooterInfo: {
    justifyContent: 'center',
  },
  footerTotalLabel: {
    fontSize: 12,
  },
  footerTotalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  shopBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  shopBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
