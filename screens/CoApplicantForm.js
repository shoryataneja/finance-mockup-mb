import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RELATIONS = ['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Father-in-Law', 'Mother-in-Law'];
const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL = ['Single', 'Married', 'Divorced', 'Widowed'];
const PROFILES = ['Salaried', 'Business', 'Self Employee', 'Agriculture'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => currentYear - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

function calcAge(day, month, year) {
  const today = new Date();
  let age = today.getFullYear() - year;
  const m = today.getMonth() - month;
  if (m < 0 || (m === 0 && today.getDate() < day)) age--;
  return age > 0 ? String(age) : '';
}

export default function CoApplicantForm({ value, onChange }) {
  const form = value;
  const set = (key, val) => onChange({ ...form, [key]: val });

  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [pickerDay, setPickerDay] = useState(1);
  const [pickerMonth, setPickerMonth] = useState(0);
  const [pickerYear, setPickerYear] = useState(1990);

  const confirmDOB = () => {
    const dd = String(pickerDay).padStart(2, '0');
    const mm = String(pickerMonth + 1).padStart(2, '0');
    const display = `${dd} ${MONTHS[pickerMonth]} ${pickerYear}`;
    const age = calcAge(pickerDay, pickerMonth, pickerYear);
    onChange({ ...form, dob: display, age });
    setShowDOBPicker(false);
  };

  // Auto-calculate FOIR
  useEffect(() => {
    const income = parseFloat(form.incomePerMonth);
    const emi = parseFloat(form.existingEmi);
    if (income > 0 && emi >= 0) {
      set('foir', ((emi / income) * 100).toFixed(1) + '%');
    } else {
      set('foir', '');
    }
  }, [form.incomePerMonth, form.existingEmi]);

  return (
    <View style={styles.container}>

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <Ionicons name="people" size={18} color="#1a3a6b" />
        </View>
        <View>
          <Text style={styles.sectionTitle}>Co-Applicant Details</Text>
          <Text style={styles.sectionSub}>All fields are required</Text>
        </View>
      </View>

      {/* Relationship */}
      <Field label="Relationship with Applicant">
        <View style={styles.chipRow}>
          {RELATIONS.map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.chip, form.relation === r && styles.chipActive]}
              onPress={() => set('relation', r)}
            >
              <Text style={[styles.chipText, form.relation === r && styles.chipTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Field>

      {/* Personal Details sub-header */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>PERSONAL DETAILS</Text>
      </View>

      <Field label="Full Name">
        <TextInput
          style={styles.input}
          placeholder="Enter co-applicant full name"
          placeholderTextColor="#aaa"
          value={form.name}
          onChangeText={v => set('name', v)}
        />
      </Field>

      <Field label="Mobile Number">
        <TextInput
          style={styles.input}
          placeholder="e.g. 98201 34567"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          maxLength={10}
          value={form.mobile}
          onChangeText={v => set('mobile', v.replace(/\D/g, ''))}
        />
      </Field>

      <Field label="Date of Birth">
        <TouchableOpacity style={styles.inputRow} onPress={() => setShowDOBPicker(true)} activeOpacity={0.7}>
          <Text style={form.dob ? styles.inputText : styles.placeholder}>
            {form.dob || 'Select date of birth'}
          </Text>
          <Ionicons name="calendar-outline" size={18} color="#888" />
        </TouchableOpacity>
      </Field>

      <Field label="Age">
        <View style={[styles.inputRow, styles.readOnly]}>
          <Text style={form.age ? styles.inputText : styles.placeholder}>
            {form.age ? `${form.age} years` : 'Auto-filled from DOB'}
          </Text>
        </View>
      </Field>

      <Field label="Gender">
        <View style={styles.chipRow}>
          {GENDERS.map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, form.gender === g && styles.chipActive]}
              onPress={() => set('gender', g)}
            >
              <Text style={[styles.chipText, form.gender === g && styles.chipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Field>

      <Field label="Marital Status">
        <View style={styles.chipRow}>
          {MARITAL.map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.chip, form.marital === m && styles.chipActive]}
              onPress={() => set('marital', m)}
            >
              <Text style={[styles.chipText, form.marital === m && styles.chipTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Field>

      <Field label="Address">
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Enter full address"
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={3}
          value={form.address}
          onChangeText={v => set('address', v)}
        />
      </Field>

      <Field label="Residence Status">
        <View style={styles.chipRow}>
          {['Own', 'Rented'].map(r => (
            <TouchableOpacity
              key={r}
              style={[styles.chip, form.residence === r && styles.chipActive]}
              onPress={() => set('residence', r)}
            >
              <Text style={[styles.chipText, form.residence === r && styles.chipTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Field>

      {/* Employment & Income sub-header */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>EMPLOYMENT & INCOME</Text>
      </View>

      <Field label="Employment Profile">
        <View style={styles.chipRow}>
          {PROFILES.map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.chip, form.profile === p && styles.chipActive]}
              onPress={() => set('profile', p)}
            >
              <Text style={[styles.chipText, form.profile === p && styles.chipTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Field>

      <Field label="Employer / Business Name">
        <TextInput
          style={styles.input}
          placeholder="e.g. Infosys Ltd"
          placeholderTextColor="#aaa"
          value={form.employer}
          onChangeText={v => set('employer', v)}
        />
      </Field>

      <Field label="Years in Job / Business">
        <TextInput
          style={styles.input}
          placeholder="e.g. 5"
          placeholderTextColor="#aaa"
          keyboardType="number-pad"
          value={form.yearsInJob}
          onChangeText={v => set('yearsInJob', v.replace(/\D/g, ''))}
        />
      </Field>

      <Field label="Monthly Income (₹)">
        <TextInput
          style={styles.input}
          placeholder="e.g. 55000"
          placeholderTextColor="#aaa"
          keyboardType="number-pad"
          value={form.incomePerMonth}
          onChangeText={v => set('incomePerMonth', v.replace(/\D/g, ''))}
        />
      </Field>

      <Field label="Existing EMIs Total (₹)">
        <TextInput
          style={styles.input}
          placeholder="e.g. 8000"
          placeholderTextColor="#aaa"
          keyboardType="number-pad"
          value={form.existingEmi}
          onChangeText={v => set('existingEmi', v.replace(/\D/g, ''))}
        />
      </Field>

      <Field label="FOIR (Auto Calculated)">
        <View style={[styles.inputRow, styles.readOnly]}>
          <Text style={form.foir ? styles.foirText : styles.placeholder}>
            {form.foir || 'Fill income & EMI to calculate'}
          </Text>
        </View>
      </Field>

      <Field label="CIBIL Score">
        <TextInput
          style={styles.input}
          placeholder="e.g. 740"
          placeholderTextColor="#aaa"
          keyboardType="number-pad"
          maxLength={3}
          value={form.cibil}
          onChangeText={v => set('cibil', v.replace(/\D/g, ''))}
        />
      </Field>

      {/* DOB Picker Modal */}
      <Modal visible={showDOBPicker} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDOBPicker(false)} />
        <View style={styles.calSheet}>
          <Text style={styles.calTitle}>Co-Applicant Date of Birth</Text>
          <View style={styles.pickerRow}>
            <View style={styles.pickerCol}>
              <Text style={styles.pickerColLabel}>Day</Text>
              <FlatList
                data={DAYS}
                keyExtractor={i => String(i)}
                style={styles.pickerList}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={pickerDay - 1}
                getItemLayout={(_, i) => ({ length: 44, offset: 44 * i, index: i })}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.pickerItem, pickerDay === item && styles.pickerItemActive]}
                    onPress={() => setPickerDay(item)}
                  >
                    <Text style={[styles.pickerItemText, pickerDay === item && styles.pickerItemTextActive]}>
                      {String(item).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={styles.pickerCol}>
              <Text style={styles.pickerColLabel}>Month</Text>
              <FlatList
                data={MONTHS}
                keyExtractor={m => m}
                style={styles.pickerList}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={pickerMonth}
                getItemLayout={(_, i) => ({ length: 44, offset: 44 * i, index: i })}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[styles.pickerItem, pickerMonth === index && styles.pickerItemActive]}
                    onPress={() => setPickerMonth(index)}
                  >
                    <Text style={[styles.pickerItemText, pickerMonth === index && styles.pickerItemTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={styles.pickerCol}>
              <Text style={styles.pickerColLabel}>Year</Text>
              <FlatList
                data={YEARS}
                keyExtractor={y => String(y)}
                style={styles.pickerList}
                showsVerticalScrollIndicator={false}
                initialScrollIndex={YEARS.indexOf(pickerYear)}
                getItemLayout={(_, i) => ({ length: 44, offset: 44 * i, index: i })}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.pickerItem, pickerYear === item && styles.pickerItemActive]}
                    onPress={() => setPickerYear(item)}
                  >
                    <Text style={[styles.pickerItemText, pickerYear === item && styles.pickerItemTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.confirmBtn} onPress={confirmDOB}>
            <Text style={styles.confirmBtnText}>Confirm Date of Birth</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
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
  container: { marginTop: 4 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#e8eef7', borderRadius: 12,
    padding: 14, marginBottom: 20,
  },
  sectionIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1a3a6b' },
  sectionSub: { fontSize: 12, color: '#6b8ab8', marginTop: 1 },

  subHeader: {
    borderLeftWidth: 3, borderLeftColor: '#1a3a6b',
    paddingLeft: 10, marginBottom: 14, marginTop: 6,
  },
  subHeaderText: { fontSize: 11, fontWeight: '800', color: '#1a3a6b', letterSpacing: 0.8 },

  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },

  input: {
    backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ddd',
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111',
  },
  inputRow: {
    backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ddd',
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  inputText: { fontSize: 15, color: '#111' },
  placeholder: { fontSize: 15, color: '#aaa' },
  readOnly: { backgroundColor: '#f5f5f5' },
  multiline: { height: 80, textAlignVertical: 'top' },
  foirText: { fontSize: 15, color: '#1a3a6b', fontWeight: '700' },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#1a3a6b', borderColor: '#1a3a6b' },
  chipText: { fontSize: 13, color: '#555', fontWeight: '500' },
  chipTextActive: { color: '#fff' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  calSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 36,
  },
  calTitle: { fontSize: 16, fontWeight: '700', color: '#1a3a6b', marginBottom: 16, textAlign: 'center' },
  pickerRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  pickerCol: { flex: 1, alignItems: 'center' },
  pickerColLabel: { fontSize: 11, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  pickerList: { height: 220, width: '100%' },
  pickerItem: { height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginHorizontal: 2 },
  pickerItemActive: { backgroundColor: '#1a3a6b' },
  pickerItemText: { fontSize: 15, color: '#444', fontWeight: '500' },
  pickerItemTextActive: { color: '#fff', fontWeight: '700' },
  confirmBtn: { backgroundColor: '#1a3a6b', borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
