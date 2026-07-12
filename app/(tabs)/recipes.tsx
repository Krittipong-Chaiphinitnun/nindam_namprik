import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

interface Recipe {
  id: string;
  title: string;
  namprikUsed: string;
  prepTime: string;
  difficulty: string;
  image: string;
  ingredients: string[];
  instructions: string[];
}

const RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'สำรับเหนือน้ำพริกหนุ่มแคบหมูผักนึ่ง',
    namprikUsed: 'น้ำพริกหนุ่มสูตรเมืองเหนือ',
    prepTime: '15 นาที',
    difficulty: 'ง่าย',
    image: 'https://s359.kapook.com/pagebuilder/44d114c7-c768-4752-9759-f0bf62d769b7.jpg',
    ingredients: [
      'น้ำพริกหนุ่ม 1 กระปุก',
      'แคบหมูติดมัน (ตามชอบ)',
      'ผักสด/ผักนึ่ง (กะหล่ำปลี, มะเขือเปราะ, ถั่วฝักยาว)',
      'ไข่ต้มยางมะตูม 2 ฟอง',
    ],
    instructions: [
      'นำผักสดไปล้างให้สะอาด หั่นชิ้นพอดีคำ แล้วนำไปนึ่งในซึ้งประมาณ 5-8 นาทีจนสุกหวาน',
      'ต้มไข่ไก่ประมาณ 6 นาทีครึ่งเพื่อได้ไข่ตูมสีสวย แกะเปลือกเตรียมไว้',
      'ตักน้ำพริกหนุ่มใส่ถ้วยเล็ก จัดเสิร์ฟตรงกลางถาดล้อมรอบด้วยผักนึ่ง แคบหมูกรอบๆ และไข่ต้ม',
    ],
  },
  {
    id: '2',
    title: 'น้ำพริกตาแดงเคียงปลาทูทอดกับผักต้มและไข่ต้ม',
    namprikUsed: 'น้ำพริกตาแดงโคตรแซ่บ',
    prepTime: '20 นาที',
    difficulty: 'ปานกลาง',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTphyXqGBhR6OPique66aS79T2F5xcunu3n9uToE-eCbJ9VUqijSMI30GBg&s=10',
    ingredients: [
      'น้ำพริกตาแดง 1 กระปุก',
      'ปลาทูหน้างอคอหัก 2 ตัว',
      'ผัก 1 กำ',
      'ไข่ไก่ 2 ฟอง',
      'น้ำมันพืชสำหรับทอด',
    ],
    instructions: [
      'นำไข่ไก่ใส่หม้อต้มน้ำร้อน หลังจากที่ต้มผักเสร็จแล้ว',
      'ตั้งกระทะใส่น้ำมันร้อนปานกลาง',
      'ทอดปลาทูในน้ำมันร้อนจัดจนหนังกรอบเนื้อในนุ่มฟู',
      'จัดปลาทูทอด ไข่ต้ม และผักต้มเคียงคู่กับถ้วยน้ำพริกตาแดง ทานพร้อมข้าวสวยร้อนๆ หอมอร่อยแซ่บถึงใจ',
    ],
  },
  {
    id: '3',
    title: 'ไข่ดาวกากหมูสวรรค์ราดข้าวสวยร้อนๆ',
    namprikUsed: 'น้ำพริกกากหมูสวรรค์ชั้นเจ็ด',
    prepTime: '10 นาที',
    difficulty: 'ง่ายที่สุด',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPukbT2Ze_t17shfvoVJFfyh-avmaSAAPOMXu0XBJfGKOaJcmnkIPIFSxe&s=10',
    ingredients: [
      'น้ำพริกกากหมูสวรรค์ 3-4 ช้อนโต๊ะ',
      'ไข่ไก่สด 3 ฟอง',
      'น้ำมันใช้ทอด',
      'น้ำปลาแท้ 1 ช้อนชา',
    ],
    instructions: [
      'ตอกไข่ใส่กระทะ',
      'ตั้งกระทะใส่น้ำมันจนร้อนจัด เทไข่ลงทอด',
      'ตักข้าวสวยใส่จาน โปะด้วยไข่ดาวร้อนๆ โรยหน้าด้วยน้ำพริกกากหมูอย่างจุใจ บีบน้ำปลาใส่ไข่ พร้อมเสิร์ฟความกรอบแซ่บสะท้านลิ้น',
    ],
  },
];

export default function RecipesScreen() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>สูตรเด็ดคู่ครัวแซ่บ</Text>
        <Text style={[styles.headerSub, { color: themeColors.icon }]}>
          รวมไอเดียสร้างสรรค์เมนูอาหารคู่น้ำพริกคุณน้า
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {RECIPES.map(recipe => (
          <View
            key={recipe.id}
            style={[styles.recipeCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} contentFit="cover" />

            <View style={styles.recipeContent}>
              <Text style={[styles.recipeTitle, { color: themeColors.text }]}>{recipe.title}</Text>

              <View style={styles.badgeRow}>
                <View style={[styles.pairBadge, { backgroundColor: 'rgba(201, 44, 44, 0.08)' }]}>
                  <Text style={[styles.pairText, { color: themeColors.tint }]}>
                    📍 เคียง: {recipe.namprikUsed}
                  </Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <IconSymbol name="info.circle.fill" size={14} color={themeColors.icon} style={{ marginRight: 4 }} />
                  <Text style={[styles.metaText, { color: themeColors.icon }]}>เวลา: {recipe.prepTime}</Text>
                </View>
                <View style={styles.metaItem}>
                  <IconSymbol name="flame.fill" size={14} color={themeColors.tint} style={{ marginRight: 4 }} />
                  <Text style={[styles.metaText, { color: themeColors.icon }]}>ความยาก: {recipe.difficulty}</Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

              {/* Ingredients section */}
              <Text style={[styles.subTitle, { color: themeColors.text }]}>สิ่งที่ต้องเตรียม</Text>
              {recipe.ingredients.map((ing, idx) => (
                <Text key={idx} style={[styles.bulletText, { color: themeColors.icon }]}>
                  • {ing}
                </Text>
              ))}

              {/* Steps section */}
              <Text style={[styles.subTitle, { color: themeColors.text, marginTop: 12 }]}>ขั้นตอนการทำ</Text>
              {recipe.instructions.map((step, idx) => (
                <View key={idx} style={styles.stepRow}>
                  <View style={[styles.stepNumber, { backgroundColor: themeColors.tint }]}>
                    <Text style={styles.stepNumberText}>{idx + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, { color: themeColors.icon }]}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
  headerSub: {
    fontSize: 13,
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
    paddingBottom: 40,
  },
  recipeCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 160,
  },
  recipeContent: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  pairBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pairText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  bulletText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 2,
    paddingLeft: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    gap: 8,
  },
  stepNumber: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
