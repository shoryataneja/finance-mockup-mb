import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BAND_META = [
  { id: 1, label: 'Band 1', track: 'Fast Track',   color: '#1a7a4a', bg: '#e6f4ed', border: '#4cde8a', cibilLabel: 'Min CIBIL' },
  { id: 2, label: 'Band 2', track: 'Normal Track',  color: '#1a3a6b', bg: '#e8eef7', border: '#6b8ab8', cibilLabel: 'Min CIBIL' },
  { id: 3, label: 'Band 3', track: 'Low Track',     color: '#b07d1a', bg: '#fdf3e0', border: '#f5a623', cibilLabel: 'Max CIBIL' },
  { id: 4, label: 'Band 4', track: 'Waiting',       color: '#b03a2e', bg: '#faeaea', border: '#e57373', cibilLabel: 'Max CIBIL' },
];

const INITIAL_BANDS = [
  { id: 1, minIncome: '50,000', roiMin: '8.60', roiMax: '8.90', cibil: '751', maxFoir: '35', incomeProof: 'Required',     residence: 'OWN' },
  { id: 2, minIncome: '40,000', roiMin: '8.90', roiMax: '9.25', cibil: '726', maxFoir: '40', incomeProof: 'Required',     residence: 'OWN' },
  { id: 3, minIncome: '30,000', roiMin: '9.50', roiMax: '11.00',cibil: '699', maxFoir: '60', incomeProof: 'Not Required', residence: 'OWN, RENTED' },
  { id: 4, minIncome: '25,000', roiMin: '10.00',roiMax: '15.00',cibil: '649', maxFoir: '65', incomeProof: 'Not Required', residence: 'OWN, RENTED' },
];

const INCOME_PROOF_OPTIONS = ['Required', 'Not Required'];
const RESIDENCE_OPTIONS    = ['OWN', 'RENTED', 'OWN, RENTED'];

function CritRow({ label, value }) {
  return (
    <View style={styles.critRow}>
      <Text style={styles.critLabel}>{label}</Text>
      <Text style={styles.critValue}>{value}</Text>
    </View>
  );
}

