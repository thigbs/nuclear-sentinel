import { MOCK_USERS } from '../data/users';
import { User } from '../types';
import { KEYS, loadJSON, remove, saveJSON } from './storage';

export async function login(email: string, password: string): Promise<User> {
  await new Promise((r) => setTimeout(r, 400)); // simula latência de rede
  const found = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!found) throw new Error('E-mail ou senha inválidos.');
  const { password: _pw, ...user } = found;
  await saveJSON(KEYS.session, user);
  return user;
}

export const restoreSession = () => loadJSON<User>(KEYS.session);
export const logout = () => remove(KEYS.session);
