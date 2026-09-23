import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, TextInput, Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ROLE_CONFIG = {
  'Team Leader':         { color: '#1a7a4a', bg: '#e6f4ed' },
  'Insurance Executive': { color: '#3b5bdb', bg: '#f0f4ff' },
  'Finance Executive':   { color: '#1a3a6b', bg: '#e8eef7' },
};

const AVATAR_COLORS = ['#1a3a6b','#1a7a4a','#5c6bc0','#b07d1a','#2a7a8a','#8a3a6b','#b03a2e','#3a6b3a'];

const INITIAL_USERS = [
  { id: '1',  name: 'Shylaja',         role: 'Team Leader',         branch: 'Hosur Road',   phone: '+91 98001 00001', status: 'Active', joined: 'Jan 2020' },
  { id: '2',  name: 'Sandeep',         role: 'Insurance Executive', branch: 'Hosur Road',   phone: '+91 98001 00002', status: 'Active', joined: 'Jan 2021' },
  { id: '3',  name: 'Vijay',           role: 'Insurance Executive', branch: 'Hosur Road',   phone: '+91 98001 00003', status: 'Active', joined: 'Feb 2021' },
  { id: '4',  name: 'Bhaskar',         role: 'Insurance Executive', branch: 'Hosur Road',   phone: '+91 98001 00004', status: 'Active', joined: 'Mar 2021' },
  { id: '5',  name: 'Hirelinga',       role: 'Insurance Executive', branch: 'Hosur Road',   phone: '+91 98001 00005', status: 'Active', joined: 'Apr 2021' },
  { id: '6',  name: 'Hemalatha',       role: 'Insurance Executive', branch: 'Hosur Road',   phone: '+91 98001 00006', status: 'Active', joined: 'May 2021' },
  { id: '7',  name: 'Sunil',           role: 'Insurance Executive', branch: 'K P Road',     phone: '+91 98001 00007', status: 'Active', joined: 'Jun 2021' },
  { id: '8',  name: 'Shailesh',        role: 'Insurance Executive', branch: 'K P Road',     phone: '+91 98001 00008', status: 'Active', joined: 'Jun 2021' },
  { id: '9',  name: 'Dilip',           role: 'Insurance Executive', branch: 'K P Road',     phone: '+91 98001 00009', status: 'Active', joined: 'Jul 2021' },
  { id: '10', name: 'Srivasta',        role: 'Insurance Executive', branch: 'K P Road',     phone: '+91 98001 00010', status: 'Active', joined: 'Aug 2021' },
  { id: '11', name: 'Anu',             role: 'Insurance Executive', branch: 'K P Road',     phone: '+91 98001 00011', status: 'Active', joined: 'Aug 2021' },
  { id: '12', name: 'Mahesh',          role: 'Finance Executive',   branch: 'Queens Road',  phone: '+91 98001 00012', status: 'Active', joined: 'Sep 2021' },
  { id: '13', name: 'Shivu',           role: 'Finance Executive',   branch: 'Queens Road',  phone: '+91 98001 00013', status: 'Active', joined: 'Sep 2021' },
  { id: '14', name: 'Kavitha',         role: 'Finance Executive',   branch: 'Queens Road',  phone: '+91 98001 00014', status: 'Active', joined: 'Oct 2021' },
  { id: '15', name: 'Gajalakshmi',     role: 'Insurance Executive', branch: 'Banaswadi',    phone: '+91 98001 00015', status: 'Active', joined: 'Nov 2021' },
  { id: '16', name: 'Nagesh',          role: 'Insurance Executive', branch: 'Banaswadi',    phone: '+91 98001 00016', status: 'Active', joined: 'Nov 2021' },
  { id: '17', name: 'Lakshminarayana', role: 'Insurance Executive', branch: 'Banaswadi',    phone: '+91 98001 00017', status: 'Active', joined: 'Nov 2021' },
  { id: '18', name: 'Pavithra',        role: 'Insurance Executive', branch: 'Banaswadi',    phone: '+91 98001 00018', status: 'Active', joined: 'Dec 2021' },
  { id: '19', name: 'Harish',          role: 'Insurance Executive', branch: 'White Field',  phone: '+91 98001 00019', status: 'Active', joined: 'Dec 2021' },
  { id: '20', name: 'Pradeep',         role: 'Insurance Executive', branch: 'White Field',  phone: '+91 98001 00020', status: 'Active', joined: 'Dec 2021' },
  { id: '21', name: 'Girish',          role: 'Insurance Executive', branch: 'B G Road',     phone: '+91 98001 00021', status: 'Active', joined: 'Jan 2022' },
];

const ROLES = ['Insurance Executive', 'Finance Executive', 'Team Leader'];
let nextUserId = 200;

function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2); }

