import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BANKS = [
  { id: 1,  short: 'SBI',   name: 'State Bank of India',   roi: 8.60, tier: 'gold' },
  { id: 2,  short: 'BOB',   name: 'Bank of Baroda',         roi: 8.60, tier: 'gold' },
  { id: 3,  short: 'PNB',   name: 'Punjab National Bank',   roi: 8.70, tier: 'gold' },
  { id: 4,  short: 'YES',   name: 'Yes Bank',               roi: 8.75, tier: 'silver' },
  { id: 5,  short: 'KTK',   name: 'Kotak Bank',             roi: 8.80, tier: 'silver' },
  { id: 6,  short: 'HDFC',  name: 'HDFC Bank',              roi: 8.90, tier: 'silver' },
  { id: 7,  short: 'ICICI', name: 'ICICI Bank',             roi: 8.90, tier: 'silver' },
  { id: 8,  short: 'UBI',   name: 'Union Bank of India',    roi: 9.00, tier: 'standard' },
  { id: 9,  short: 'FED',   name: 'Federal Bank',           roi: 9.10, tier: 'standard' },
  { id: 10, short: 'CNR',   name: 'Canara Bank',            roi: 9.10, tier: 'standard' },
];

const TENURE_OPTIONS = [12, 24, 36, 48, 60, 72, 84];

const TIER_COLORS = {
  gold:     { bg: '#fffbea', border: '#f5a623', badge: '#f5a623', text: '#7a4e00', panelBg: '#fff8e1' },
  silver:   { bg: '#f0f4ff', border: '#6b8ab8', badge: '#1a3a6b', text: '#1a3a6b', panelBg: '#e8eef7' },
  standard: { bg: '#f5f5f5', border: '#ccc',    badge: '#888',    text: '#555',    panelBg: '#efefef' },
};

function calcEMI(principal, annualRate, months) {
  if (!principal || !annualRate || !months) return 0;
  const r = annualRate / 12 / 100;
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
}

function fmtINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

