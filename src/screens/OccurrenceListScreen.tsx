import React, { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { AlertLevel, Occurrence, RootStackParamList } from '../types';
import { getOccurrences } from '../services/occurrenceService';
import { ALERT_LABEL } from '../services/alertClassifier';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABEL } from '../utils/labels';
import OccurrenceCard from '../components/OccurrenceCard';

type Props = NativeStackScreenProps<RootStackParamList, 'OccurrenceList'>;
type Filter = AlertLevel | 'todos';
const FILTERS: Filter[] = ['todos', 'normal', 'atipico', 'critico'];

export default function OccurrenceListScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const [items, setItems] = useState<Occurrence[]>([]);
  const [filter, setFilter] = useState<Filter>('todos');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={signOut}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Sair</Text>
        </Pressable>
      ),
    });
  }, [navigation, signOut]);

  useFocusEffect(
    useCallback(() => {
      getOccurrences().then(setItems);
    }, [])
  );

  const visible = filter === 'todos' ? items : items.filter((o) => o.alertLevel === filter);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Olá, {user?.name} ({user ? ROLE_LABEL[user.role] : ''})
      </Text>

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, filter === f && styles.chipActive]}>
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
              {f === 'todos' ? 'Todos' : ALERT_LABEL[f]}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={visible}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <OccurrenceCard item={item} onPress={() => navigation.navigate('OccurrenceDetail', { id: item.id })} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma ocorrência encontrada.</Text>}
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <Pressable style={styles.fab} onPress={() => navigation.navigate('OccurrenceForm')}>
        <Text style={styles.fabText}>+ Nova ocorrência</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f6', padding: 14 },
  welcome: { color: '#0b1f33', fontWeight: '600', marginBottom: 10 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#dbe3ec' },
  chipActive: { backgroundColor: '#0b1f33' },
  chipText: { color: '#0b1f33', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  empty: { textAlign: 'center', color: '#55657a', marginTop: 40 },
  fab: { position: 'absolute', right: 16, bottom: 20, backgroundColor: '#0b6cff', paddingHorizontal: 18, paddingVertical: 14, borderRadius: 28, elevation: 4 },
  fabText: { color: '#fff', fontWeight: '700' },
});
