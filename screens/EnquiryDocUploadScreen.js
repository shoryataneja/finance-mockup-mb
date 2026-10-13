import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DOC_CATEGORIES = [
  {
    id: 'kyc',
    title: 'KYC Documents',
    icon: 'person-circle-outline',
    color: '#1a3a6b',
    bg: '#eef2fb',
    docs: ['Aadhaar Card', 'PAN Card', 'Passport / Voter ID'],
  },
  {
    id: 'income',
    title: 'Income Proof',
    icon: 'cash-outline',
    color: '#1a7a4a',
    bg: '#e8f7ef',
    docs: ['Salary Slips (3 months)', 'Form 16 / ITR', 'Bank Statement (6 months)'],
  },
  {
    id: 'vehicle',
    title: 'Vehicle Documents',
    icon: 'car-outline',
    color: '#b07d1a',
    bg: '#fdf6e3',
    docs: ['Proforma Invoice', 'Insurance Copy', 'RC Book (if exchange)'],
  },
  {
    id: 'other',
    title: 'Other Documents',
    icon: 'document-text-outline',
    color: '#7c3aed',
    bg: '#f3eeff',
    docs: ['Address Proof', 'Employment Letter', 'Any Other'],
  },
];

export default function EnquiryDocUploadScreen({ route, navigation }) {
  const [uploaded, setUploaded] = useState({});
  const [popup, setPopup] = useState(null); // { key, doc, cat }

  const uploadedCount = Object.values(uploaded).filter(Boolean).length;

  const openPopup = (cat, doc) => {
    setPopup({ key: `${cat.id}__${doc}`, doc, cat });
  };

  const handleUpload = () => {
    if (!popup) return;
    setUploaded(prev => ({ ...prev, [popup.key]: true }));
    setPopup(null);
  };

  const handleNext = () => {
    navigation.navigate('EnquiryStep3', {
      step1: route.params?.step1,
      step2: route.params?.step2,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a3a6b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Enquiry</Text>
        <Text style={styles.step}>Step 2.5 of 3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="folder-open-outline" size={28} color="#1a3a6b" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Upload Documents</Text>
            <Text style={styles.heroSub}>Optional · Tap any document to upload</Text>
          </View>
          {uploadedCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{uploadedCount}</Text>
            </View>
          )}
        </View>

        {/* Categories */}
        {DOC_CATEGORIES.map(cat => (
          <View key={cat.id} style={styles.catCard}>
            <View style={styles.catHeader}>
              <View style={[styles.catIconWrap, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon} size={18} color={cat.color} />
              </View>
              <Text style={[styles.catTitle, { color: cat.color }]}>{cat.title}</Text>
            </View>
            {cat.docs.map((doc, idx) => {
              const key = `${cat.id}__${doc}`;
              const done = !!uploaded[key];
              const isLast = idx === cat.docs.length - 1;
              return (
                <TouchableOpacity
                  key={doc}
                  style={[styles.docRow, !isLast && styles.docRowBorder]}
                  onPress={() => !done && openPopup(cat, doc)}
                  activeOpacity={done ? 1 : 0.7}
                >
                  <View style={[styles.docIconWrap, { backgroundColor: done ? cat.bg : '#f5f7fa' }]}>
                    <Ionicons
                      name={done ? 'checkmark-circle' : 'document-outline'}
                      size={18}
                      color={done ? cat.color : '#bbb'}
                    />
                  </View>
                  <Text style={[styles.docLabel, done && { color: cat.color }]}>{doc}</Text>
                  {done ? (
                    <View style={[styles.pill, { backgroundColor: cat.bg }]}>
                      <Text style={[styles.pillText, { color: cat.color }]}>Uploaded</Text>
                    </View>
                  ) : (
                    <View style={styles.pillOutline}>
                      <Ionicons name="cloud-upload-outline" size={12} color="#aaa" />
                      <Text style={styles.pillOutlineText}>Upload</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <Text style={styles.skipNote}>This step is optional. You can skip and proceed to vehicle details.</Text>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextBtnText}>
            {uploadedCount > 0 ? `Continue  ·  ${uploadedCount} uploaded` : 'Skip & Continue'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={handleNext}>
          <Text style={styles.skipBtnText}>Skip for now</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Upload Popup */}
      <Modal visible={!!popup} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setPopup(null)}>
          <TouchableOpacity style={styles.popupCard} activeOpacity={1} onPress={() => {}}>
            {/* handle bar */}
            <View style={styles.handle} />

            <View style={[styles.popupIconWrap, { backgroundColor: popup?.cat?.bg || '#eef2fb' }]}>
              <Ionicons name="cloud-upload-outline" size={26} color={popup?.cat?.color || '#1a3a6b'} />
            </View>

            <Text style={styles.popupTitle}>{popup?.doc}</Text>
            <Text style={styles.popupSub}>{popup?.cat?.title}</Text>

            <View style={styles.popupOptions}>
              <TouchableOpacity style={styles.optionBtn} onPress={handleUpload}>
                <Ionicons name="camera-outline" size={20} color="#1a3a6b" />
                <Text style={styles.optionText}>Camera</Text>
              </TouchableOpacity>
              <View style={styles.optionDivider} />
              <TouchableOpacity style={styles.optionBtn} onPress={handleUpload}>
                <Ionicons name="image-outline" size={20} color="#1a3a6b" />
                <Text style={styles.optionText}>Gallery</Text>
              </TouchableOpacity>
              <View style={styles.optionDivider} />
              <TouchableOpacity style={styles.optionBtn} onPress={handleUpload}>
                <Ionicons name="document-attach-outline" size={20} color="#1a3a6b" />
                <Text style={styles.optionText}>Files</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.uploadBtn, { backgroundColor: popup?.cat?.color || '#1a3a6b' }]}
              onPress={handleUpload}
            >
              <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
              <Text style={styles.uploadBtnText}>Upload Document</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setPopup(null)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1a3a6b' },
  step: { fontSize: 12, color: '#888', fontWeight: '600' },
  scroll: { padding: 20, paddingBottom: 48 },

  heroBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 16, padding: 18,
    marginBottom: 16, borderWidth: 1, borderColor: '#dde8f8',
    shadowColor: '#1a3a6b', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  heroIconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: '#eef2fb', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  heroTitle: { fontSize: 16, fontWeight: '800', color: '#1a3a6b', marginBottom: 3 },
  heroSub: { fontSize: 12, color: '#7a90b8', lineHeight: 17 },
  countBadge: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#1a3a6b', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  countBadgeText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  catCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#e8eef5',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  catHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: 12, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#f0f4f8',
  },
  catIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  catTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.2 },

  docRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12,
  },
  docRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f5f7fa' },
  docIconWrap: {
    width: 34, height: 34, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  docLabel: { flex: 1, fontSize: 14, color: '#333', fontWeight: '500' },
  pill: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, flexShrink: 0,
  },
  pillText: { fontSize: 11, fontWeight: '700' },
  pillOutline: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1, borderColor: '#ddd',
    backgroundColor: '#fafafa', flexShrink: 0,
  },
  pillOutlineText: { fontSize: 11, fontWeight: '600', color: '#aaa' },

  skipNote: {
    textAlign: 'center', fontSize: 12, color: '#aaa',
    marginBottom: 16, marginTop: 4,
  },
  nextBtn: {
    backgroundColor: '#1a3a6b', borderRadius: 12, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginBottom: 12,
    shadowColor: '#1a3a6b', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
  },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  skipBtn: { alignItems: 'center', paddingVertical: 12 },
  skipBtnText: { fontSize: 14, color: '#999', fontWeight: '600' },

  // Popup
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  popupCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
    alignItems: 'center', gap: 6,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#e0e0e0', marginBottom: 16,
  },
  popupIconWrap: {
    width: 60, height: 60, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  popupTitle: { fontSize: 17, fontWeight: '800', color: '#1a1a2e', textAlign: 'center' },
  popupSub: { fontSize: 12, color: '#999', marginBottom: 16 },

  popupOptions: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f7fa', borderRadius: 14,
    width: '100%', marginBottom: 16, overflow: 'hidden',
  },
  optionBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, gap: 6,
  },
  optionText: { fontSize: 12, fontWeight: '600', color: '#1a3a6b' },
  optionDivider: { width: 1, height: 40, backgroundColor: '#e0e0e0' },

  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, width: '100%', borderRadius: 12,
    paddingVertical: 15, marginBottom: 4,
  },
  uploadBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  cancelBtn: { paddingVertical: 10, width: '100%', alignItems: 'center' },
  cancelBtnText: { fontSize: 14, color: '#aaa', fontWeight: '600' },
});
