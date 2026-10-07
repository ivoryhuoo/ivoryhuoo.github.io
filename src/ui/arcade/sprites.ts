// Aftermath Creatures art: three characters, five moods each, and the items.
// Every file is a PNG in /public/arcade, named like "HungryRobot".

export type Species = 'Human' | 'Robot' | 'Zombie';
export type Mood = 'Normal' | 'Hungry' | 'Sleepy' | 'Angry' | 'Dead';

export const SPECIES: Species[] = ['Human', 'Robot', 'Zombie'];
export const MOODS: Mood[] = ['Normal', 'Hungry', 'Sleepy', 'Angry', 'Dead'];

export const spriteFor = (species: Species, mood: Mood): string => `${mood}${species}`;

export const ITEMS: Array<{ file: string; name: string }> = [
  { file: 'energyBars', name: 'Energy bars' },
  { file: 'firstAidKit', name: 'First aid kit' },
  { file: 'glowstickGrenade', name: 'Glowstick grenade' },
  { file: 'doomHammer', name: 'Doom hammer' },
  { file: 'universalSyrum', name: 'Universal Syrum' },
];

/**
 * The robot's sprites are taller because of its antenna. Scale it by this so
 * its head lines up with the human's and zombie's, antenna poking above.
 */
export const spriteScale = (species: Species): number => (species === 'Robot' ? 316 / 284 : 1);

/** "waste awAI" → ["WASTE AW", "AI"], so the emphasised part can be styled. */
export function splitTitle(name: string, emphasis?: string): [string, string] {
  const upper = name.toUpperCase();
  if (!emphasis || !upper.endsWith(emphasis.toUpperCase())) return [upper, ''];
  return [upper.slice(0, upper.length - emphasis.length), emphasis.toUpperCase()];
}
