import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const USER = {
  name: 'Avni Gupta',
  designation: 'Finance Executive',
  employeeId: 'NF-2024-047',
  email: 'avni.gupta@nandifinance.in',
  phone: '+91 98765 43210',
  branch: 'Bangalore - Koramangala',
  joiningDate: '15 March 2022',
  status: 'Active',
  reportingTo: 'Rajesh Sharma',
};

function InfoRow({ icon, label, value, highlight }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color="#1a3a6b" />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>{value}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => navigation.replace('Login') },
    ]);
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Avatar + name block */}
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {USER.name.split(' ').map(w => w[0]).join('')}
            </Text>
          </View>
          <Text style={styles.heroName}>{USER.name}</Text>
          <Text style={styles.heroDesignation}>{USER.designation}</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{USER.status}</Text>
          </View>
        </View>

        {/* Details card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Details</Text>
          <InfoRow icon="id-card-outline"       label="Employee ID"    value={USER.employeeId} />
          <InfoRow icon="mail-outline"           label="Email"          value={USER.email} />
          <InfoRow icon="call-outline"           label="Phone"          value={USER.phone} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Work Details</Text>
          <InfoRow icon="briefcase-outline"      label="Designation"    value={USER.designation} />
          <InfoRow icon="business-outline"       label="Branch"         value={USER.branch} />
          <InfoRow icon="calendar-outline"       label="Joining Date"   value={USER.joiningDate} />
          <InfoRow icon="person-outline"         label="Reporting To"   value={USER.reportingTo} />
          <InfoRow icon="ellipse-outline"        label="Status"         value={USER.status} highlight />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#b03a2e" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  heroCard: {
    backgroundColor: '#1a3a6b', borderRadius: 18,
    alignItems: 'center', paddingVertical: 30, paddingHorizontal: 20,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 26, fontWeight: '800', color: '#1a3a6b' },
  heroName: { fontSize: 22, fontWeight: '700', color: '#fff' },
  heroDesignation: { fontSize: 13, color: '#a8c0e0', marginTop: 4 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#ffffff22', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 5, marginTop: 12,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4cde8a' },
  statusText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 18, gap: 4,
  },
  cardTitle: {
    fontSize: 12, fontWeight: '700', color: '#888',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  rowIcon: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: '#e8eef7', alignItems: 'center', justifyContent: 'center',
  },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 11, color: '#999', fontWeight: '500' },
  rowValue: { fontSize: 14, color: '#111', fontWeight: '600', marginTop: 1 },
  rowValueHighlight: { color: '#1a7a4a' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#faeaea', borderRadius: 14, paddingVertical: 16,
    borderWidth: 1, borderColor: '#f5c6c2',
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#b03a2e' },
});
