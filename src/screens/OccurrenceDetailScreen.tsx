import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { Occurrence, OccurrenceStatus, RootStackParamList } from '../types';
import { getOccurrenceById, updateStatus } from '../services/occurrenceService';
import { CATEGORY_RULES } from '../services/alertClassifier';
import { STATUS_LABEL } from '../utils/labels';
import { useAuth } from '../context/AuthContext';
import AlertBadge from '../components/AlertBadge';

type Props = NativeStackScreenProps<RootStackParamList, 'OccurrenceDetail'>;
const STATUSES: OccurrenceStatus[] = ['aberta', 'em_analise', 'resolvida'];

export default function OccurrenceDetailScreen({ route }: Props) {
  const { hasRole } = useAuth();
  const [item, setItem] = useState<Occurrence | undefined>();
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    getOccurrenceById(route.params.id).then((o) => {
      setItem(o);
      setLoaded(true);
    });
  }, [route.params.id]);

  useFocusEffect(load);

  async function changeStatus(status: OccurrenceStatus) {
    await updateStatus(route.params.id, status);
    load();
  }

  if (!loaded) return null;
  if (!item) return <Text style={styles.notFound}>Ocorrência não encontrada.</Text>;

  const rule = CATEGORY_RULES[item.category];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <AlertBadge level={item.alertLevel} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>

      <View style={styles.box}>
        <Row k="Categoria" v={rule.label} />
        <Row k="Valor medido" v={`${item.measuredValue} ${rule.unit}`} />
        <Row k="Local" v={item.location} />
        <Row k="Status" v={STATUS_LABEL[item.status]} />
        <Row k="Registrado por" v={item.createdBy} />
        <Row k="Data" v={new Date(item.createdAt).toLocaleString('pt-BR')} />
      </View>

      <Text style={styles.section}>Gerenciar status</Text>
      {hasRole('supervisor') ? (
        <View style={styles.row}>
          {STATUSES.map((s) => (
            <Pressable key={s} onPress={() => changeStatus(s)} style={[styles.chip, item.status === s && styles.chipActive]}>
              <Text style={[styles.chipText, item.status === s && { color: '#fff' }]}>{STATUS_LABEL[s]}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Text style={styles.hint}>Apenas supervisores podem alterar o status das ocorrências.</Text>
      )}
    </ScrollView>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.k}>{k}</Text>
      <Text style={styles.v}>{v}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f6' },
  notFound: { padding: 20, textAlign: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#0b1f33', marginTop: 10 },
  desc: { color: '#33445a', marginVertical: 10, lineHeight: 20 },
  box: { backgroundColor: '#fff', borderRadius: 10, padding: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  k: { color: '#55657a' },
  v: { fontWeight: '600', color: '#0b1f33', flexShrink: 1, textAlign: 'right' },
  section: { fontWeight: '700', marginTop: 20, marginBottom: 8, color: '#0b1f33' },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#dbe3ec' },
  chipActive: { backgroundColor: '#0b1f33' },
  chipText: { color: '#0b1f33', fontWeight: '600' },
  hint: { color: '#55657a', fontStyle: 'italic' },
});
