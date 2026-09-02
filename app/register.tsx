import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    const res = await register(username.trim(), password, 'customer');
    setLoading(false);

    if (res.success) {
      const msg = res.message || 'ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('✅ สำเร็จ', msg);
      }
      router.replace('/login' as any);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* Header Bar */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={themeColors.text} />
            <Text style={[styles.backBtnText, { color: themeColors.text }]}>ย้อนกลับ</Text>
          </TouchableOpacity>

          {/* Logo Banner */}
          <View style={styles.logoSection}>
            <View style={[styles.logoBadge, { backgroundColor: 'rgba(201, 44, 44, 0.1)' }]}>
              <Text style={{ fontSize: 44 }}>📝</Text>
            </View>
            <Text style={[styles.title, { color: themeColors.text }]}>สมัครสมาชิก</Text>
            <Text style={[styles.subtitle, { color: themeColors.icon }]}>
              ร่วมเป็นส่วนหนึ่งกับ ร้านน้ำพริกคุณน้า
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {errorMessage ? (
              <View style={styles.errorBox}>
                <IconSymbol name="info.circle.fill" size={18} color="#FF4D4D" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.text }]}>ชื่อผู้ใช้ (Username)</Text>
              <View style={[styles.inputWrapper, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                <IconSymbol name="person.fill" size={18} color={themeColors.icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: themeColors.text }]}
                  placeholder="ตั้งชื่อผู้ใช้งาน..."
                  placeholderTextColor={themeColors.icon}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.text }]}>รหัสผ่าน (Password)</Text>
              <View style={[styles.inputWrapper, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                <IconSymbol name="lock.fill" size={18} color={themeColors.icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: themeColors.text }]}
                  placeholder="ตั้งรหัสผ่าน..."
                  placeholderTextColor={themeColors.icon}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <IconSymbol
                    name={showPassword ? 'eye.slash.fill' : 'eye.fill'}
                    size={18}
                    color={themeColors.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: themeColors.text }]}>ยืนยันรหัสผ่าน (Confirm Password)</Text>
              <View style={[styles.inputWrapper, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                <IconSymbol name="lock.fill" size={18} color={themeColors.icon} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: themeColors.text }]}
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง..."
                  placeholderTextColor={themeColors.icon}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: themeColors.tint }]}
              onPress={handleRegister}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>สมัครสมาชิก</Text>
              )}
            </TouchableOpacity>

            {/* Footer Login Link */}
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: themeColors.icon }]}>มีบัญชีสมาชิกอยู่แล้ว?</Text>
              <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text style={[styles.linkText, { color: themeColors.tint }]}> เข้าสู่ระบบ</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 4,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  formContainer: {
    gap: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 77, 0.3)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 13,
    flex: 1,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  eyeBtn: {
    padding: 6,
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#C92C2C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
