export type UserRole = 'operador' | 'supervisor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserCredentials extends User {
  password: string;
}

export type AlertLevel = 'normal' | 'atipico' | 'critico';
export type OccurrenceStatus = 'aberta' | 'em_analise' | 'resolvida';
export type OccurrenceCategory = 'radiacao' | 'temperatura' | 'pressao' | 'vazamento';

export interface Occurrence {
  id: string;
  title: string;
  description: string;
  location: string;
  category: OccurrenceCategory;
  measuredValue: number;
  alertLevel: AlertLevel;
  status: OccurrenceStatus;
  createdAt: string; // ISO
  createdBy: string; // nome do usuário
}

export type NewOccurrenceInput = Omit<
  Occurrence,
  'id' | 'alertLevel' | 'status' | 'createdAt'
>;

export type RootStackParamList = {
  Login: undefined;
  OccurrenceList: undefined;
  OccurrenceForm: undefined;
  OccurrenceDetail: { id: string };
};