export default function UsersScreen() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'Finance Executive', branch: '', phone: '' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = users.filter(u => {
    const q = query.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.branch.toLowerCase().includes(q);
  });

  const addUser = () => {
    if (!form.name.trim() || !form.branch.trim() || !form.phone.trim()) return;
    setUsers(prev => [...prev, {
      id: String(nextUserId++),
      name: form.name.trim(),
      role: form.role,
      branch: form.branch.trim(),
      phone: form.phone.trim(),
      status: 'Active',
      joined: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
    }]);
    setForm({ name: '', role: 'Finance Executive', branch: '', phone: '' });
    setModal(false);
  };

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const renderUser = ({ item, index }) => {
    const rc = ROLE_CONFIG[item.role] || ROLE_CONFIG['Finance Executive'];
    const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
    return (
      <View style={styles.userCard}>
        <View style={[styles.userAvatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.userAvatarText}>{initials(item.name)}</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.userTopRow}>
            <Text style={styles.userName}>{item.name}</Text>
            <TouchableOpacity
              style={[styles.statusToggle, { backgroundColor: item.status === 'Active' ? '#e6f4ed' : '#f5f5f5' }]}
              onPress={() => toggleStatus(item.id)}
            >
              <View style={[styles.statusDot, { backgroundColor: item.status === 'Active' ? '#1a7a4a' : '#bbb' }]} />
              <Text style={[styles.statusToggleText, { color: item.status === 'Active' ? '#1a7a4a' : '#999' }]}>
                {item.status}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: rc.bg }]}>
            <Text style={[styles.roleBadgeText, { color: rc.color }]}>{item.role}</Text>
          </View>
          <View style={styles.userMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="business-outline" size={11} color="#aaa" />
              <Text style={styles.metaText}>{item.branch}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="call-outline" size={11} color="#aaa" />
              <Text style={styles.metaText}>{item.phone}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={11} color="#aaa" />
              <Text style={styles.metaText}>Since {item.joined}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>User Management</Text>
          <Text style={styles.headerSub}>{users.filter(u => u.status === 'Active').length} active · {users.length} total</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModal(true)}>
          <Ionicons name="person-add-outline" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add User</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={17} color="#aaa" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, role or branch..."
          placeholderTextColor="#bbb"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={17} color="#bbb" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="people-outline" size={36} color="#ccc" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />

      {/* Add User Modal */}
      <Modal visible={modal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModal(false)} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Add New User</Text>

          <Text style={styles.modalLabel}>Full Name</Text>
          <TextInput style={styles.modalInput} placeholder="e.g. Rohit Sharma" placeholderTextColor="#bbb" value={form.name} onChangeText={v => set('name', v)} />

          <Text style={styles.modalLabel}>Role</Text>
          <View style={styles.roleChips}>
            {ROLES.map(r => (
              <TouchableOpacity
                key={r}
                style={[styles.roleChip, form.role === r && styles.roleChipActive]}
                onPress={() => set('role', r)}
              >
                <Text style={[styles.roleChipText, form.role === r && styles.roleChipTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.modalLabel}>Branch</Text>
          <TextInput style={styles.modalInput} placeholder="e.g. Koramangala" placeholderTextColor="#bbb" value={form.branch} onChangeText={v => set('branch', v)} />

          <Text style={styles.modalLabel}>Phone</Text>
          <TextInput style={styles.modalInput} placeholder="+91 98765 XXXXX" placeholderTextColor="#bbb" keyboardType="phone-pad" value={form.phone} onChangeText={v => set('phone', v)} />

          <TouchableOpacity
            style={[styles.modalConfirm, (!form.name.trim() || !form.branch.trim() || !form.phone.trim()) && { opacity: 0.45 }]}
            disabled={!form.name.trim() || !form.branch.trim() || !form.phone.trim()}
            onPress={addUser}
          >
            <Text style={styles.modalConfirmText}>Add User</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: '#e8e8e8',
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a3a6b' },
  headerSub: { fontSize: 12, color: '#888', marginTop: 2, fontWeight: '500' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#1a3a6b', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1, borderColor: '#eee',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111', padding: 0 },

  list: { padding: 16, paddingBottom: 40 },

  userCard: {
    backgroundColor: '#fff', borderRadius: 14,
    flexDirection: 'row', padding: 14, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  userAvatar: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  userAvatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  userInfo: { flex: 1, gap: 5 },
  userTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userName: { fontSize: 15, fontWeight: '700', color: '#111' },
  statusToggle: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusToggleText: { fontSize: 11, fontWeight: '700' },
  roleBadge: {
    alignSelf: 'flex-start', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  roleBadgeText: { fontSize: 11, fontWeight: '700' },
  userMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 11, color: '#888', fontWeight: '500' },

  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14, color: '#bbb', fontWeight: '500' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40, gap: 10,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#e0e0e0',
    alignSelf: 'center', marginBottom: 4,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 4 },
  modalLabel: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: -2 },
  modalInput: {
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: '#111',
  },
  roleChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#ddd', backgroundColor: '#fff',
  },
  roleChipActive: { backgroundColor: '#1a3a6b', borderColor: '#1a3a6b' },
  roleChipText: { fontSize: 12, color: '#555', fontWeight: '600' },
  roleChipTextActive: { color: '#fff' },
  modalConfirm: {
    backgroundColor: '#1a3a6b', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 6,
  },
  modalConfirmText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
