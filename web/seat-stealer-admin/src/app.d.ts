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

	interface Seat {
		name: string;
		x: number;
		y: number;
		width?: number;
	}

	interface Student {
		name: string;
		gender: string;
	}

	interface Config {
		seat: Seat[];
		student: Student[];
	}
}

export {};
