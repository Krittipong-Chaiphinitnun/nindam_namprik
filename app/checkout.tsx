import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart } from '@/context/CartContext';

export default function CheckoutScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  
  const { cartItems, cartTotal, deliveryFee, promoDiscount, clearCart } = useCart();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'promptpay' | 'credit'>('cod');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (!name.trim()) {
      alert('กรุณากรอกชื่อผู้รับ');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      alert('กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง');
      return;
    }
    if (!address.trim()) {
      alert('กรุณากรอกที่อยู่จัดส่ง');
      return;
    }

    // Success flow
    clearCart();
    router.replace('/order-success' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <SafeAreaView style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: themeColors.card }]} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={themeColors.tint} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>ชำระเงิน</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Order Items Summary */}
        <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>สรุปรายการสั่งซื้อ</Text>
          {cartItems.map((item, idx) => (
            <View key={`${item.id}-${item.selectedWeight}`} style={styles.itemRow}>
              <Text style={[styles.itemName, { color: themeColors.text }]} numberOfLines={1}>
                {item.thaiName} ({item.selectedWeight}) <Text style={{ color: themeColors.icon }}>x {item.quantity}</Text>
              </Text>
              <Text style={[styles.itemPrice, { color: themeColors.text }]}>฿{item.price * item.quantity}</Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeColors.icon }]}>ยอดรวมสินค้า</Text>
            <Text style={[styles.summaryVal, { color: themeColors.text }]}>฿{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: themeColors.icon }]}>ค่าจัดส่ง</Text>
            <Text style={[styles.summaryVal, { color: themeColors.text }]}>
              {deliveryFee === 0 ? 'ส่งฟรี' : `฿${deliveryFee}`}
            </Text>
          </View>
          {promoDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: 'green' }]}>ส่วนลดคูปอง</Text>
              <Text style={[styles.summaryVal, { color: 'green' }]}>-฿{promoDiscount}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, { marginTop: 6 }]}>
            <Text style={[styles.totalLabel, { color: themeColors.text }]}>ยอดชำระสุทธิ</Text>
            <Text style={[styles.totalVal, { color: themeColors.tint }]}>฿{cartTotal}</Text>
          </View>
        </View>

        {/* Shipping Address Form */}
        <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>ข้อมูลจัดส่ง</Text>
          
          <Text style={[styles.inputLabel, { color: themeColors.text }]}>ชื่อผู้รับ</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
            placeholder="ชื่อ-นามสกุล"
            placeholderTextColor={themeColors.icon}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.inputLabel, { color: themeColors.text }]}>เบอร์โทรศัพท์</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
            placeholder="เช่น 0891234567"
            placeholderTextColor={themeColors.icon}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={[styles.inputLabel, { color: themeColors.text }]}>ที่อยู่จัดส่ง</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: themeColors.background, color: themeColors.text, borderColor: themeColors.border }]}
            placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
            placeholderTextColor={themeColors.icon}
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Payment Methods */}
        <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>ช่องทางการชำระเงิน</Text>
          
          {/* COD */}
          <TouchableOpacity
            style={[
              styles.payMethodBtn,
              paymentMethod === 'cod' && { borderColor: themeColors.tint, backgroundColor: 'rgba(201,44,44,0.05)' },
              { borderColor: themeColors.border }
            ]}
            onPress={() => setPaymentMethod('cod')}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={paymentMethod === 'cod' ? themeColors.tint : '#C4B8B4'} style={{ marginRight: 10 }} />
            <View>
              <Text style={[styles.payMethodTitle, { color: themeColors.text }]}>เก็บเงินปลายทาง (COD)</Text>
              <Text style={[styles.payMethodSub, { color: themeColors.icon }]}>ชำระเมื่อได้รับสินค้าหน้าบ้าน</Text>
            </View>
          </TouchableOpacity>

          {/* PromptPay */}
          <TouchableOpacity
            style={[
              styles.payMethodBtn,
              paymentMethod === 'promptpay' && { borderColor: themeColors.tint, backgroundColor: 'rgba(201,44,44,0.05)' },
              { borderColor: themeColors.border }
            ]}
            onPress={() => setPaymentMethod('promptpay')}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={paymentMethod === 'promptpay' ? themeColors.tint : '#C4B8B4'} style={{ marginRight: 10 }} />
            <View>
              <Text style={[styles.payMethodTitle, { color: themeColors.text }]}>พร้อมเพย์ (PromptPay QR)</Text>
              <Text style={[styles.payMethodSub, { color: themeColors.icon }]}>แสกนคิวอาร์โค้ดผ่านโมบายแบงก์กิ้ง</Text>
            </View>
          </TouchableOpacity>

          {/* Credit Card */}
          <TouchableOpacity
            style={[
              styles.payMethodBtn,
              paymentMethod === 'credit' && { borderColor: themeColors.tint, backgroundColor: 'rgba(201,44,44,0.05)' },
              { borderColor: themeColors.border }
            ]}
            onPress={() => setPaymentMethod('credit')}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={paymentMethod === 'credit' ? themeColors.tint : '#C4B8B4'} style={{ marginRight: 10 }} />
            <View>
              <Text style={[styles.payMethodTitle, { color: themeColors.text }]}>บัตรเครดิต / บัตรเดบิต</Text>
              <Text style={[styles.payMethodSub, { color: themeColors.icon }]}>ปลอดภัยด้วยการยืนยันรหัส OTP</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Place Order Sticky Button */}
      <SafeAreaView style={[styles.footer, { backgroundColor: themeColors.card, borderTopColor: themeColors.border }]}>
        <TouchableOpacity style={[styles.placeOrderBtn, { backgroundColor: themeColors.tint }]} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderBtnText}>ยืนยันการสั่งซื้อ • ฿{cartTotal}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 14,
    flex: 0.8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  payMethodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
  },
  payMethodTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  payMethodSub: {
    fontSize: 12,
    marginTop: 2,
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
  placeOrderBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
