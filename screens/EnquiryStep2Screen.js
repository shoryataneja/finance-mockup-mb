import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, Modal, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EMPTY_COAPPLICANT = {
  relation: '', name: '', mobile: '', dob: '', age: '',
  gender: '', marital: '', address: '', residence: '',
  profile: '', employer: '', yearsInJob: '',
  incomePerMonth: '', existingEmi: '', foir: '', cibil: '',
};

const PROFILES = ['Salaried', 'Business', 'Self Employee', 'Company', ];
const PROFESSIONS = ['Rental Income', 'Driver Cum Owner', 'Water Supply', 'Real Estate', 'Doctor', 'Lawyer', 'Material Supply', 'Auditors', 'Chartered Accountant', 'Trader', 'Commission Agent', 'Restaurant', 'Agriculture'];
const OFFICE_STATUS = ['Company Owned', 'Self Owned'];
const INCOME_PROFILE = ['Income Proof', 'No Income Proof'];
const PROOF_OPTIONS = ['ITR', 'Form 16', 'Rental Agreement', 'ETC'];
const TRACK_STATUS = ['Good', 'Bad'];
const ADDITIONAL_INCOME_SOURCES = ['Income from House Property', 'Agriculture', 'Co-Applicant Income'];
const CO_RELATIONS = ['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Father-in-Law', 'Mother-in-Law'];
const CO_GENDERS = ['Male', 'Female', 'Other'];
const CO_MARITAL = ['Single', 'Married', 'Divorced', 'Widowed'];
const CO_PROFILES = ['Salaried', 'Business', 'Self Employee', ];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => currentYear - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

function isCoApplicantComplete(c) {
  return !!(
    c.relation && c.name && c.mobile && c.dob && c.gender &&
    c.marital && c.address && c.residence && c.profile &&
    c.employer && c.yearsInJob && c.incomePerMonth && c.existingEmi && c.cibil
  );
}

