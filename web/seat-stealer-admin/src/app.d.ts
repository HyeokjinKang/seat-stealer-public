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
		pre: {
			seat: {
				[seat: string]: string;
			};
			student: {
				[student: string]: string;
			};
		};
		last: {
			[seat: string]: string[];
		}
	}

	interface Online {
		[name: string]: string;
	}

	interface OnlineID {
		[id: string]: string;
	}

	interface Vote {
		[seat: string]: string[];
	}

	interface Window {
		SnackBar: (option: object) => void;
	}

	interface Game {
		name?: string;
		component: typeof import('svelte').SvelteComponent;
	}
}

export {};
