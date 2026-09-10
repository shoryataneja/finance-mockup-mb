import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const INITIAL_BANKS = {
  1: {
    label: 'Score Band 1',
    subtitle: 'CIBIL 750+  ·  Excellent',
    color: '#1a7a4a', bg: '#e6f4ed', border: '#4cde8a',
    banks: [
      { id: 'b1', name: 'State Bank of India',  roi: '8.60%' },
      { id: 'b2', name: 'Bank of Baroda',        roi: '8.60%' },
      { id: 'b3', name: 'Punjab National Bank',  roi: '8.70%' },
      { id: 'b4', name: 'Kotak Mahindra Bank',   roi: '8.80%' },
    ],
  },
  2: {
    label: 'Score Band 2',
    subtitle: 'CIBIL 700–749  ·  Good',
    color: '#1a3a6b', bg: '#e8eef7', border: '#6b8ab8',
    banks: [
      { id: 'b5', name: 'HDFC Bank',             roi: '8.90%' },
      { id: 'b6', name: 'ICICI Bank',            roi: '8.90%' },
      { id: 'b7', name: 'Yes Bank',              roi: '8.75%' },
      { id: 'b8', name: 'Axis Bank',             roi: '9.00%' },
    ],
  },
  3: {
    label: 'Score Band 3',
    subtitle: 'CIBIL 650–699  ·  Average',
    color: '#b07d1a', bg: '#fdf3e0', border: '#f5a623',
    banks: [
      { id: 'b9',  name: 'Union Bank of India',  roi: '9.00%' },
      { id: 'b10', name: 'Federal Bank',         roi: '9.10%' },
      { id: 'b11', name: 'Canara Bank',          roi: '9.10%' },
      { id: 'b12', name: 'Indian Bank',          roi: '9.20%' },
    ],
  },
  4: {
    label: 'Score Band 4',
    subtitle: 'CIBIL < 650  ·  Below Average',
    color: '#b03a2e', bg: '#faeaea', border: '#e57373',
    banks: [
      { id: 'b13', name: 'Shriram Finance',      roi: '10.50%' },
      { id: 'b14', name: 'Mahindra Finance',     roi: '10.75%' },
      { id: 'b15', name: 'Cholamandalam Finance',roi: '11.00%' },
    ],
  },
};

let nextId = 100;

export default function BanksScreen() {
  const [bands, setBands] = useState(INITIAL_BANKS);
  const [modal, setModal] = useState(null); // { bandId }
  const [newName, setNewName] = useState('');
  const [newRoi, setNewRoi] = useState('');

  const deleteBank = (bandId, bankId) => {
    Alert.alert('Remove Bank', 'Remove this bank from the list?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: () => setBands(prev => ({
          ...prev,
          [bandId]: { ...prev[bandId], banks: prev[bandId].banks.filter(b => b.id !== bankId) },
        })),
      },
    ]);
  };

  const addBank = () => {
    if (!newName.trim() || !newRoi.trim()) return;
    const id = `b${nextId++}`;
    setBands(prev => ({
      ...prev,
      [modal]: {
        ...prev[modal],
        banks: [...prev[modal].banks, { id, name: newName.trim(), roi: newRoi.trim() }],
      },
    }));
    setNewName(''); setNewRoi(''); setModal(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bank Management</Text>
        <Text style={styles.headerSub}>Manage banks by CIBIL score band</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {Object.entries(bands).map(([bandId, band]) => (
          <View key={bandId} style={[styles.bandCard, { borderTopColor: band.border, borderTopWidth: 3 }]}>
            {/* Band header */}
            <View style={styles.bandHeader}>
              <View style={[styles.bandBadge, { backgroundColor: band.bg }]}>
                <Text style={[styles.bandBadgeText, { color: band.color }]}>{band.label}</Text>
              </View>
              <Text style={styles.bandSubtitle}>{band.subtitle}</Text>
              <View style={styles.bandHeaderRight}>
                <View style={[styles.countPill, { backgroundColor: band.bg }]}>
                  <Text style={[styles.countPillText, { color: band.color }]}>{band.banks.length} banks</Text>
                </View>
                <TouchableOpacity
                  style={[styles.addBandBtn, { backgroundColor: band.color }]}
                  onPress={() => setModal(bandId)}
                >
                  <Ionicons name="add" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Bank rows */}
            {band.banks.length === 0 ? (
              <Text style={styles.emptyBand}>No banks in this band</Text>
            ) : (
              band.banks.map((bank, idx) => (
                <View key={bank.id} style={[styles.bankRow, idx === band.banks.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={[styles.bankInitialBox, { backgroundColor: band.bg }]}>
                    <Text style={[styles.bankInitialText, { color: band.color }]}>
                      {bank.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </Text>
                  </View>
                  <View style={styles.bankInfo}>
                    <Text style={styles.bankName}>{bank.name}</Text>
                    <Text style={styles.bankRoi}>ROI: {bank.roi} p.a.</Text>
                  </View>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteBank(bandId, bank.id)}>
                    <Ionicons name="trash-outline" size={16} color="#b03a2e" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        ))}
      </ScrollView>

      {/* Add Bank Modal */}
      <Modal visible={!!modal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => { setModal(null); setNewName(''); setNewRoi(''); }} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Add Bank</Text>
          {modal && <Text style={styles.modalBand}>{bands[modal]?.label} · {bands[modal]?.subtitle}</Text>}

          <Text style={styles.modalLabel}>Bank Name</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. IndusInd Bank"
            placeholderTextColor="#bbb"
            value={newName}
            onChangeText={setNewName}
          />
          <Text style={styles.modalLabel}>Rate of Interest (ROI)</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="e.g. 9.25%"
            placeholderTextColor="#bbb"
            value={newRoi}
            onChangeText={setNewRoi}
          />
          <TouchableOpacity
            style={[styles.modalConfirm, (!newName.trim() || !newRoi.trim()) && { opacity: 0.45 }]}
            disabled={!newName.trim() || !newRoi.trim()}
            onPress={addBank}
          >
            <Text style={styles.modalConfirmText}>Add Bank</Text>
          </TouchableOpacity>
        </View>
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

  bandCard: {
    backgroundColor: '#fff', borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  bandHeader: {
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
    gap: 4,
  },
  bandBadge: {
    alignSelf: 'flex-start', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, marginBottom: 2,
  },
  bandBadgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
  bandSubtitle: { fontSize: 12, color: '#888', fontWeight: '500' },
  bandHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  countPill: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  countPillText: { fontSize: 12, fontWeight: '700' },
  addBandBtn: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyBand: { fontSize: 13, color: '#bbb', textAlign: 'center', paddingVertical: 20 },

  bankRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
  },
  bankInitialBox: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  bankInitialText: { fontSize: 12, fontWeight: '800' },
  bankInfo: { flex: 1 },
  bankName: { fontSize: 14, fontWeight: '700', color: '#111' },
  bankRoi: { fontSize: 12, color: '#888', marginTop: 2, fontWeight: '500' },
  deleteBtn: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: '#faeaea', alignItems: 'center', justifyContent: 'center',
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40, gap: 12,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#e0e0e0',
    alignSelf: 'center', marginBottom: 4,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  modalBand: { fontSize: 12, color: '#888', fontWeight: '500', marginTop: -4 },
  modalLabel: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: -4 },
  modalInput: {
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: '#111',
  },
  modalConfirm: {
    backgroundColor: '#1a3a6b', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  modalConfirmText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
