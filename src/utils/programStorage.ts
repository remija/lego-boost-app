import type { Program, Block } from '../types/blocks';

const STORAGE_KEY = 'lego-boost-programs';

export function getAllPrograms(): Program[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as Program[];
  } catch {
    return [];
  }
}

export function getProgram(id: string): Program | undefined {
  const programs = getAllPrograms();
  return programs.find((p) => p.id === id);
}

export function saveProgram(name: string, blocks: Block[]): Program {
  const programs = getAllPrograms();
  const now = Date.now();

  const program: Program = {
    id: crypto.randomUUID(),
    name,
    blocks,
    createdAt: now,
    updatedAt: now,
  };

  programs.push(program);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));

  return program;
}

export function updateProgram(id: string, blocks: Block[]): Program | undefined {
  const programs = getAllPrograms();
  const index = programs.findIndex((p) => p.id === id);

  if (index === -1) return undefined;

  programs[index] = {
    ...programs[index],
    blocks,
    updatedAt: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));

  return programs[index];
}

export function renameProgram(id: string, name: string): Program | undefined {
  const programs = getAllPrograms();
  const index = programs.findIndex((p) => p.id === id);

  if (index === -1) return undefined;

  programs[index] = {
    ...programs[index],
    name,
    updatedAt: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));

  return programs[index];
}

export function deleteProgram(id: string): boolean {
  const programs = getAllPrograms();
  const filtered = programs.filter((p) => p.id !== id);

  if (filtered.length === programs.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function duplicateProgram(id: string): Program | undefined {
  const program = getProgram(id);
  if (!program) return undefined;

  return saveProgram(`${program.name} (copie)`, structuredClone(program.blocks));
}

// Pre-made example programs for kids
export const EXAMPLE_PROGRAMS: { name: string; blocks: Block[] }[] = [
  {
    name: 'Danse',
    blocks: [
      { id: '1', type: 'led', color: 3 },
      { id: '2', type: 'turn-left', speed: 75, duration: 0.5 },
      { id: '3', type: 'turn-right', speed: 75, duration: 0.5 },
      { id: '4', type: 'led', color: 9 },
      { id: '5', type: 'turn-left', speed: 75, duration: 0.5 },
      { id: '6', type: 'turn-right', speed: 75, duration: 0.5 },
    ],
  },
  {
    name: 'Carré',
    blocks: [
      {
        id: '1',
        type: 'repeat',
        times: 4,
        children: [
          { id: '2', type: 'move-forward', speed: 50, duration: 1 },
          { id: '3', type: 'turn-right', speed: 50, duration: 0.5 },
        ],
      },
    ],
  },
];
