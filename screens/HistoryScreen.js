import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TextInput, FlatList, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ENQUIRIES = [
  { id: '1',  name: 'Arjun Kapoor',    car: 'Toyota Hyryder',              bank: 'SBI',     roi: '8.60%', status: 'Disbursed',   date: 'Today, 10:24 AM' },
  { id: '2',  name: 'Priya Sharma',    car: 'Toyota Urban Cruiser Hyryder', bank: 'HDFC',    roi: '8.90%', status: 'In-Progress', date: 'Today, 09:10 AM' },
  { id: '3',  name: 'Amit Verma',      car: 'Toyota Glanza',               bank: 'BOB',     roi: '8.60%', status: 'Disbursed',   date: 'Yesterday, 4:45 PM' },
  { id: '4',  name: 'Sneha Patil',     car: 'Toyota Hyryder',              bank: 'ICICI',   roi: '8.90%', status: 'Rejected',    date: 'Yesterday, 2:30 PM' },
  { id: '5',  name: 'Karan Singh',     car: 'Toyota Fortuner',             bank: 'Kotak',   roi: '8.80%', status: 'Disbursed',   date: '25 Aug, 11:00 AM' },
  { id: '6',  name: 'Deepika Nair',    car: 'Toyota Camry',                bank: 'PNB',     roi: '8.70%', status: 'In-Progress', date: '25 Aug, 09:50 AM' },
  { id: '7',  name: 'Vikram Joshi',    car: 'Toyota Innova Crysta',        bank: 'Yes Bank', roi: '8.75%', status: 'Disbursed',  date: '24 Aug, 3:15 PM' },
  { id: '8',  name: 'Ananya Reddy',    car: 'Toyota Hyryder',              bank: 'Federal', roi: '9.10%', status: 'Rejected',    date: '24 Aug, 1:00 PM' },
  { id: '9',  name: 'Rohan Desai',     car: 'Toyota Yaris',                bank: 'Axis',    roi: '8.75%', status: 'In-Progress', date: '02 Sep, 09:45 AM' },
  { id: '10', name: 'Meera Iyer',      car: 'Toyota Innova HyCross',       bank: 'IDFC',    roi: '8.65%', status: 'In-Progress', date: '01 Sep, 09:20 AM' },
  { id: '11', name: 'Suresh Nambiar',  car: 'Toyota Fortuner',             bank: 'SBI',     roi: '8.55%', status: 'In-Progress', date: '30 Aug, 1:45 PM' },
  { id: '12', name: 'Kavya Menon',     car: 'Toyota Taisor',               bank: 'HDFC',    roi: '8.85%', status: 'In-Progress', date: '03 Sep, 09:50 AM' },
];

const STATUS_CONFIG = {
  'In-Progress': { color: '#5c6bc0', bg: '#ede7f6', icon: 'sync-outline' },
  Sanctioned:    { color: '#1a7a4a', bg: '#e6f4ed', icon: 'checkmark-circle' },
  Disbursed:     { color: '#1a7a4a', bg: '#e6f4ed', icon: 'checkmark-circle-outline' },
  Rejected:      { color: '#b03a2e', bg: '#faeaea', icon: 'close-circle' },
};

function EnquiryCard({ item, index }) {
  const s = STATUS_CONFIG[item.status];
  const initials = item.name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75}>
      {/* Left avatar */}
      <View style={styles.avatarWrap}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Middle content */}
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={styles.customerName}>{item.name}</Text>
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
}

export default function HistoryScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = ENQUIRIES.filter(item => {
    const matchFilter = activeFilter === 'All' || item.status === activeFilter;
    const q = query.toLowerCase();
    const matchQuery = !q || item.name.toLowerCase().includes(q) || item.car.toLowerCase().includes(q) || item.bank.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enquiry History</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filtered.length}</Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, car or bank..."
            placeholderTextColor="#bbb"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#bbb" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color="#1a3a6b" />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <View style={styles.filterChips}>
        {['All', 'In-Progress', 'Sanctioned', 'Disbursed', 'Rejected'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <EnquiryCard item={item} index={index} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={36} color="#ccc" />
            <Text style={styles.emptyText}>No enquiries found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a3a6b' },
  countBadge: {
    backgroundColor: '#e8eef7', borderRadius: 10,
    paddingHorizontal: 9, paddingVertical: 3,
  },
  countText: { fontSize: 13, fontWeight: '700', color: '#1a3a6b' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff',
  },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f5f5f5', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111', padding: 0 },
  filterBtn: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: '#e8eef7', alignItems: 'center', justifyContent: 'center',
  },

  filterChips: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: 16, paddingBottom: 12, paddingTop: 4,
    backgroundColor: '#fff',
  },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterChipActive: { backgroundColor: '#1a3a6b' },
  filterChipText: { fontSize: 12, fontWeight: '600', color: '#666' },
  filterChipTextActive: { color: '#fff' },

  list: { padding: 16, paddingBottom: 30 },

  card: {
    backgroundColor: '#fff', borderRadius: 14,
    flexDirection: 'row', padding: 14, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  avatarWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#1a3a6b', alignItems: 'center', justifyContent: 'center',
    marginTop: 2,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  cardBody: { flex: 1, gap: 5 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  customerName: { fontSize: 15, fontWeight: '700', color: '#111' },
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
    backgroundColor: '#e8eef7', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  bankText: { fontSize: 12, fontWeight: '700', color: '#1a3a6b' },
  roiText: { fontSize: 12, fontWeight: '600', color: '#6b8ab8' },
  dateText: { fontSize: 11, color: '#bbb', fontWeight: '500' },

  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14, color: '#bbb', fontWeight: '500' },
});
