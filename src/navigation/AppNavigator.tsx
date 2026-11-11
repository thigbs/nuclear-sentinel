import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import OccurrenceListScreen from '../screens/OccurrenceListScreen';
import OccurrenceFormScreen from '../screens/OccurrenceFormScreen';
import OccurrenceDetailScreen from '../screens/OccurrenceDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#0b1f33' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0b1f33' },
          headerTintColor: '#fff',
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="OccurrenceList" component={OccurrenceListScreen} options={{ title: 'Ocorrências' }} />
            <Stack.Screen name="OccurrenceForm" component={OccurrenceFormScreen} options={{ title: 'Nova ocorrência' }} />
            <Stack.Screen name="OccurrenceDetail" component={OccurrenceDetailScreen} options={{ title: 'Detalhes' }} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
