import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TENURE_OPTIONS = [12, 24, 36, 48, 60, 72, 84];

function fmtINR(n) {
  if (!n) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
}

export default function EnquiryStep3Screen({ route, navigation }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [tenure, setTenure] = useState(60);

  const price = parseFloat(vehiclePrice) || 0;
  const dp = parseFloat(downPayment) || 0;
  const loanAmount = Math.max(0, price - dp);
  const isValid = make.trim() && model.trim() && variant.trim() && price > 0 && dp > 0 && loanAmount > 0;

  const [showCibilModal, setShowCibilModal] = useState(false);
  const [cibilInput, setCibilInput] = useState('');
  const [fieldError, setFieldError] = useState('');

  const handleRecommend = () => {
    if (!make.trim() || !model.trim() || !variant.trim() || price <= 0 || dp <= 0 || loanAmount <= 0) {
      setFieldError('Please fill in Vehicle Model, On-Road Price, and Down Payment to continue.');
      return;
    }
    setFieldError('');
    const cibil = route.params?.step2?.cibilScore;
    if (!cibil) {
      setShowCibilModal(true);
    } else {
      goToBanks(cibil);
    }
  };

  const confirmCibil = () => {
    if (!cibilInput) return;
    setShowCibilModal(false);
    goToBanks(cibilInput);
  };

  const goToBanks = (cibilScore) => {
    navigation.navigate('RecommendBanks', {
      step1: route.params?.step1,
      step2: { ...route.params?.step2, cibilScore },
      step3: { make, model, variant, vehiclePrice: price, downPayment: dp, loanAmount, tenure },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Modal visible={showCibilModal} transparent animationType="fade">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="alert-circle" size={32} color="#b07d1a" />
            </View>
            <Text style={styles.modalTitle}>CIBIL Score Required</Text>
            <Text style={styles.modalSub}>
              You didn't enter a CIBIL score. Please enter it now to see bank recommendations.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 750"
              placeholderTextColor="#aaa"
              keyboardType="number-pad"
              maxLength={3}
              value={cibilInput}
              onChangeText={v => setCibilInput(v.replace(/\D/g, ''))}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.modalBtn, !cibilInput && styles.modalBtnDisabled]}
              onPress={confirmCibil}
              disabled={!cibilInput}
            >
              <Text style={styles.modalBtnText}>Continue to Recommendations</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a3a6b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Enquiry</Text>
        <Text style={styles.step}>Step 3 of 3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <Field label="Make">
          <TextInput
            style={styles.input}
            placeholder="e.g. Toyota"
            placeholderTextColor="#aaa"
            value={make}
            onChangeText={setMake}
          />
        </Field>

        <Field label="Model">
          <TextInput
            style={styles.input}
            placeholder="e.g. Hyryder"
            placeholderTextColor="#aaa"
            value={model}
            onChangeText={setModel}
          />
        </Field>

        <Field label="Variant">
          <TextInput
            style={styles.input}
            placeholder="e.g. S Hybrid"
            placeholderTextColor="#aaa"
            value={variant}
            onChangeText={setVariant}
          />
        </Field>

        <Field label="On-Road Price (₹)">
          <TextInput
            style={styles.input}
            placeholder="e.g. 24,26,497"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={vehiclePrice}
            onChangeText={v => setVehiclePrice(v.replace(/\D/g, ''))}
          />
        </Field>

        <Field label="Down Payment (₹)">
          <TextInput
            style={styles.input}
            placeholder="e.g. 5,00,000"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={downPayment}
            onChangeText={v => setDownPayment(v.replace(/\D/g, ''))}
          />
        </Field>

        <Field label="Preferred Tenure (Months)">
          <View style={styles.tenureRow}>
            {TENURE_OPTIONS.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.tenureChip, tenure === t && styles.tenureChipActive]}
                onPress={() => setTenure(t)}
              >
                <Text style={[styles.tenureText, tenure === t && styles.tenureTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Field>

        {/* Loan preview — only shows once both fields are filled */}
        {price > 0 && dp > 0 && (
          <View style={styles.loanPreview}>
            <View style={styles.loanPreviewRow}>
              <Text style={styles.loanPreviewLabel}>On-Road Price</Text>
              <Text style={styles.loanPreviewVal}>{fmtINR(price)}</Text>
            </View>
            <View style={styles.loanPreviewRow}>
              <Text style={styles.loanPreviewLabel}>Down Payment</Text>
              <Text style={styles.loanPreviewVal}>− {fmtINR(dp)}</Text>
            </View>
            <View style={styles.loanPreviewDivider} />
            <View style={styles.loanPreviewRow}>
              <Text style={styles.loanPreviewLabelBold}>Loan Amount</Text>
              <Text style={styles.loanPreviewTotal}>{fmtINR(loanAmount)}</Text>
            </View>
            <View style={styles.loanPreviewRow}>
              <Text style={styles.loanPreviewLabel}>Preferred Tenure</Text>
              <Text style={styles.loanPreviewVal}>{tenure} months</Text>
            </View>
          </View>
        )}

        {fieldError ? (
          <View style={styles.fieldErrorBox}>
            <Ionicons name="alert-circle-outline" size={15} color="#b03a2e" />
            <Text style={styles.fieldErrorText}>{fieldError}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleRecommend}
        >
          <Ionicons name="business-outline" size={20} color="#fff" />
          <Text style={styles.submitBtnText}>View Bank Recommendations</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
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
  scroll: { padding: 20, paddingBottom: 40 },

  fieldWrap: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ddd',
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#111',
  },

  tenureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tenureChip: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff',
  },
  tenureChipActive: { backgroundColor: '#1a3a6b', borderColor: '#1a3a6b' },
  tenureText: { fontSize: 14, color: '#555', fontWeight: '600' },
  tenureTextActive: { color: '#fff' },

  loanPreview: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 18, marginBottom: 20,
    borderWidth: 1, borderColor: '#e0e8f0',
    gap: 10,
  },
  loanPreviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  loanPreviewLabel: { fontSize: 13, color: '#888', fontWeight: '500' },
  loanPreviewLabelBold: { fontSize: 14, color: '#111', fontWeight: '700' },
  loanPreviewVal: { fontSize: 13, color: '#333', fontWeight: '600' },
  loanPreviewTotal: { fontSize: 18, color: '#1a3a6b', fontWeight: '900' },
  loanPreviewDivider: { height: 1, backgroundColor: '#eee' },

  submitBtn: {
    backgroundColor: '#1a3a6b', borderRadius: 12, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#1a3a6b', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
  },
  btnDisabled: { opacity: 0.45 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  fieldErrorBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#fdf0ee', borderRadius: 10, padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: '#f5c6c0',
  },
  fieldErrorText: { flex: 1, fontSize: 13, color: '#b03a2e', fontWeight: '500', lineHeight: 18 },

  // CIBIL modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center', padding: 28,
  },
  modalCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 28,
    width: '100%', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 20, elevation: 10,
  },
  modalIconWrap: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#fff8e1', alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1a3a6b', textAlign: 'center' },
  modalSub: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 20 },
  modalInput: {
    width: '100%', backgroundColor: '#f5f7fa',
    borderRadius: 12, borderWidth: 1.5, borderColor: '#dde3f0',
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 22, fontWeight: '800', color: '#1a3a6b',
    textAlign: 'center', marginTop: 4,
  },
  modalBtn: {
    width: '100%', backgroundColor: '#1a3a6b',
    borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 4,
  },
  modalBtnDisabled: { opacity: 0.4 },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
