import { writable } from 'svelte/store';

export const screen = writable(0);
export const room = writable("");
export const data = writable("");
export const error = writable("");