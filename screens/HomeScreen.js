import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NAME = 'Avni Gupta';
const DESIGNATION = 'Finance Executive';

const RECENT = [
  { id: '1', name: 'Arjun Kapoor',   car: 'Toyota Hyryder',            bank: 'SBI',    roi: '8.60%', status: 'Disbursed',   date: 'Today, 10:24 AM' },
  { id: '2', name: 'Priya Sharma',   car: 'Toyota Urban Cruiser Hyryder', bank: 'HDFC', roi: '8.90%', status: 'In-Progress', date: 'Today, 09:10 AM' },
  { id: '3', name: 'Amit Verma',     car: 'Toyota Glanza',             bank: 'BOB',    roi: '8.60%', status: 'Disbursed',   date: 'Yesterday, 4:45 PM' },
  { id: '4', name: 'Sneha Patil',    car: 'Toyota Hyryder',            bank: 'ICICI',  roi: '8.90%', status: 'Rejected',    date: 'Yesterday, 2:30 PM' },
  { id: '5', name: 'Karan Singh',    car: 'Toyota Fortuner',           bank: 'Kotak',  roi: '8.80%', status: 'Disbursed',   date: '25 Aug, 11:00 AM' },
  { id: '6', name: 'Deepika Nair',   car: 'Toyota Camry',              bank: 'PNB',    roi: '8.70%', status: 'In-Progress', date: '25 Aug, 09:50 AM' },
];

const STATUS_CONFIG = {
  'In-Progress': { color: '#5c6bc0', bg: '#ede7f6', icon: 'sync-outline' },
  Sanctioned:    { color: '#1a7a4a', bg: '#e6f4ed', icon: 'checkmark-circle' },
  Disbursed:     { color: '#1a7a4a', bg: '#e6f4ed', icon: 'checkmark-circle-outline' },
  Rejected:      { color: '#b03a2e', bg: '#faeaea', icon: 'close-circle' },
};

const KPI_TOP = { label: 'Total Logins', value: '12', icon: 'document-text-outline', color: '#1a3a6b', bg: '#e8eef7' };
const KPI_GRID = [
  { label: 'In-Progress', value: '6', icon: 'sync-outline',              color: '#5c6bc0', bg: '#ede7f6' },
  { label: 'Sanctioned',  value: '0', icon: 'checkmark-circle-outline',  color: '#1a7a4a', bg: '#e6f4ed' },
  { label: 'Disbursed',   value: '4', icon: 'cash-outline',              color: '#1a7a4a', bg: '#e6f4ed' },
  { label: 'Rejected',    value: '2', icon: 'close-circle-outline',      color: '#b03a2e', bg: '#faeaea' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
          <Text style={styles.name}>{NAME}</Text>
          <Text style={styles.designation}>{DESIGNATION}</Text>
        </View>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => navigation.navigate('Main', { screen: 'Profile' })}
        >
          <Text style={styles.avatarText}>
            {NAME.split(' ').map(w => w[0]).join('')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Today label */}
        <Text style={styles.sectionLabel}>Today's Overview</Text>

        {/* KPI cards — 1 full-width hero + 2x2 grid */}
        <View style={[styles.kpiCard, { backgroundColor: KPI_TOP.bg }]}>
          <View style={styles.kpiTopRow}>
            <View style={[styles.kpiIconWrap, { backgroundColor: KPI_TOP.color + '22' }]}>
              <Ionicons name={KPI_TOP.icon} size={22} color={KPI_TOP.color} />
            </View>
            <Text style={[styles.kpiValueHero, { color: KPI_TOP.color }]}>{KPI_TOP.value}</Text>
          </View>
          <Text style={styles.kpiLabel}>{KPI_TOP.label}</Text>
        </View>

        <View style={styles.kpiGrid}>
          {KPI_GRID.map(k => (
            <View key={k.label} style={[styles.kpiCardSmall, { backgroundColor: k.bg }]}>
              <View style={[styles.kpiIconWrap, { backgroundColor: k.color + '22' }]}>
                <Ionicons name={k.icon} size={18} color={k.color} />
              </View>
              <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
            </View>
          ))}
        </View>

        {/* Full-width New Enquiry button */}
        <TouchableOpacity
          style={styles.newEnquiryBtn}
          onPress={() => navigation.navigate('EnquiryStep1')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.newEnquiryText}> New Enquiry</Text>
        </TouchableOpacity>

        {/* Recent Enquiries */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionLabel}>Recent Enquiries</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'History' })}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {RECENT.map(item => {
          const s = STATUS_CONFIG[item.status];
          const initials = item.name.split(' ').map(w => w[0]).join('').slice(0, 2);
          return (
            <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.75}>
              <View style={styles.cardAvatar}>
                <Text style={styles.cardAvatarText}>{initials}</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                    <Ionicons name={s.icon} size={11} color={s.color} />
                    <Text style={[styles.statusText, { color: s.color }]}>{item.status}</Text>
                  </View>
                </View>
                <View style={styles.carRow}>
                  <Ionicons name="car-outline" size={13} color="#888" />
                  <Text style={styles.carText}>{item.car}</Text>
                </View>
                <View style={styles.cardBottomRow}>
                  <View style={styles.bankChip}>
                    <Ionicons name="business-outline" size={12} color="#1a3a6b" />
                    <Text style={styles.bankText}>{item.bank}</Text>
                    <Text style={styles.roiText}>{item.roi}</Text>
                  </View>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
  },
  greeting: { fontSize: 13, color: '#888', fontWeight: '500' },
  name: { fontSize: 20, fontWeight: '700', color: '#1a3a6b', marginTop: 2 },
  designation: { fontSize: 12, color: '#6b8ab8', fontWeight: '500', marginTop: 2 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1a3a6b', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  scroll: { padding: 20, gap: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.8 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  kpiCard: {
    borderRadius: 14, padding: 16, gap: 6,
  },
  kpiCardSmall: {
    width: '47%', borderRadius: 14, padding: 14, gap: 5,
  },
  kpiTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  kpiIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  kpiValueHero: { fontSize: 38, fontWeight: '900', lineHeight: 42 },
  kpiValue: { fontSize: 26, fontWeight: '800', marginTop: 4 },
  kpiLabel: { fontSize: 12, color: '#555', fontWeight: '500' },
  newEnquiryBtn: {
    backgroundColor: '#1a3a6b', borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8,
    shadowColor: '#1a3a6b', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
  },
  newEnquiryText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  recentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seeAll: { fontSize: 13, fontWeight: '600', color: '#1a3a6b' },

  card: {
    backgroundColor: '#fff', borderRadius: 14,
    flexDirection: 'row', padding: 14, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardAvatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#1a3a6b', alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  cardAvatarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  cardBody: { flex: 1, gap: 5 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardName: { fontSize: 15, fontWeight: '700', color: '#111' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  carRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  carText: { fontSize: 13, color: '#555', fontWeight: '500' },
  cardBottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  bankChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#e8eef7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  bankText: { fontSize: 12, fontWeight: '700', color: '#1a3a6b' },
  roiText: { fontSize: 12, fontWeight: '600', color: '#6b8ab8' },
  dateText: { fontSize: 11, color: '#bbb', fontWeight: '500' },
});
