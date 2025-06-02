type GameModule = {
  name?: string;
  default: typeof import('svelte').SvelteComponent;
};

export const games = await Promise.all(
  Object.entries(import.meta.glob<GameModule>('./games/*.svelte')).map(async ([path, loader]) => {
    const mod = await loader();
    return {
      name: mod.name ?? path.split('/').pop()?.replace('.svelte', '') ?? 'Unknown',
      component: mod.default
    };
  })
);
