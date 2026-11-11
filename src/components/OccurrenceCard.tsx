import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Occurrence } from '../types';
import { CATEGORY_RULES, ALERT_COLOR } from '../services/alertClassifier';
import { STATUS_LABEL } from '../utils/labels';
import AlertBadge from './AlertBadge';

export default function OccurrenceCard({ item, onPress }: { item: Occurrence; onPress: () => void }) {
  const rule = CATEGORY_RULES[item.category];
  return (
    <Pressable onPress={onPress} style={[styles.card, { borderLeftColor: ALERT_COLOR[item.alertLevel] }]}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <AlertBadge level={item.alertLevel} />
      </View>
      <Text style={styles.meta}>
        {rule.label}: {item.measuredValue} {rule.unit} • {item.location}
      </Text>
      <Text style={styles.meta}>
        {STATUS_LABEL[item.status]} • {new Date(item.createdAt).toLocaleDateString('pt-BR')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, borderLeftWidth: 6, elevation: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 8 },
  title: { fontWeight: '700', fontSize: 16, flex: 1, color: '#0b1f33' },
  meta: { color: '#55657a', fontSize: 13, marginTop: 2 },
});
