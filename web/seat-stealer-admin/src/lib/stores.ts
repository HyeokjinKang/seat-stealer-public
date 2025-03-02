import { writable } from 'svelte/store';

export const screen = writable(0);
export const seat = writable("");
export const room = writable("");