export default function ScoreBandsScreen() {
  const [bands, setBands]   = useState(INITIAL_BANDS);
  const [modal, setModal]   = useState(null); // band id
  const [draft, setDraft]   = useState(null);

  const openEdit = (band) => { setDraft({ ...band }); setModal(band.id); };
  const setD = (k, v) => setDraft(d => ({ ...d, [k]: v }));
  const save = () => {
    setBands(prev => prev.map(b => b.id === modal ? { ...draft } : b));
    setModal(null); setDraft(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Score Band Config</Text>
        <Text style={styles.headerSub}>Configure eligibility criteria per band</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {BAND_META.map(meta => {
          const band = bands.find(b => b.id === meta.id);
          return (
            <View key={meta.id} style={[styles.card, { borderTopColor: meta.border }]}>
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={[styles.bandPill, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.bandPillText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                  <Text style={styles.trackName}>{meta.track}</Text>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(band)}>
                  <Ionicons name="create-outline" size={14} color="#555" />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
              </View>

              {/* Criteria 2-col grid */}
              <View style={styles.criteriaGrid}>
                <View style={styles.critCell}>
                  <CritRow label="Min Income" value={`₹${band.minIncome}`} />
                </View>
                <View style={[styles.critCell, styles.critCellRight]}>
                  <CritRow label="ROI Range" value={`${band.roiMin}% – ${band.roiMax}%`} />
                </View>
                <View style={styles.critCell}>
                  <CritRow label={meta.cibilLabel} value={band.cibil} />
                </View>
                <View style={[styles.critCell, styles.critCellRight]}>
                  <CritRow label="Max FOIR" value={`${band.maxFoir}%`} />
                </View>
                <View style={[styles.critCell, styles.critCellFull]}>
                  <CritRow label="Income Proof" value={band.incomeProof} />
                </View>
                <View style={[styles.critCell, styles.critCellFull, { borderBottomWidth: 0 }]}>
                  <CritRow label="Residence" value={band.residence} />
                </View>
              </View>

              {/* CIBIL bar */}
              <View style={[styles.cibilBar, { backgroundColor: meta.bg }]}>
                <Text style={[styles.cibilBarLabel, { color: meta.color }]}>
                  CIBIL {meta.cibilLabel === 'Min CIBIL' ? '≥' : '≤'} {band.cibil}
                </Text>
                <View style={styles.cibilTrack}>
                  <View style={[styles.cibilFill, {
                    backgroundColor: meta.color,
                    width: `${Math.min(100, (parseInt(band.cibil) / 900) * 100)}%`,
                  }]} />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={!!modal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => { setModal(null); setDraft(null); }} />
        {draft && (() => {
          const meta = BAND_META.find(m => m.id === modal);
          return (
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <View style={styles.modalTitleRow}>
                <View style={[styles.bandPill, { backgroundColor: meta.bg }]}>
                  <Text style={[styles.bandPillText, { color: meta.color }]}>{meta.label}</Text>
                </View>
                <Text style={styles.modalTitle}>{meta.track}</Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalGrid}>
                  <View style={styles.modalField}>
                    <Text style={styles.modalLabel}>Min Income (₹)</Text>
                    <TextInput style={styles.modalInput} value={draft.minIncome} onChangeText={v => setD('minIncome', v)} placeholder="e.g. 50,000" placeholderTextColor="#bbb" />
                  </View>
                  <View style={styles.modalField}>
                    <Text style={styles.modalLabel}>{meta.cibilLabel}</Text>
                    <TextInput style={styles.modalInput} value={draft.cibil} onChangeText={v => setD('cibil', v)} keyboardType="number-pad" placeholder="e.g. 750" placeholderTextColor="#bbb" />
                  </View>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>ROI Range (%)</Text>
                  <View style={styles.roiRow}>
                    <TextInput style={[styles.modalInput, styles.roiInput]} value={draft.roiMin} onChangeText={v => setD('roiMin', v)} keyboardType="decimal-pad" placeholder="8.60" placeholderTextColor="#bbb" />
                    <Text style={styles.roiSep}>–</Text>
                    <TextInput style={[styles.modalInput, styles.roiInput]} value={draft.roiMax} onChangeText={v => setD('roiMax', v)} keyboardType="decimal-pad" placeholder="9.25" placeholderTextColor="#bbb" />
                    <Text style={styles.roiUnit}>%</Text>
                  </View>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Max FOIR (%)</Text>
                  <TextInput style={styles.modalInput} value={draft.maxFoir} onChangeText={v => setD('maxFoir', v)} keyboardType="number-pad" placeholder="35" placeholderTextColor="#bbb" />
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Income Proof</Text>
                  <View style={styles.chipRow}>
                    {INCOME_PROOF_OPTIONS.map(opt => (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.chip, draft.incomeProof === opt && { backgroundColor: meta.color, borderColor: meta.color }]}
                        onPress={() => setD('incomeProof', opt)}
                      >
                        <Text style={[styles.chipText, draft.incomeProof === opt && { color: '#fff' }]}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Residence</Text>
                  <View style={styles.chipRow}>
                    {RESIDENCE_OPTIONS.map(opt => (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.chip, draft.residence === opt && { backgroundColor: meta.color, borderColor: meta.color }]}
                        onPress={() => setD('residence', opt)}
                      >
                        <Text style={[styles.chipText, draft.residence === opt && { color: '#fff' }]}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: meta.color }]} onPress={save}>
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          );
        })()}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  header: {
    backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a3a6b' },
  headerSub: { fontSize: 12, color: '#888', marginTop: 2, fontWeight: '500' },
  scroll: { padding: 16, gap: 14, paddingBottom: 40 },

  card: {
    backgroundColor: '#fff', borderRadius: 16,
    borderTopWidth: 4, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bandPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  bandPillText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  trackName: { fontSize: 16, fontWeight: '700', color: '#111' },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#e0e0e0',
  },
  editBtnText: { fontSize: 12, fontWeight: '700', color: '#555' },

  criteriaGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  critCell: {
    width: '50%', paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  critCellRight: { borderLeftWidth: 1, borderLeftColor: '#f5f5f5' },
  critCellFull: { width: '100%', borderLeftWidth: 0 },
  critRow: { gap: 3 },
  critLabel: { fontSize: 10, fontWeight: '600', color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5 },
  critValue: { fontSize: 15, fontWeight: '700', color: '#111', marginTop: 2 },

  cibilBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 11,
  },
  cibilBarLabel: { fontSize: 11, fontWeight: '700', minWidth: 100 },
  cibilTrack: { flex: 1, height: 5, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' },
  cibilFill: { height: '100%', borderRadius: 3 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40, maxHeight: '85%',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#e0e0e0',
    alignSelf: 'center', marginBottom: 14,
  },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  modalGrid: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  modalField: { flex: 1, marginBottom: 14 },
  modalLabel: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 6 },
  modalInput: {
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, color: '#111',
  },
  roiRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roiInput: { flex: 1 },
  roiSep: { fontSize: 16, color: '#aaa', fontWeight: '600' },
  roiUnit: { fontSize: 14, color: '#aaa', fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#ddd', backgroundColor: '#fff',
  },
  chipText: { fontSize: 13, color: '#555', fontWeight: '600' },
  saveBtn: {
    borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 8,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
