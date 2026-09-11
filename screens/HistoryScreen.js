import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TextInput, FlatList, TouchableOpacity, ScrollView,
  Modal, Animated, Pressable, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ENQUIRIES = [
  { id: '1',  name: 'Arjun Kapoor',   car: 'Toyota Hyryder',              bank: 'SBI',      roi: '8.60%', status: 'Disbursed',   date: 'Today, 10:24 AM' },
  { id: '2',  name: 'Priya Sharma',   car: 'Toyota Urban Cruiser Hyryder', bank: 'HDFC',     roi: '8.90%', status: 'In-Progress', date: 'Today, 09:10 AM' },
  { id: '3',  name: 'Amit Verma',     car: 'Toyota Glanza',               bank: 'BOB',      roi: '8.60%', status: 'Disbursed',   date: 'Yesterday, 4:45 PM' },
  { id: '4',  name: 'Sneha Patil',    car: 'Toyota Hyryder',              bank: 'ICICI',    roi: '8.90%', status: 'Rejected',    date: 'Yesterday, 2:30 PM' },
  { id: '5',  name: 'Karan Singh',    car: 'Toyota Fortuner',             bank: 'Kotak',    roi: '8.80%', status: 'Sanctioned',  date: '25 Aug, 11:00 AM' },
  { id: '6',  name: 'Deepika Nair',   car: 'Toyota Camry',                bank: 'PNB',      roi: '8.70%', status: 'In-Progress', date: '25 Aug, 09:50 AM' },
  { id: '7',  name: 'Vikram Joshi',   car: 'Toyota Innova Crysta',        bank: 'Yes Bank', roi: '8.75%', status: 'Disbursed',   date: '24 Aug, 3:15 PM' },
  { id: '8',  name: 'Ananya Reddy',   car: 'Toyota Hyryder',              bank: 'Federal',  roi: '9.10%', status: 'Rejected',    date: '24 Aug, 1:00 PM' },
  { id: '9',  name: 'Rohan Desai',    car: 'Toyota Yaris',                bank: 'Axis',     roi: '8.75%', status: 'In-Progress', date: '02 Sep, 09:45 AM' },
  { id: '10', name: 'Meera Iyer',     car: 'Toyota Innova HyCross',       bank: 'IDFC',     roi: '8.65%', status: 'Sanctioned',  date: '01 Sep, 09:20 AM' },
  { id: '11', name: 'Suresh Nambiar', car: 'Toyota Fortuner',             bank: 'SBI',      roi: '8.55%', status: 'In-Progress', date: '30 Aug, 1:45 PM' },
  { id: '12', name: 'Kavya Menon',    car: 'Toyota Taisor',               bank: 'HDFC',     roi: '8.85%', status: 'In-Progress', date: '03 Sep, 09:50 AM' },
];

const STATUS_CONFIG = {
  'In-Progress': { color: '#5c6bc0', bg: '#ede7f6', icon: 'sync-outline' },
  Sanctioned:    { color: '#1a7a4a', bg: '#e6f4ed', icon: 'checkmark-circle' },
  Disbursed:     { color: '#1a7a4a', bg: '#e6f4ed', icon: 'checkmark-circle-outline' },
  Rejected:      { color: '#b03a2e', bg: '#faeaea', icon: 'close-circle' },
};

const TAG_COLORS = [
  { id: 'red',    hex: '#ef4444', label: 'Red' },
  { id: 'orange', hex: '#f97316', label: 'Orange' },
  { id: 'yellow', hex: '#eab308', label: 'Yellow' },
  { id: 'green',  hex: '#22c55e', label: 'Green' },
  { id: 'blue',   hex: '#3b82f6', label: 'Blue' },
  { id: 'purple', hex: '#a855f7', label: 'Purple' },
];

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2);
}

