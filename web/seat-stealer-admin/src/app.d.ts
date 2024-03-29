// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface seatConfig {
		name: string;
		x: number;
		y: number;
		width?: number;
	}

	interface Config {
		seat: seatConfig[];
	}
}

export {};
