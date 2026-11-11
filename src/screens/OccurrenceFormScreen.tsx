import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OccurrenceCategory, RootStackParamList } from '../types';
import { addOccurrence } from '../services/occurrenceService';
import { CATEGORY_RULES, classifyAlert, ALERT_LABEL, ALERT_COLOR } from '../services/alertClassifier';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/FormField';

type Props = NativeStackScreenProps<RootStackParamList, 'OccurrenceForm'>;
type Errors = Partial<Record<'title' | 'description' | 'location' | 'value', string>>;

export default function OccurrenceFormScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [category, setCategory] = useState<OccurrenceCategory>('radiacao');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const rule = CATEGORY_RULES[category];
  const parsed = Number(value.replace(',', '.'));
  const previewValid = value.trim() !== '' && !isNaN(parsed) && parsed >= 0;
  const preview = previewValid ? classifyAlert(category, parsed) : null;

  function validate(): Errors {
    const e: Errors = {};
    if (title.trim().length < 5) e.title = 'O título deve ter ao menos 5 caracteres.';
    if (description.trim().length < 10) e.description = 'A descrição deve ter ao menos 10 caracteres.';
    if (!location.trim()) e.location = 'Informe o local da ocorrência.';
    if (value.trim() === '') e.value = 'Informe o valor medido.';
    else if (isNaN(parsed) || parsed < 0) e.value = 'Informe um número válido (maior ou igual a 0).';
    return e;
  }

  async function handleSave() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const created = await addOccurrence({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      category,
      measuredValue: parsed,
      createdBy: user?.name ?? 'Desconhecido',
    });
    Alert.alert('Ocorrência registrada', `Classificação: ${ALERT_LABEL[created.alertLevel]}`);
    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.chips}>
        {(Object.keys(CATEGORY_RULES) as OccurrenceCategory[]).map((c) => (
          <Pressable key={c} onPress={() => setCategory(c)} style={[styles.chip, category === c && styles.chipActive]}>
            <Text style={[styles.chipText, category === c && { color: '#fff' }]}>{CATEGORY_RULES[c].label}</Text>
          </Pressable>
        ))}
      </View>

      <FormField label="Título" value={title} onChangeText={setTitle} error={errors.title} placeholder="Ex.: Pico de temperatura" />
      <FormField label="Descrição" value={description} onChangeText={setDescription} error={errors.description}
        multiline numberOfLines={4} style={{ height: 100, textAlignVertical: 'top' }} placeholder="Descreva o que foi observado" />
      <FormField label="Local" value={location} onChangeText={setLocation} error={errors.location} placeholder="Ex.: Sala de Controle" />
      <FormField label={`Valor medido (${rule.unit})`} value={value} onChangeText={setValue} error={errors.value}
        keyboardType="decimal-pad" placeholder="0" />

      {preview && (
        <Text style={[styles.preview, { color: ALERT_COLOR[preview] }]}>
          Classificação prevista: {ALERT_LABEL[preview]}
        </Text>
      )}

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Registrar ocorrência</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef2f6' },
  label: { fontWeight: '600', color: '#0b1f33', marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#dbe3ec' },
  chipActive: { backgroundColor: '#0b1f33' },
  chipText: { color: '#0b1f33', fontWeight: '600' },
  preview: { fontWeight: '700', marginBottom: 12 },
  button: { backgroundColor: '#0b6cff', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
