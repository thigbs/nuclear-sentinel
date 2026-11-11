import { NewOccurrenceInput } from '../types';

// Catálogo inicial (o alertLevel é calculado pelo classificador ao popular).
export const SEED_OCCURRENCES: (NewOccurrenceInput & { daysAgo: number })[] = [
  { title: 'Leitura de radiação normal', description: 'Medição de rotina no corredor de acesso.', location: 'Corredor A', category: 'radiacao', measuredValue: 0.2, createdBy: 'Carlos Operador', daysAgo: 3 },
  { title: 'Aumento de temperatura no circuito primário', description: 'Temperatura acima do esperado após ajuste de carga.', location: 'Sala de Controle', category: 'temperatura', measuredValue: 312, createdBy: 'Carlos Operador', daysAgo: 2 },
  { title: 'Vazamento de refrigerante', description: 'Vazamento detectado na válvula V-12 do sistema auxiliar.', location: 'Casa de Máquinas', category: 'vazamento', measuredValue: 14, createdBy: 'Marina Supervisora', daysAgo: 1 },
  { title: 'Pressão estável', description: 'Verificação de rotina do pressurizador.', location: 'Contenção', category: 'pressao', measuredValue: 150, createdBy: 'Carlos Operador', daysAgo: 0 },
];
