import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import FormField from '../components/FormField';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Informe o e-mail.';
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'E-mail inválido.';
    if (!password) e.password = 'Informe a senha.';
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : 'Erro ao entrar.' });
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Text style={styles.logo}>☢ Nuclear Sentinel</Text>
      <Text style={styles.subtitle}>AMAZUL • Monitoramento de ocorrências</Text>
      <View style={styles.card}>
        <FormField label="E-mail" value={email} onChangeText={setEmail} error={errors.email}
          autoCapitalize="none" keyboardType="email-address" placeholder="operador@amazul.com" />
        <FormField label="Senha" value={password} onChangeText={setPassword} error={errors.password}
          secureTextEntry placeholder="••••••" />
        {!!errors.general && <Text style={styles.general}>{errors.general}</Text>}
        <Pressable style={styles.button} onPress={handleLogin} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1f33', justifyContent: 'center', padding: 24 },
  logo: { color: '#fff', fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#9fb3c8', textAlign: 'center', marginBottom: 24, marginTop: 4 },
  card: { backgroundColor: '#f4f7fa', borderRadius: 14, padding: 18 },
  general: { color: '#d63031', marginBottom: 10, fontWeight: '600' },
  button: { backgroundColor: '#0b6cff', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
