import { SEED_OCCURRENCES } from '../data/occurrences';
import { NewOccurrenceInput, Occurrence, OccurrenceStatus } from '../types';
import { classifyAlert } from './alertClassifier';
import { KEYS, loadJSON, saveJSON } from './storage';

function buildSeed(): Occurrence[] {
  return SEED_OCCURRENCES.map(({ daysAgo, ...o }, i): Occurrence => ({
    ...o,
    id: `seed-${i + 1}`,
    alertLevel: classifyAlert(o.category, o.measuredValue),
    status: i === 1 ? 'em_analise' : i === 0 || i === 3 ? 'resolvida' : 'aberta',
    createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  }));
}

export async function getOccurrences(): Promise<Occurrence[]> {
  let list = await loadJSON<Occurrence[]>(KEYS.occurrences);
  if (!list) {
    list = buildSeed();
    await saveJSON(KEYS.occurrences, list);
  }
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOccurrenceById(id: string): Promise<Occurrence | undefined> {
  return (await getOccurrences()).find((o) => o.id === id);
}

export async function addOccurrence(input: NewOccurrenceInput): Promise<Occurrence> {
  const list = await getOccurrences();
  const created: Occurrence = {
    ...input,
    id: `occ-${Date.now()}`,
    alertLevel: classifyAlert(input.category, input.measuredValue),
    status: 'aberta',
    createdAt: new Date().toISOString(),
  };
  await saveJSON(KEYS.occurrences, [created, ...list]);
  return created;
}

export async function updateStatus(id: string, status: OccurrenceStatus): Promise<void> {
  const list = await getOccurrences();
  await saveJSON(KEYS.occurrences, list.map((o) => (o.id === id ? { ...o, status } : o)));
}
