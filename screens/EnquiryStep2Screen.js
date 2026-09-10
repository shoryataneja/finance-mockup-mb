import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PROFILES = ['Salaried', 'Business', 'Self Employee', 'Company', 'Agriculture'];
const OFFICE_STATUS = ['Company Owned', 'Self Owned'];
const INCOME_PROFILE = ['Income Proof', 'No Income Proof'];
const PROOF_OPTIONS = ['ITR', 'Form 16', 'Rental Agreement', 'GST Certificate', 'ETC'];
const TRACK_STATUS = ['Good', 'Bad'];
const ADDITIONAL_INCOME_SOURCES = ['Income from House Property', 'Agriculture', 'Co-Applicant Income'];

export default function EnquiryStep2Screen({ route, navigation }) {
  const [form, setForm] = useState({
    profile: '',
    yearsInJob: '',
    officeStatus: '',
    incomeProfile: '',
    proofOfIncome: '',
    ifAvailable: [],
    accountBank: '',
    existingVehicle: '',
    model: '',
    trackStatus: '',
    incomePerMonth: '',
    existingEmiTotal: '',
    foir: '',
    cibilScore: '',
    additionalIncome: '',
    additionalIncomeSource: [],
    additionalIncomeAmount: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleArr = (key, val) => {
    setForm(f => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  // Auto-calculate FOIR
  useEffect(() => {
    const income = parseFloat(form.incomePerMonth);
    const emi = parseFloat(form.existingEmiTotal);
    if (income > 0 && emi >= 0) {
      set('foir', ((emi / income) * 100).toFixed(1) + '%');
    } else {
      set('foir', '');
    }
  }, [form.incomePerMonth, form.existingEmiTotal]);

  const isValid =
    form.profile && form.yearsInJob && form.officeStatus && form.incomeProfile &&
    form.proofOfIncome && form.accountBank && form.existingVehicle && form.model &&
    form.trackStatus && form.incomePerMonth && form.existingEmiTotal &&
    form.additionalIncome &&
    (form.proofOfIncome === 'Not Available' || form.ifAvailable.length > 0) &&
    (form.additionalIncome === 'No' || (form.additionalIncomeSource.length > 0 && form.additionalIncomeAmount));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a3a6b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Enquiry</Text>
        <Text style={styles.step}>Step 2 of 3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <Field label="Profile">
          <View style={styles.chipRow}>
            {PROFILES.map(p => (
              <Chip key={p} label={p} active={form.profile === p} onPress={() => set('profile', p)} />
            ))}
          </View>
        </Field>

        <Field label="No. of Years in Current Job / Business">
          <TextInput
            style={styles.input}
            placeholder="e.g. 10"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={form.yearsInJob}
            onChangeText={v => set('yearsInJob', v.replace(/\D/g, ''))}
          />
        </Field>

        <Field label="Office Address Status">
          <View style={styles.chipRow}>
            {OFFICE_STATUS.map(o => (
              <Chip key={o} label={o} active={form.officeStatus === o} onPress={() => set('officeStatus', o)} />
            ))}
          </View>
        </Field>

        <Field label="Income Profile">
          <View style={styles.chipRow}>
            {INCOME_PROFILE.map(i => (
              <Chip key={i} label={i} active={form.incomeProfile === i} onPress={() => set('incomeProfile', i)} />
            ))}
          </View>
        </Field>

        <Field label="Proof of Income">
          <View style={styles.chipRow}>
            {['Available', 'Not Available'].map(p => (
              <Chip key={p} label={p} active={form.proofOfIncome === p} onPress={() => set('proofOfIncome', p)} />
            ))}
          </View>
        </Field>

        {form.proofOfIncome === 'Available' && (
          <Field label="If Available">
            <View style={styles.chipRow}>
              {PROOF_OPTIONS.map(p => (
                <Chip key={p} label={p} active={form.ifAvailable.includes(p)} onPress={() => toggleArr('ifAvailable', p)} />
              ))}
            </View>
          </Field>
        )}

        <Field label="Account Holding Bank">
          <TextInput
            style={styles.input}
            placeholder="e.g. Federal Bank"
            placeholderTextColor="#aaa"
            value={form.accountBank}
            onChangeText={v => set('accountBank', v)}
          />
        </Field>

        <Field label="Existing Vehicle">
          <TextInput
            style={styles.input}
            placeholder="e.g. Yaris"
            placeholderTextColor="#aaa"
            value={form.existingVehicle}
            onChangeText={v => set('existingVehicle', v)}
          />
        </Field>

        <Field label="Model (Year)">
          <TextInput
            style={styles.input}
            placeholder="e.g. 2020"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={form.model}
            onChangeText={v => set('model', v.replace(/\D/g, ''))}
          />
        </Field>

        <Field label="Track Status">
          <View style={styles.chipRow}>
            {TRACK_STATUS.map(t => (
              <Chip key={t} label={t} active={form.trackStatus === t} onPress={() => set('trackStatus', t)} />
            ))}
          </View>
        </Field>

        <Field label="Income Per Month (₹)">
          <TextInput
            style={styles.input}
            placeholder="e.g. 81000"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={form.incomePerMonth}
            onChangeText={v => set('incomePerMonth', v.replace(/\D/g, ''))}
          />
        </Field>

        <Field label="Existing EMI's Total (₹)">
          <TextInput
            style={styles.input}
            placeholder="e.g. 27000"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={form.existingEmiTotal}
            onChangeText={v => set('existingEmiTotal', v.replace(/\D/g, ''))}
          />
        </Field>

        <Field label="FOIR (Auto Calculated)">
          <View style={[styles.input, styles.readOnly]}>
            <Text style={form.foir ? styles.foir : styles.placeholder}>
              {form.foir || 'Fill income & EMI to calculate'}
            </Text>
          </View>
        </Field>

        <Field label="CIBIL Score ">
          <TextInput
            style={styles.input}
            placeholder="e.g. 786"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={form.cibilScore}
            onChangeText={v => set('cibilScore', v.replace(/\D/g, ''))}
          />
        </Field>

        <Field label="Additional Income if Any">
          <View style={styles.chipRow}>
            {['Yes', 'No'].map(v => (
              <Chip key={v} label={v} active={form.additionalIncome === v} onPress={() => set('additionalIncome', v)} />
            ))}
          </View>
        </Field>

        {form.additionalIncome === 'Yes' && (
          <>
            <Field label="Additional Income Source">
              <View style={styles.chipRow}>
                {ADDITIONAL_INCOME_SOURCES.map(s => (
                  <Chip key={s} label={s} active={form.additionalIncomeSource.includes(s)} onPress={() => toggleArr('additionalIncomeSource', s)} />
                ))}
              </View>
            </Field>

            <Field label="Additional Income Amount (₹)">
              <TextInput
                style={styles.input}
                placeholder="e.g. 15000"
                placeholderTextColor="#aaa"
                keyboardType="number-pad"
                value={form.additionalIncomeAmount}
                onChangeText={v => set('additionalIncomeAmount', v.replace(/\D/g, ''))}
              />
            </Field>
          </>
        )}

        <TouchableOpacity
          style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]}
          disabled={!isValid}
          onPress={() => navigation.navigate('EnquiryStep3', { step1: route.params?.step1, step2: form })}
        >
          <Text style={styles.nextBtnText}>Check Eligibility</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
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

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
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
  fieldWrap: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  input: {
    backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ddd',
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111',
  },
  readOnly: { backgroundColor: '#f5f5f5' },
  foir: { fontSize: 15, color: '#1a3a6b', fontWeight: '700' },
  placeholder: { fontSize: 15, color: '#aaa' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#1a3a6b', borderColor: '#1a3a6b' },
  chipText: { fontSize: 13, color: '#555', fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  nextBtn: {
    backgroundColor: '#1a3a6b', borderRadius: 12, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 10,
  },
  nextBtnDisabled: { opacity: 0.45 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
