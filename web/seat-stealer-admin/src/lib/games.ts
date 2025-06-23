type GameInfo = {
  name: string;
  minPlayers: number;
  maxPlayers: number;
};

export const games = await Promise.all(
  Object.entries(import.meta.glob<GameInfo>('./games/*.svelte', {import: 'information'})).map(async ([path, loader]) => {
    const mod = await loader();
    return {
      name: mod.name,
      minPlayers: mod.minPlayers,
      maxPlayers: mod.maxPlayers,
      fileName: path.replace('./games/', '').replace('.svelte', '')
    };
  })
);
