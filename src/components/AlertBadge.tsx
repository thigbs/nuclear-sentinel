import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AlertLevel } from '../types';
import { ALERT_COLOR, ALERT_LABEL } from '../services/alertClassifier';

export default function AlertBadge({ level }: { level: AlertLevel }) {
  return (
    <View style={[styles.badge, { backgroundColor: ALERT_COLOR[level] }]}>
      <Text style={styles.text}>{ALERT_LABEL[level]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  text: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