export default function EnquiryStep2Screen({ route, navigation }) {
  const [form, setForm] = useState({
    profile: '',
    profession: '',
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
    coApplicant: { ...EMPTY_COAPPLICANT },
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setCA = (key, val) => setForm(f => ({ ...f, coApplicant: { ...f.coApplicant, [key]: val } }));

  const toggleArr = (key, val) => {
    setForm(f => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [pickerDay, setPickerDay] = useState(1);
  const [pickerMonth, setPickerMonth] = useState(0);
  const [pickerYear, setPickerYear] = useState(1990);

  const confirmCoDOB = () => {
    const dd = String(pickerDay).padStart(2, '0');
    const display = `${dd} ${MONTHS[pickerMonth]} ${pickerYear}`;
    const today = new Date();
    let age = today.getFullYear() - pickerYear;
    if (today.getMonth() < pickerMonth || (today.getMonth() === pickerMonth && today.getDate() < pickerDay)) age--;
    setCA('dob', display);
    setCA('age', age > 0 ? String(age) : '');
    setShowDOBPicker(false);
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
    form.profile && (form.profile !== 'Self Employee' || form.profession) &&
    form.yearsInJob && form.officeStatus && form.incomeProfile &&
    form.proofOfIncome && form.accountBank && form.existingVehicle && form.model &&
    form.trackStatus && form.incomePerMonth && form.existingEmiTotal &&
    form.additionalIncome &&
    (form.proofOfIncome === 'Not Available' || form.ifAvailable.length > 0) &&
    (form.additionalIncome === 'No' || (
      form.additionalIncomeSource.length > 0 &&
      form.additionalIncomeAmount &&
      (!form.additionalIncomeSource.includes('Co-Applicant Income') || isCoApplicantComplete(form.coApplicant))
    ));

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

        {form.profile === 'Self Employee' && (
          <Field label="Profession">
            <View style={styles.chipRow}>
              {PROFESSIONS.map(p => (
                <Chip key={p} label={p} active={form.profession === p} onPress={() => set('profession', p)} />
              ))}
            </View>
          </Field>
        )}

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

            {form.additionalIncomeSource.includes('Co-Applicant Income') && (
              <View style={styles.coApplicantWrap}>

                <View style={styles.coHeader}>
                  <View style={styles.coHeaderIcon}>
                    <Ionicons name="people" size={16} color="#1a3a6b" />
                  </View>
                  <View>
                    <Text style={styles.coHeaderTitle}>Co-Applicant Details</Text>
                    <Text style={styles.coHeaderSub}>Fill all details of the co-applicant</Text>
                  </View>
                </View>

                <Field label="Relationship with Applicant">
                  <View style={styles.chipRow}>
                    {CO_RELATIONS.map(r => (
                      <Chip key={r} label={r} active={form.coApplicant.relation === r} onPress={() => setCA('relation', r)} />
                    ))}
                  </View>
                </Field>

                <View style={styles.coSubHead}><Text style={styles.coSubHeadText}>PERSONAL DETAILS</Text></View>

                <Field label="Full Name">
                  <TextInput style={styles.input} placeholder="Co-applicant full name" placeholderTextColor="#aaa"
                    value={form.coApplicant.name} onChangeText={v => setCA('name', v)} />
                </Field>

                <Field label="Mobile Number">
                  <TextInput style={styles.input} placeholder="e.g. 98201 34567" placeholderTextColor="#aaa"
                    keyboardType="phone-pad" maxLength={10}
                    value={form.coApplicant.mobile} onChangeText={v => setCA('mobile', v.replace(/\D/g, ''))} />
                </Field>

                <Field label="Date of Birth">
                  <TouchableOpacity style={[styles.input, styles.inputRow]} onPress={() => setShowDOBPicker(true)} activeOpacity={0.7}>
                    <Text style={form.coApplicant.dob ? styles.inputText : styles.placeholder}>
                      {form.coApplicant.dob || 'Select date of birth'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color="#888" />
                  </TouchableOpacity>
                </Field>

                <Field label="Age">
                  <View style={[styles.input, styles.readOnly]}>
                    <Text style={form.coApplicant.age ? styles.inputText : styles.placeholder}>
                      {form.coApplicant.age ? `${form.coApplicant.age} years` : 'Auto-filled from DOB'}
                    </Text>
                  </View>
                </Field>

                <Field label="Gender">
                  <View style={styles.chipRow}>
                    {CO_GENDERS.map(g => (
                      <Chip key={g} label={g} active={form.coApplicant.gender === g} onPress={() => setCA('gender', g)} />
                    ))}
                  </View>
                </Field>

                <Field label="Marital Status">
                  <View style={styles.chipRow}>
                    {CO_MARITAL.map(m => (
                      <Chip key={m} label={m} active={form.coApplicant.marital === m} onPress={() => setCA('marital', m)} />
                    ))}
                  </View>
                </Field>

                <Field label="Address">
                  <TextInput style={[styles.input, styles.multiline]} placeholder="Enter full address"
                    placeholderTextColor="#aaa" multiline numberOfLines={3}
                    value={form.coApplicant.address} onChangeText={v => setCA('address', v)} />
                </Field>

                <Field label="Residence Status">
                  <View style={styles.chipRow}>
                    {['Own', 'Rented'].map(r => (
                      <Chip key={r} label={r} active={form.coApplicant.residence === r} onPress={() => setCA('residence', r)} />
                    ))}
                  </View>
                </Field>

                <View style={styles.coSubHead}><Text style={styles.coSubHeadText}>EMPLOYMENT & INCOME</Text></View>

                <Field label="Employment Profile">
                  <View style={styles.chipRow}>
                    {CO_PROFILES.map(p => (
                      <Chip key={p} label={p} active={form.coApplicant.profile === p} onPress={() => setCA('profile', p)} />
                    ))}
                  </View>
                </Field>

                <Field label="Employer / Business Name">
                  <TextInput style={styles.input} placeholder="e.g. Infosys Ltd" placeholderTextColor="#aaa"
                    value={form.coApplicant.employer} onChangeText={v => setCA('employer', v)} />
                </Field>

                <Field label="Years in Job / Business">
                  <TextInput style={styles.input} placeholder="e.g. 5" placeholderTextColor="#aaa"
                    keyboardType="number-pad"
                    value={form.coApplicant.yearsInJob} onChangeText={v => setCA('yearsInJob', v.replace(/\D/g, ''))} />
                </Field>

                <Field label="Monthly Income (₹)">
                  <TextInput style={styles.input} placeholder="e.g. 55000" placeholderTextColor="#aaa"
                    keyboardType="number-pad"
                    value={form.coApplicant.incomePerMonth} onChangeText={v => setCA('incomePerMonth', v.replace(/\D/g, ''))} />
                </Field>

                <Field label="Existing EMIs Total (₹)">
                  <TextInput style={styles.input} placeholder="e.g. 8000" placeholderTextColor="#aaa"
                    keyboardType="number-pad"
                    value={form.coApplicant.existingEmi} onChangeText={v => setCA('existingEmi', v.replace(/\D/g, ''))} />
                </Field>

                <Field label="CIBIL Score">
                  <TextInput style={styles.input} placeholder="e.g. 740" placeholderTextColor="#aaa"
                    keyboardType="number-pad" maxLength={3}
                    value={form.coApplicant.cibil} onChangeText={v => setCA('cibil', v.replace(/\D/g, ''))} />
                </Field>

              </View>
            )}
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

      {/* Co-Applicant DOB Picker */}
      <Modal visible={showDOBPicker} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowDOBPicker(false)} />
        <View style={styles.calendarSheet}>
          <Text style={styles.calTitle}>Co-Applicant Date of Birth</Text>
          <View style={styles.pickerRow}>
            <View style={styles.pickerCol}>
              <Text style={styles.pickerColLabel}>Day</Text>
              <FlatList data={DAYS} keyExtractor={i => String(i)} style={styles.pickerList}
                showsVerticalScrollIndicator={false} initialScrollIndex={pickerDay - 1}
                getItemLayout={(_, i) => ({ length: 44, offset: 44 * i, index: i })}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.pickerItem, pickerDay === item && styles.pickerItemActive]} onPress={() => setPickerDay(item)}>
                    <Text style={[styles.pickerItemText, pickerDay === item && styles.pickerItemTextActive]}>{String(item).padStart(2, '0')}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={styles.pickerCol}>
              <Text style={styles.pickerColLabel}>Month</Text>
              <FlatList data={MONTHS} keyExtractor={m => m} style={styles.pickerList}
                showsVerticalScrollIndicator={false} initialScrollIndex={pickerMonth}
                getItemLayout={(_, i) => ({ length: 44, offset: 44 * i, index: i })}
                renderItem={({ item, index }) => (
                  <TouchableOpacity style={[styles.pickerItem, pickerMonth === index && styles.pickerItemActive]} onPress={() => setPickerMonth(index)}>
                    <Text style={[styles.pickerItemText, pickerMonth === index && styles.pickerItemTextActive]}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <View style={styles.pickerCol}>
              <Text style={styles.pickerColLabel}>Year</Text>
              <FlatList data={YEARS} keyExtractor={y => String(y)} style={styles.pickerList}
                showsVerticalScrollIndicator={false} initialScrollIndex={YEARS.indexOf(pickerYear)}
                getItemLayout={(_, i) => ({ length: 44, offset: 44 * i, index: i })}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[styles.pickerItem, pickerYear === item && styles.pickerItemActive]} onPress={() => setPickerYear(item)}>
                    <Text style={[styles.pickerItemText, pickerYear === item && styles.pickerItemTextActive]}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.confirmBtn} onPress={confirmCoDOB}>
            <Text style={styles.confirmBtnText}>Confirm Date of Birth</Text>
          </TouchableOpacity>
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
  coApplicantWrap: {
    backgroundColor: '#f7f9fc', borderRadius: 14,
    borderWidth: 1.5, borderColor: '#d0daea',
    padding: 16, marginTop: 4, marginBottom: 8,
  },
  coHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#e8eef7', borderRadius: 10, padding: 12, marginBottom: 18,
  },
  coHeaderIcon: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  coHeaderTitle: { fontSize: 14, fontWeight: '800', color: '#1a3a6b' },
  coHeaderSub: { fontSize: 11, color: '#6b8ab8', marginTop: 1 },
  coSubHead: { borderLeftWidth: 3, borderLeftColor: '#1a3a6b', paddingLeft: 8, marginBottom: 14, marginTop: 4 },
  coSubHeadText: { fontSize: 10, fontWeight: '800', color: '#1a3a6b', letterSpacing: 0.8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputText: { fontSize: 15, color: '#111' },
  multiline: { height: 80, textAlignVertical: 'top' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  calendarSheet: {
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