export default function RecommendBanksScreen({ navigation, route }) {
  const step3 = route.params?.step3 || {};
  const cibil = route.params?.step2?.cibilScore || '';
  const loanAmount = step3.loanAmount || 0;
  const defaultTenure = step3.tenure || 60;

  const [expandedId, setExpandedId] = useState(null);
  const [tenureMap, setTenureMap] = useState({});

  const getTenure = (bankId) => tenureMap[bankId] ?? defaultTenure;
  const setTenure = (bankId, t) => setTenureMap(prev => ({ ...prev, [bankId]: t }));

  const toggleExpand = (bankId) => {
    setExpandedId(prev => (prev === bankId ? null : bankId));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1a3a6b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recommended Banks</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* CIBIL + Loan summary banner */}
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTag}>LOAN SUMMARY</Text>
            <Text style={styles.bannerLoan}>{fmtINR(loanAmount)}</Text>
            <Text style={styles.bannerSub}>Loan Amount · {defaultTenure} mo preferred</Text>
          </View>
          <View style={styles.cibilCircle}>
            <Text style={styles.cibilNum}>{cibil || '—'}</Text>
            <Text style={styles.cibilLabel}>CIBIL</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{BANKS.length}</Text>
            <Text style={styles.statLabel}>Banks Eligible</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMid]}>
            <Text style={styles.statVal}>8.60%</Text>
            <Text style={styles.statLabel}>Best Rate</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{fmtINR(calcEMI(loanAmount, 8.60, defaultTenure))}</Text>
            <Text style={styles.statLabel}>Best EMI</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tap a bank to view EMI details</Text>

        {BANKS.map((bank, index) => {
          const t = TIER_COLORS[bank.tier];
          const isOpen = expandedId === bank.id;
          const selectedTenure = getTenure(bank.id);
          const emi = calcEMI(loanAmount, bank.roi, selectedTenure);
          const totalPayable = emi * selectedTenure;
          const totalInterest = totalPayable - loanAmount;

          return (
            <View key={bank.id} style={[styles.bankCard, { backgroundColor: t.bg, borderLeftColor: t.border }, isOpen && { borderColor: t.border, borderWidth: 2 }]}>

              {/* Bank row — always visible */}
              <TouchableOpacity
                style={styles.bankRow}
                onPress={() => toggleExpand(bank.id)}
                activeOpacity={0.75}
              >
                <View style={styles.bankLeft}>
                  <View style={[styles.bankRank, { backgroundColor: t.badge }]}>
                    <Text style={styles.bankRankText}>{index + 1}</Text>
                  </View>
                  <View style={[styles.bankInitials, { borderColor: t.border }]}>
                    <Text style={[styles.bankInitialsText, { color: t.text }]}>{bank.short}</Text>
                  </View>
                  <View>
                    <Text style={styles.bankName}>{bank.name}</Text>
                    <Text style={styles.bankType}>Vehicle Loan · {selectedTenure} mo</Text>
                  </View>
                </View>
                <View style={styles.bankRight}>
                  <Text style={[styles.bankRoi, { color: t.text }]}>{bank.roi.toFixed(2)}%</Text>
                  <Text style={styles.bankRoiLabel}>p.a.</Text>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={16} color={t.text}
                    style={{ marginTop: 4 }}
                  />
                </View>
              </TouchableOpacity>

              {/* Expanded EMI panel */}
              {isOpen && (
                <View style={[styles.emiPanel, { backgroundColor: t.panelBg }]}>

                  {/* EMI big number */}
                  <View style={styles.emiTopRow}>
                    <View>
                      <Text style={styles.emiPanelLabel}>Monthly EMI</Text>
                      <Text style={[styles.emiPanelValue, { color: t.text }]}>{fmtINR(emi)}</Text>
                    </View>
                    <View style={styles.emiPanelStats}>
                      <View style={styles.emiStatItem}>
                        <Text style={styles.emiStatLabel}>Total Payable</Text>
                        <Text style={styles.emiStatVal}>{fmtINR(totalPayable)}</Text>
                      </View>
                      <View style={styles.emiStatItem}>
                        <Text style={styles.emiStatLabel}>Total Interest</Text>
                        <Text style={styles.emiStatVal}>{fmtINR(totalInterest)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Tenure switcher */}
                  <Text style={styles.tenureSwitchLabel}>Change Tenure</Text>
                  <View style={styles.tenureRow}>
                    {TENURE_OPTIONS.map(opt => {
                      const isActive = selectedTenure === opt;
                      return (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.tenureChip, isActive && { backgroundColor: t.badge, borderColor: t.badge }]}
                          onPress={() => setTenure(bank.id, opt)}
                        >
                          <Text style={[styles.tenureChipText, isActive && styles.tenureChipTextActive]}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Breakdown */}
                  <View style={styles.breakdownRow}>
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>Loan</Text>
                      <Text style={styles.breakdownVal}>{fmtINR(loanAmount)}</Text>
                    </View>
                    <View style={styles.breakdownDot} />
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>ROI</Text>
                      <Text style={styles.breakdownVal}>{bank.roi.toFixed(2)}%</Text>
                    </View>
                    <View style={styles.breakdownDot} />
                    <View style={styles.breakdownItem}>
                      <Text style={styles.breakdownLabel}>Tenure</Text>
                      <Text style={styles.breakdownVal}>{selectedTenure} mo</Text>
                    </View>
                  </View>

                  {/* Select this bank */}
                  <TouchableOpacity
                    style={[styles.selectBtn, { backgroundColor: t.badge }]}
                    onPress={() => navigation.navigate('SubmissionConfirm', {
                      bank: { ...bank, roi: `${bank.roi.toFixed(2)}%` },
                      step3: { ...step3, tenure: selectedTenure, emi },
                    })}
                  >
                    <Text style={styles.selectBtnText}>Submit with {bank.short} · {fmtINR(emi)}/mo</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <Text style={styles.disclaimer}>
          * Rates are indicative and subject to change. Final approval at bank's discretion.
        </Text>

      </ScrollView>
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
  scroll: { padding: 16, paddingBottom: 48, gap: 12 },

  // Banner
  banner: {
    backgroundColor: '#1a3a6b', borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  bannerLeft: { gap: 4 },
  bannerTag: { fontSize: 10, color: '#a8c0e0', fontWeight: '700', letterSpacing: 1.2 },
  bannerLoan: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  bannerSub: { fontSize: 12, color: '#7eb8a0', fontWeight: '500' },
  cibilCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 3, borderColor: '#4cde8a',
    alignItems: 'center', justifyContent: 'center',
  },
  cibilNum: { fontSize: 20, fontWeight: '800', color: '#fff' },
  cibilLabel: { fontSize: 9, color: '#a8c0e0', fontWeight: '600', letterSpacing: 0.8 },

  // Stats
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statBoxMid: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#eee' },
  statVal: { fontSize: 16, fontWeight: '800', color: '#1a3a6b' },
  statLabel: { fontSize: 11, color: '#888', fontWeight: '500', marginTop: 2 },

  sectionTitle: {
    fontSize: 12, fontWeight: '700', color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.8,
  },

  // Bank card
  bankCard: {
    borderRadius: 14, borderLeftWidth: 4,
    overflow: 'hidden',
  },
  bankRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14,
  },
  bankLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  bankRank: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  bankRankText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  bankInitials: {
    width: 42, height: 42, borderRadius: 10, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  bankInitialsText: { fontSize: 11, fontWeight: '800' },
  bankName: { fontSize: 14, fontWeight: '700', color: '#111' },
  bankType: { fontSize: 11, color: '#888', marginTop: 1 },
  bankRight: { alignItems: 'flex-end' },
  bankRoi: { fontSize: 18, fontWeight: '800' },
  bankRoiLabel: { fontSize: 11, color: '#888', fontWeight: '500' },

  // EMI panel
  emiPanel: {
    padding: 16, gap: 14,
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)',
  },
  emiTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  emiPanelLabel: { fontSize: 11, color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  emiPanelValue: { fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  emiPanelStats: { gap: 8, alignItems: 'flex-end' },
  emiStatItem: { alignItems: 'flex-end' },
  emiStatLabel: { fontSize: 10, color: '#888', fontWeight: '500' },
  emiStatVal: { fontSize: 13, color: '#111', fontWeight: '700' },

  tenureSwitchLabel: { fontSize: 11, color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  tenureRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tenureChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#ccc', backgroundColor: '#fff',
  },
  tenureChipText: { fontSize: 13, color: '#555', fontWeight: '600' },
  tenureChipTextActive: { color: '#fff' },

  breakdownRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: 12,
  },
  breakdownItem: { alignItems: 'center', gap: 3 },
  breakdownLabel: { fontSize: 10, color: '#888', fontWeight: '500' },
  breakdownVal: { fontSize: 13, color: '#111', fontWeight: '700' },
  breakdownDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#ccc' },

  selectBtn: {
    borderRadius: 10, padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  selectBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  disclaimer: {
    fontSize: 11, color: '#aaa', textAlign: 'center', lineHeight: 16,
  },
});
