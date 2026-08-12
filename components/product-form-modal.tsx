import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Product } from '@/constants/products';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProductPayload } from '@/hooks/use-product-mutations';

interface Props {
  visible: boolean;
  product?: Product | null; // null = add mode, Product = edit mode
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: ProductPayload) => void;
}

const CATEGORIES: { label: string; value: 'dry' | 'wet' | 'crispy' | 'mild' }[] = [
  { label: 'น้ำพริกเปียก', value: 'wet' },
  { label: 'น้ำพริกแห้ง', value: 'dry' },
  { label: 'กากหมู/กรอบ', value: 'crispy' },
  { label: 'เผ็ดน้อย', value: 'mild' },
];

export default function ProductFormModal({ visible, product, loading, onClose, onSubmit }: Props) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];

  // Form state
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [thaiName, setThaiName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'dry' | 'wet' | 'crispy' | 'mild'>('wet');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [spicyLevel, setSpicyLevel] = useState(3);
  const [image, setImage] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [weightOptions, setWeightOptions] = useState<{ label: string; price: string }[]>([
    { label: '150g', price: '' },
  ]);

  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setId(product.id);
      setName(product.name);
      setThaiName(product.thaiName);
      setPrice(String(product.price));
      setCategory(product.category);
      setDescription(product.description);
      setLongDescription(product.longDescription);
      setSpicyLevel(product.spicyLevel);
      setImage(product.image);
      setIngredients(product.ingredients?.length ? product.ingredients : ['']);
      setWeightOptions(
        product.weightOptions?.length
          ? product.weightOptions.map((w) => ({ label: w.label, price: String(w.price) }))
          : [{ label: '150g', price: '' }],
      );
    } else {
      setId('');
      setName('');
      setThaiName('');
      setPrice('');
      setCategory('wet');
      setDescription('');
      setLongDescription('');
      setSpicyLevel(3);
      setImage('');
      setIngredients(['']);
      setWeightOptions([{ label: '150g', price: '' }]);
    }
  }, [product, visible]);

  // Ingredient helpers
  const updateIngredient = (idx: number, val: string) => {
    setIngredients((prev) => prev.map((v, i) => (i === idx ? val : v)));
  };
  const addIngredient = () => setIngredients((prev) => [...prev, '']);
  const removeIngredient = (idx: number) =>
    setIngredients((prev) => prev.filter((_, i) => i !== idx));

  // Weight option helpers
  const updateWeightOption = (idx: number, field: 'label' | 'price', val: string) => {
    setWeightOptions((prev) =>
      prev.map((w, i) => (i === idx ? { ...w, [field]: val } : w)),
    );
  };
  const addWeightOption = () => setWeightOptions((prev) => [...prev, { label: '', price: '' }]);
  const removeWeightOption = (idx: number) =>
    setWeightOptions((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    const payload: ProductPayload = {
      ...(isEdit ? {} : { id: (id || '').trim().toLowerCase().replace(/\s+/g, '_') }),
      name: (name || '').trim(),
      thai_name: (thaiName || '').trim(),
      price: parseFloat(price) || 0,
      category,
      description: (description || '').trim(),
      long_description: (longDescription || '').trim(),
      spicy_level: spicyLevel,
      image: (image || '').trim(),
      ingredients: ingredients.filter((i) => (i || '').trim()),
      weight_options: weightOptions
        .filter((w) => (w.label || '').trim() && w.price)
        .map((w) => ({ label: (w.label || '').trim(), price: parseFloat(w.price) || 0 })),
    };
    onSubmit(payload);
  };

  const inputStyle = [styles.input, { backgroundColor: c.card, borderColor: c.border, color: c.text }];
  const labelStyle = [styles.label, { color: c.text }];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: c.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: c.card, borderBottomColor: c.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
            <IconSymbol name="xmark" size={20} color={c.icon} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.text }]}>
            {isEdit ? '✏️ แก้ไขสินค้า' : '➕ เพิ่มสินค้าใหม่'}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.saveBtn, { backgroundColor: c.tint }]}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>บันทึก</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ID (add mode only) */}
          {!isEdit && (
            <View style={styles.field}>
              <Text style={labelStyle}>ID สินค้า (ภาษาอังกฤษ ไม่มีช่องว่าง) *</Text>
              <TextInput
                style={inputStyle}
                value={id}
                onChangeText={setId}
                placeholder="เช่น tadaeng, noom_spicy"
                placeholderTextColor={c.icon}
                autoCapitalize="none"
              />
            </View>
          )}

          {/* Name EN */}
          <View style={styles.field}>
            <Text style={labelStyle}>ชื่อสินค้า (อังกฤษ) *</Text>
            <TextInput
              style={inputStyle}
              value={name}
              onChangeText={setName}
              placeholder="เช่น Ta-Daeng Chili Paste"
              placeholderTextColor={c.icon}
            />
          </View>

          {/* Name TH */}
          <View style={styles.field}>
            <Text style={labelStyle}>ชื่อสินค้า (ไทย) *</Text>
            <TextInput
              style={inputStyle}
              value={thaiName}
              onChangeText={setThaiName}
              placeholder="เช่น น้ำพริกตาแดงโคตรแซ่บ"
              placeholderTextColor={c.icon}
            />
          </View>

          {/* Price */}
          <View style={styles.field}>
            <Text style={labelStyle}>ราคาเริ่มต้น (บาท) *</Text>
            <TextInput
              style={inputStyle}
              value={price}
              onChangeText={setPrice}
              placeholder="89"
              placeholderTextColor={c.icon}
              keyboardType="numeric"
            />
          </View>

          {/* Category */}
          <View style={styles.field}>
            <Text style={labelStyle}>หมวดหมู่ *</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: category === cat.value ? c.tint : c.card,
                      borderColor: category === cat.value ? c.tint : c.border,
                    },
                  ]}
                  onPress={() => setCategory(cat.value)}>
                  <Text style={{ color: category === cat.value ? '#fff' : c.text, fontSize: 12, fontWeight: '600' }}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Spicy Level */}
          <View style={styles.field}>
            <Text style={labelStyle}>ระดับความเผ็ด: {spicyLevel}/5</Text>
            <View style={styles.spicyRow}>
              {[1, 2, 3, 4, 5].map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setSpicyLevel(level)}
                  style={[
                    styles.spicyBtn,
                    {
                      backgroundColor: spicyLevel >= level ? '#FF4D4D' : c.card,
                      borderColor: spicyLevel >= level ? '#FF4D4D' : c.border,
                    },
                  ]}>
                  <Text style={{ fontSize: 16 }}>🌶️</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={labelStyle}>คำอธิบายสั้น *</Text>
            <TextInput
              style={[inputStyle, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="บรรยายสั้นๆ เด่นใจ"
              placeholderTextColor={c.icon}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Long Description */}
          <View style={styles.field}>
            <Text style={labelStyle}>คำอธิบายยาว</Text>
            <TextInput
              style={[inputStyle, styles.textAreaLg]}
              value={longDescription}
              onChangeText={setLongDescription}
              placeholder="รายละเอียดเต็มๆ ของสินค้า"
              placeholderTextColor={c.icon}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Image URL */}
          <View style={styles.field}>
            <Text style={labelStyle}>URL รูปภาพ</Text>
            <TextInput
              style={inputStyle}
              value={image}
              onChangeText={setImage}
              placeholder="https://..."
              placeholderTextColor={c.icon}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          {/* Ingredients */}
          <View style={styles.field}>
            <View style={styles.sectionHeader}>
              <Text style={labelStyle}>ส่วนผสม</Text>
              <TouchableOpacity onPress={addIngredient} style={[styles.addSmallBtn, { borderColor: c.tint }]}>
                <IconSymbol name="plus" size={14} color={c.tint} />
                <Text style={{ color: c.tint, fontSize: 12, marginLeft: 4 }}>เพิ่ม</Text>
              </TouchableOpacity>
            </View>
            {ingredients.map((ing, idx) => (
              <View key={idx} style={styles.rowWithDelete}>
                <TextInput
                  style={[inputStyle, { flex: 1, marginBottom: 0 }]}
                  value={ing}
                  onChangeText={(v) => updateIngredient(idx, v)}
                  placeholder={`ส่วนผสมที่ ${idx + 1}`}
                  placeholderTextColor={c.icon}
                />
                {ingredients.length > 1 && (
                  <TouchableOpacity onPress={() => removeIngredient(idx)} style={styles.deleteRowBtn}>
                    <IconSymbol name="trash" size={16} color="#FF4D4D" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Weight Options */}
          <View style={styles.field}>
            <View style={styles.sectionHeader}>
              <Text style={labelStyle}>ตัวเลือกน้ำหนัก</Text>
              <TouchableOpacity onPress={addWeightOption} style={[styles.addSmallBtn, { borderColor: c.tint }]}>
                <IconSymbol name="plus" size={14} color={c.tint} />
                <Text style={{ color: c.tint, fontSize: 12, marginLeft: 4 }}>เพิ่ม</Text>
              </TouchableOpacity>
            </View>
            {weightOptions.map((wo, idx) => (
              <View key={idx} style={[styles.rowWithDelete, { gap: 8 }]}>
                <TextInput
                  style={[inputStyle, { flex: 1, marginBottom: 0 }]}
                  value={wo.label}
                  onChangeText={(v) => updateWeightOption(idx, 'label', v)}
                  placeholder="150g"
                  placeholderTextColor={c.icon}
                />
                <TextInput
                  style={[inputStyle, { flex: 1, marginBottom: 0 }]}
                  value={wo.price}
                  onChangeText={(v) => updateWeightOption(idx, 'price', v)}
                  placeholder="ราคา"
                  placeholderTextColor={c.icon}
                  keyboardType="numeric"
                />
                {weightOptions.length > 1 && (
                  <TouchableOpacity onPress={() => removeWeightOption(idx)} style={styles.deleteRowBtn}>
                    <IconSymbol name="trash" size={16} color="#FF4D4D" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 72,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 0,
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
  },
  textAreaLg: {
    height: 110,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  spicyRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  spicyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  rowWithDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  deleteRowBtn: {
    padding: 8,
  },
});
