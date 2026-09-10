import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, Modal, Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL = ['Single', 'Married', 'Divorced', 'Widowed'];

export default function EnquiryStep1Screen({ navigation }) {
  const [form, setForm] = useState({
    name: '', dob: '', age: '', gender: '',
    marital: '', address: '', residence: '',
    yearsAtAddress: '', yearsAtCity: '',
  });
  const [showCal, setShowCal] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleDOB = (day) => {
    set('dob', day.dateString);
    setShowCal(false);
  };

  const isValid = Object.values(form).every(v => v !== '');

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Home' })}>
          <Ionicons name="arrow-back" size={24} color="#1a3a6b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Enquiry</Text>
        <Text style={styles.step}>Step 1 of 3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Field label="Full Name">
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            placeholderTextColor="#aaa"
            value={form.name}
            onChangeText={v => set('name', v)}
          />
        </Field>

        <Field label="Date of Birth">
          <TouchableOpacity style={styles.input} onPress={() => setShowCal(true)} activeOpacity={0.7}>
            <Text style={form.dob ? styles.inputText : styles.placeholder}>
              {form.dob || 'Select date of birth'}
            </Text>
            <Ionicons name="calendar-outline" size={18} color="#888" />
          </TouchableOpacity>
        </Field>

        <Field label="Age">
          <TextInput
            style={styles.input}
            placeholder="Enter age"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={form.age}
            onChangeText={v => set('age', v.replace(/\D/g, ''))}
          />
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

        <Field label="No. of Years at Residence Address">
          <TextInput
            style={styles.input}
            placeholder="e.g. 5"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={form.yearsAtAddress}
            onChangeText={v => set('yearsAtAddress', v.replace(/\D/g, ''))}
          />
        </Field>

        <Field label="Years at Current City">
          <TextInput
            style={styles.input}
            placeholder="e.g. 10"
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            value={form.yearsAtCity}
            onChangeText={v => set('yearsAtCity', v.replace(/\D/g, ''))}
          />
        </Field>

        <TouchableOpacity
          style={[styles.nextBtn, !isValid && styles.nextBtnDisabled]}
          disabled={!isValid}
          onPress={() => navigation.navigate('EnquiryStep2', { step1: form })}
        >
          <Text style={styles.nextBtnText}>Next</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </ScrollView>

      {/* Calendar Modal */}
      <Modal visible={showCal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCal(false)} />
        <View style={styles.calendarSheet}>
          <Text style={styles.calTitle}>Select Date of Birth</Text>
          <Calendar
            onDayPress={handleDOB}
            markedDates={form.dob ? { [form.dob]: { selected: true, selectedColor: '#1a3a6b' } } : {}}
            maxDate={new Date().toISOString().split('T')[0]}
            theme={{
              todayTextColor: '#1a3a6b',
              arrowColor: '#1a3a6b',
              selectedDayBackgroundColor: '#1a3a6b',
            }}
          />
        </View>
      </Modal>
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
  fieldWrap: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 6 },
  input: {
    backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#ddd',
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  inputText: { fontSize: 15, color: '#111' },
  placeholder: { fontSize: 15, color: '#aaa' },
  multiline: { height: 80, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#1a3a6b', borderColor: '#1a3a6b' },
  chipText: { fontSize: 14, color: '#555', fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  nextBtn: {
    backgroundColor: '#1a3a6b', borderRadius: 12, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 10,
  },
  nextBtnDisabled: { opacity: 0.45 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  calendarSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 36,
  },
  calTitle: { fontSize: 16, fontWeight: '700', color: '#1a3a6b', marginBottom: 10, textAlign: 'center' },
});
