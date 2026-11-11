import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export default function FormField({ label, error, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#999"
        style={[styles.input, !!error && styles.inputError, style]}
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontWeight: '600', marginBottom: 6, color: '#0b1f33' },
  input: { borderWidth: 1, borderColor: '#c9d2dc', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  inputError: { borderColor: '#d63031' },
  error: { color: '#d63031', marginTop: 4, fontSize: 12 },
});
