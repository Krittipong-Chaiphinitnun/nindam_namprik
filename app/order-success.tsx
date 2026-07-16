import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  // Generate a random order ID for realism
  const orderId = React.useMemo(() => {
    const chars = '0123456789';
    let res = 'NP-';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.content}>
        {/* Animated-like Big Success Check */}
        <View style={[styles.successIconWrapper, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
          <IconSymbol name="checkmark.circle.fill" size={80} color="#4CAF50" />
        </View>

        <Text style={[styles.title, { color: themeColors.text }]}>สั่งซื้อน้ำพริกสำเร็จแล้ว!</Text>
        <Text style={[styles.subtitle, { color: themeColors.icon }]}>
          ขอบคุณที่อุดหนุนความแซ่บกับเรา ร้านจะรีบแพ็คจัดส่งโดยด่วนที่สุด
        </Text>

        <View style={[styles.orderCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={styles.orderRow}>
            <Text style={[styles.label, { color: themeColors.icon }]}>หมายเลขคำสั่งซื้อ</Text>
            <Text style={[styles.value, { color: themeColors.text, fontWeight: 'bold' }]}>{orderId}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={[styles.label, { color: themeColors.icon }]}>เวลาทำรายการ</Text>
            <Text style={[styles.value, { color: themeColors.text }]}>
              {new Date().toLocaleDateString('th-TH')} {new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
            </Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={[styles.label, { color: themeColors.icon }]}>ระยะเวลาจัดส่ง</Text>
            <Text style={[styles.value, { color: themeColors.tint, fontWeight: 'bold' }]}>ด่วนพิเศษ (1-2 วันทำการ)</Text>
          </View>
        </View>

        <Text style={[styles.footerNotice, { color: themeColors.icon }]}>
          *ระบบจะส่งข้อมูลยืนยันและลิงก์ติดตามพัสดุไปยังเบอร์โทรศัพท์ของคุณ
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.homeButton, { backgroundColor: themeColors.tint }]}
          onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.homeButtonText}>กลับหน้าหลัก</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIconWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  orderCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
  },
  footerNotice: {
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    padding: 16,
  },
  homeButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
