import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Animated, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function generateId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `RF-${num}`;
}

const ENQUIRY_ID = generateId();

function fmtINR(n) {
  if (!n) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
}

export default function SubmissionConfirmScreen({ route, navigation }) {
  const bank = route.params?.bank || { name: 'SBI', roi: '8.60%' };
  const step3 = route.params?.step3 || {};

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 6 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const summaryItems = [
    { label: 'Enquiry ID',    value: ENQUIRY_ID,                    highlight: true },
    { label: 'Selected Bank', value: bank.name },
    { label: 'Rate of Interest', value: `${step3.roi || bank.roi} p.a.` },
    { label: 'Vehicle',       value: step3.vehicleModel || '—' },
    { label: 'Vehicle Price', value: fmtINR(step3.vehiclePrice) },
    { label: 'Down Payment',  value: fmtINR(step3.downPayment) },
    { label: 'Loan Amount',   value: fmtINR(step3.loanAmount) },
    { label: 'Tenure',        value: step3.tenure ? `${step3.tenure} months` : '—' },
    { label: 'Monthly EMI',   value: fmtINR(step3.emi),             highlight: true },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Success animation */}
        <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="checkmark" size={52} color="#fff" />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.successTitle}>Inquiry Submitted!</Text>
          <Text style={styles.successSub}>
            Your enquiry has been successfully submitted and is now under review by the admin team.
          </Text>
        </Animated.View>

        {/* Enquiry ID pill */}
        <Animated.View style={[styles.idPill, { opacity: fadeAnim }]}>
          <Ionicons name="document-text-outline" size={18} color="#1a3a6b" />
          <Text style={styles.idLabel}>Enquiry ID</Text>
          <Text style={styles.idValue}>{ENQUIRY_ID}</Text>
        </Animated.View>

        {/* Summary card */}
        <Animated.View style={[styles.summaryCard, { opacity: fadeAnim }]}>
          <Text style={styles.summaryTitle}>Submission Summary</Text>
          {summaryItems.map((item, i) => (
            <View key={i} style={[styles.summaryRow, i < summaryItems.length - 1 && styles.summaryRowBorder]}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={[styles.summaryValue, item.highlight && styles.summaryValueHighlight]}>
                {item.value}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Status tracker mini */}
        <Animated.View style={[styles.trackerCard, { opacity: fadeAnim }]}>
          <Text style={styles.trackerTitle}>What happens next?</Text>
          {[
            { icon: 'checkmark-circle', label: 'Inquiry Submitted', done: true },
            { icon: 'business-outline', label: 'Admin Review', done: false },
            { icon: 'document-attach-outline', label: 'Documents Collection', done: false },
            { icon: 'send-outline', label: 'Sent to Bank', done: false },
          ].map((s, i) => (
            <View key={i} style={styles.trackerRow}>
              <View style={[styles.trackerDot, s.done && styles.trackerDotDone]}>
                <Ionicons name={s.icon} size={14} color={s.done ? '#fff' : '#bbb'} />
              </View>
              {i < 3 && <View style={[styles.trackerLine, s.done && styles.trackerLineDone]} />}
              <Text style={[styles.trackerLabel, s.done && styles.trackerLabelDone]}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Actions */}
        <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('Main', { screen: 'Home' })}
          >
            <Ionicons name="home-outline" size={18} color="#fff" />
            <Text style={styles.btnPrimaryText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOutline}
            onPress={() => navigation.navigate('Main', { screen: 'History' })}
          >
            <Ionicons name="time-outline" size={18} color="#1a3a6b" />
            <Text style={styles.btnOutlineText}>View History</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 24, paddingBottom: 48, alignItems: 'center', gap: 20 },

  successCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#1a7a4a',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1a7a4a', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
    marginTop: 16,
  },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#111', marginTop: 4, textAlign: 'center' },
  successSub: {
    fontSize: 14, color: '#666', textAlign: 'center',
    lineHeight: 22, maxWidth: 300,
  },

  idPill: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 14,
    paddingHorizontal: 20, paddingVertical: 14,
    borderWidth: 2, borderColor: '#1a3a6b',
    width: '100%',
    shadowColor: '#1a3a6b', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  idLabel: { fontSize: 13, color: '#888', fontWeight: '600', flex: 1 },
  idValue: { fontSize: 18, fontWeight: '900', color: '#1a3a6b', letterSpacing: 1 },

  summaryCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 20, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  summaryTitle: {
    fontSize: 13, fontWeight: '700', color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.7,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10,
  },
  summaryRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  summaryLabel: { fontSize: 13, color: '#888', fontWeight: '500' },
  summaryValue: { fontSize: 13, color: '#111', fontWeight: '700', textAlign: 'right', maxWidth: '55%' },
  summaryValueHighlight: { color: '#1a3a6b', fontSize: 15 },

  trackerCard: {
    backgroundColor: '#fff', borderRadius: 16,
    padding: 20, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  trackerTitle: {
    fontSize: 13, fontWeight: '700', color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.7,
    marginBottom: 16,
  },
  trackerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  trackerDot: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  trackerDotDone: { backgroundColor: '#1a7a4a' },
  trackerLine: {
    position: 'absolute', left: 14, top: 30,
    width: 2, height: 20, backgroundColor: '#eee',
  },
  trackerLineDone: { backgroundColor: '#1a7a4a' },
  trackerLabel: { fontSize: 14, color: '#bbb', fontWeight: '500' },
  trackerLabelDone: { color: '#111', fontWeight: '700' },

  actions: { flexDirection: 'column', gap: 12, width: '100%' },
  btnPrimary: {
    backgroundColor: '#1a3a6b', borderRadius: 13, padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#1a3a6b', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
  },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  btnOutline: {
    borderRadius: 13, padding: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 2, borderColor: '#1a3a6b', backgroundColor: '#fff',
  },
  btnOutlineText: { color: '#1a3a6b', fontSize: 15, fontWeight: '700' },
});
