import { OccurrenceStatus, UserRole } from '../types';

export const STATUS_LABEL: Record<OccurrenceStatus, string> = {
  aberta: 'Aberta',
  em_analise: 'Em análise',
  resolvida: 'Resolvida',
};

export const ROLE_LABEL: Record<UserRole, string> = {
  operador: 'Operador',
  supervisor: 'Supervisor',
};