function EnquiryCard({ item, tag, onLongPress }) {
  const s = STATUS_CONFIG[item.status];
  const tagColor = tag ? TAG_COLORS.find(c => c.id === tag.color)?.hex : null;

  return (
    <TouchableOpacity
      style={[styles.card, tagColor && { borderLeftWidth: 4, borderLeftColor: tagColor }]}
      activeOpacity={0.75}
      onLongPress={() => onLongPress(item)}
      delayLongPress={350}
    >
      {/* Avatar with tag dot */}
      <View style={styles.avatarWrap}>
        <Text style={styles.avatarText}>{initials(item.name)}</Text>
        {tagColor && (
          <View style={[styles.tagDot, { backgroundColor: tagColor }]} />
        )}
      </View>

      {/* Content */}
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={styles.customerName}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
            <Ionicons name={s.icon} size={11} color={s.color} />
            <Text style={[styles.statusText, { color: s.color }]}>{item.status}</Text>
          </View>
        </View>

        {/* Tag note pill */}
        {tag?.note ? (
          <View style={[styles.tagNotePill, { backgroundColor: tagColor + '22' }]}>
            <View style={[styles.tagNoteDot, { backgroundColor: tagColor }]} />
            <Text style={[styles.tagNoteText, { color: tagColor }]} numberOfLines={1}>{tag.note}</Text>
          </View>
        ) : null}

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
  const [activeTagFilter, setActiveTagFilter] = useState(null);
  const [tags, setTags] = useState({});
  const [sheetItem, setSheetItem] = useState(null);
  const [sheetColor, setSheetColor] = useState(TAG_COLORS[0].id);
  const [sheetNote, setSheetNote] = useState('');
  const [showTagFilterSheet, setShowTagFilterSheet] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const openSheet = (item) => {
    const existing = tags[item.id];
    setSheetColor(existing?.color || TAG_COLORS[0].id);
    setSheetNote(existing?.note || '');
    setSheetItem(item);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }).start();
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, { toValue: 300, duration: 220, useNativeDriver: true }).start(() => setSheetItem(null));
  };

  const saveTag = () => {
    setTags(prev => ({ ...prev, [sheetItem.id]: { color: sheetColor, note: sheetNote.trim() } }));
    closeSheet();
  };

  const removeTag = () => {
    setTags(prev => { const next = { ...prev }; delete next[sheetItem.id]; return next; });
    closeSheet();
  };

  const filtered = ENQUIRIES.filter(item => {
    const matchStatus = activeFilter === 'All' || item.status === activeFilter;
    const matchTag = !activeTagFilter || (tags[item.id]?.color === activeTagFilter);
    const q = query.toLowerCase();
    const matchQuery = !q || item.name.toLowerCase().includes(q) || item.car.toLowerCase().includes(q) || item.bank.toLowerCase().includes(q);
    return matchStatus && matchTag && matchQuery;
  });

  const tagFilterColor = activeTagFilter ? TAG_COLORS.find(c => c.id === activeTagFilter)?.hex : null;

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
      </View>

      {/* Filter chips */}
      <View style={styles.filterChipsScroll}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
          {['All', 'In-Progress', 'Sanctioned', 'Disbursed', 'Rejected'].map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.chipDivider} />

          {/* Tag filter chip */}
          <TouchableOpacity
            style={[styles.filterChip, styles.tagFilterChip, activeTagFilter && { borderColor: tagFilterColor, backgroundColor: tagFilterColor + '18' }]}
            onPress={() => setShowTagFilterSheet(true)}
          >
            {activeTagFilter
              ? <View style={[styles.tagFilterDot, { backgroundColor: tagFilterColor }]} />
              : <Ionicons name="pricetag-outline" size={13} color="#666" style={{ marginRight: 4 }} />
            }
            <Text style={[styles.filterChipText, activeTagFilter && { color: tagFilterColor }]}>
              {activeTagFilter ? TAG_COLORS.find(c => c.id === activeTagFilter)?.label : 'Tag'}
            </Text>
            {activeTagFilter && (
              <TouchableOpacity onPress={() => setActiveTagFilter(null)} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
                <Ionicons name="close-circle" size={14} color={tagFilterColor} style={{ marginLeft: 3 }} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Hint */}
      <View style={styles.hintBar}>
        <Ionicons name="hand-left-outline" size={11} color="#bbb" />
        <Text style={styles.hintText}>Long-press any card to tag it</Text>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <EnquiryCard item={item} tag={tags[item.id]} onLongPress={openSheet} />
        )}
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

      {/* Tag bottom sheet */}
      {sheetItem && (
        <Modal transparent animationType="none" onRequestClose={closeSheet}>
          <Pressable style={styles.sheetOverlay} onPress={closeSheet}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetKAV}>
              <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                <Pressable onPress={() => {}}>
                  {/* Handle */}
                  <View style={styles.sheetHandle} />

                  {/* Title row */}
                  <View style={styles.sheetTitleRow}>
                    <View>
                      <Text style={styles.sheetTitle}>Tag Enquiry</Text>
                      <Text style={styles.sheetSub}>{sheetItem.name} · {sheetItem.bank}</Text>
                    </View>
                    {tags[sheetItem.id] && (
                      <TouchableOpacity style={styles.removeTagBtn} onPress={removeTag}>
                        <Ionicons name="trash-outline" size={15} color="#b03a2e" />
                        <Text style={styles.removeTagText}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Color swatches */}
                  <Text style={styles.sheetLabel}>CHOOSE COLOR</Text>
                  <View style={styles.swatchRow}>
                    {TAG_COLORS.map(c => (
                      <TouchableOpacity
                        key={c.id}
                        style={[styles.swatch, { backgroundColor: c.hex }, sheetColor === c.id && styles.swatchSelected]}
                        onPress={() => setSheetColor(c.id)}
                        activeOpacity={0.8}
                      >
                        {sheetColor === c.id && <Ionicons name="checkmark" size={16} color="#fff" />}
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Note input */}
                  <Text style={styles.sheetLabel}>ADD A NOTE <Text style={styles.sheetLabelOpt}>(optional)</Text></Text>
                  <TextInput
                    style={styles.noteInput}
                    placeholder="e.g. Follow up Monday, Priority case..."
                    placeholderTextColor="#bbb"
                    value={sheetNote}
                    onChangeText={setSheetNote}
                    maxLength={40}
                    returnKeyType="done"
                  />

                  {/* Save button */}
                  <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: TAG_COLORS.find(c => c.id === sheetColor)?.hex }]}
                    onPress={saveTag}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="pricetag" size={16} color="#fff" />
                    <Text style={styles.saveBtnText}>Save Tag</Text>
                  </TouchableOpacity>
                </Pressable>
              </Animated.View>
            </KeyboardAvoidingView>
          </Pressable>
        </Modal>
      )}

      {/* Tag filter color picker sheet */}
      {showTagFilterSheet && (
        <Modal transparent animationType="fade" onRequestClose={() => setShowTagFilterSheet(false)}>
          <Pressable style={styles.sheetOverlay} onPress={() => setShowTagFilterSheet(false)}>
            <View style={styles.tagFilterSheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Filter by Tag Color</Text>
              <Text style={styles.sheetSub}>Show only enquiries with a specific tag</Text>
              <View style={styles.tagFilterGrid}>
                {TAG_COLORS.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.tagFilterOption, activeTagFilter === c.id && { borderColor: c.hex, backgroundColor: c.hex + '15' }]}
                    onPress={() => { setActiveTagFilter(c.id); setShowTagFilterSheet(false); }}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.tagFilterOptionDot, { backgroundColor: c.hex }]} />
                    <Text style={[styles.tagFilterOptionText, activeTagFilter === c.id && { color: c.hex, fontWeight: '700' }]}>{c.label}</Text>
                    {activeTagFilter === c.id && <Ionicons name="checkmark-circle" size={16} color={c.hex} style={{ marginLeft: 'auto' }} />}
                  </TouchableOpacity>
                ))}
              </View>
              {activeTagFilter && (
                <TouchableOpacity style={styles.clearTagFilterBtn} onPress={() => { setActiveTagFilter(null); setShowTagFilterSheet(false); }}>
                  <Text style={styles.clearTagFilterText}>Clear Tag Filter</Text>
                </TouchableOpacity>
              )}
            </View>
          </Pressable>
        </Modal>
      )}
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
  countBadge: { backgroundColor: '#e8eef7', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 3 },
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

  filterChipsScroll: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e8e8e8' },
  filterChips: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#d0d0d0',
  },
  filterChipActive: { backgroundColor: '#1a3a6b', borderColor: '#1a3a6b' },
  filterChipText: { fontSize: 13, fontWeight: '600', color: '#444' },
  filterChipTextActive: { color: '#fff' },
  chipDivider: { width: 1, height: 22, backgroundColor: '#e0e0e0', marginHorizontal: 2 },

  tagFilterChip: { flexDirection: 'row', alignItems: 'center', gap: 4, borderStyle: 'dashed' },
  tagFilterDot: { width: 10, height: 10, borderRadius: 5, marginRight: 2 },

  hintBar: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 16, paddingVertical: 6,
    backgroundColor: '#fafbfd',
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  hintText: { fontSize: 11, color: '#bbb', fontStyle: 'italic' },

  list: { padding: 16, paddingBottom: 30 },

  card: {
    backgroundColor: '#fff', borderRadius: 14,
    flexDirection: 'row', padding: 14, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    overflow: 'hidden',
  },
  avatarWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#1a3a6b', alignItems: 'center', justifyContent: 'center',
    marginTop: 2,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  tagDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 13, height: 13, borderRadius: 7,
    borderWidth: 2, borderColor: '#fff',
  },

  cardBody: { flex: 1, gap: 5 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  customerName: { fontSize: 15, fontWeight: '700', color: '#111', flex: 1, marginRight: 8 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  statusText: { fontSize: 11, fontWeight: '700' },

  tagNotePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20,
  },
  tagNoteDot: { width: 6, height: 6, borderRadius: 3 },
  tagNoteText: { fontSize: 11, fontWeight: '600', maxWidth: 180 },

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

  emptyWrap: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 14, color: '#bbb', fontWeight: '500' },

  // ── Bottom Sheet ──
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheetKAV: { justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 36, paddingTop: 12,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e0e0e0', alignSelf: 'center', marginBottom: 18 },
  sheetTitleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: '#1a3a6b' },
  sheetSub: { fontSize: 12, color: '#999', marginTop: 3 },
  removeTagBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#faeaea', paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 10,
  },
  removeTagText: { fontSize: 12, fontWeight: '700', color: '#b03a2e' },

  sheetLabel: { fontSize: 10, fontWeight: '800', color: '#aaa', letterSpacing: 0.8, marginBottom: 10 },
  sheetLabelOpt: { fontWeight: '500', color: '#ccc' },

  swatchRow: { flexDirection: 'row', gap: 12, marginBottom: 22 },
  swatch: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  swatchSelected: { borderWidth: 3, borderColor: '#1a1a2e' },

  noteInput: {
    backgroundColor: '#f5f5f5', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: '#111',
    borderWidth: 1.5, borderColor: '#ebebeb',
    marginBottom: 20,
  },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 15, borderRadius: 14,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // ── Tag filter sheet ──
  tagFilterSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 36, paddingTop: 12,
  },
  tagFilterGrid: { gap: 8, marginTop: 16, marginBottom: 8 },
  tagFilterOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    borderRadius: 12, borderWidth: 1.5, borderColor: '#ebebeb',
    backgroundColor: '#fafafa',
  },
  tagFilterOptionDot: { width: 18, height: 18, borderRadius: 9 },
  tagFilterOptionText: { fontSize: 14, fontWeight: '600', color: '#333' },
  clearTagFilterBtn: {
    marginTop: 12, paddingVertical: 13, borderRadius: 12,
    backgroundColor: '#faeaea', alignItems: 'center',
  },
  clearTagFilterText: { fontSize: 14, fontWeight: '700', color: '#b03a2e' },
});
