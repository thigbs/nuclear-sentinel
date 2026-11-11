import { AlertLevel, OccurrenceCategory } from '../types';

interface CategoryRule {
  label: string;
  unit: string;
  atipicoFrom: number; // valor >= isso => atípico
  criticoFrom: number; // valor >= isso => crítico
}

export const CATEGORY_RULES: Record<OccurrenceCategory, CategoryRule> = {
  radiacao: { label: 'Radiação', unit: 'µSv/h', atipicoFrom: 0.5, criticoFrom: 2 },
  temperatura: { label: 'Temperatura', unit: '°C', atipicoFrom: 300, criticoFrom: 330 },
  pressao: { label: 'Pressão', unit: 'bar', atipicoFrom: 155, criticoFrom: 170 },
  vazamento: { label: 'Vazamento', unit: 'L/min', atipicoFrom: 1, criticoFrom: 10 },
};

/** Classifica a ocorrência em normal, atípica ou crítica conforme limites por categoria. */
export function classifyAlert(category: OccurrenceCategory, value: number): AlertLevel {
  const rule = CATEGORY_RULES[category];
  if (value >= rule.criticoFrom) return 'critico';
  if (value >= rule.atipicoFrom) return 'atipico';
  return 'normal';
}

export const ALERT_LABEL: Record<AlertLevel, string> = {
  normal: 'Normal',
  atipico: 'Atípico',
  critico: 'Crítico',
};

export const ALERT_COLOR: Record<AlertLevel, string> = {
  normal: '#2e9e5b',
  atipico: '#e0a100',
  critico: '#d63031',
};
