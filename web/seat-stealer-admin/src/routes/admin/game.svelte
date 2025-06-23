<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { games } from '$lib/games';
	import { page } from '$app/stores';

	const gameNum = Number($page.url.searchParams.get('gameNum')) ?? -1; // this is for testing purposes

	export let students: string[];
	export let seat: string;

	const dispatch = createEventDispatcher();
	let animCounter = 0;
	let random5Game: GameInfo[] = [];
	let selectedDisplay = 0;
	let selectedGameNum: number;
	let selectedGameInfo: GameInfo;
	let gameComponent: Game;
	let rouletteAnim: NodeJS.Timeout | number;

	export const init = async () => {
		animCounter = 1;
		selectedDisplay = 0;
		random5Game = games.sort(() => Math.random() - 0.5).slice(0, 5);
		if (gameNum != -1) {
			random5Game.push(games[gameNum]);
			selectedGameNum = 5;
		} else {
			selectedGameNum = Math.floor(Math.random() * random5Game.length);
		}
		selectedGameInfo = random5Game[selectedGameNum];
		gameComponent = await import(`../../lib/games/${selectedGameInfo.fileName}.svelte`);
		setTimeout(() => {
			animCounter++; // 2
			setTimeout(() => {
				animCounter++; // 3
				setTimeout(() => {
					rouletteAnim = setInterval(() => {
						selectedDisplay++;
						if (selectedDisplay >= random5Game.length) {
							selectedDisplay = 0;
						}
					}, 100);
					animCounter++; // 4
					setTimeout(() => {
						clearInterval(rouletteAnim);
						selectedDisplay = selectedGameNum;
						setTimeout(() => {
							animCounter++; // 5
							setTimeout(() => {
								animCounter++; // 6
							}, 500);
						}, 1000);
					}, 2000);
				}, 500);
			}, 1000);
		}, 500);
	};

	export const getMessage = (name: string, data: object) => {
		console.log(`Message from ${name}:`, data);
	};

	const selected = (name: string) => {
		dispatch('selected', {
			name,
			seat
		});
	};

	const sendMessage = (name: string, topic: string, data: object) => {
		dispatch('sendMessage', {
			name,
			topic,
			data
		});
	};
</script>

<div id="gameContainer" class={animCounter > 0 ? 'show' : ''}>
	{#if animCounter > 3}
		<div id="titleContainer" class={animCounter > 4 ? '' : 'unshow'}>{selectedGameInfo.name}</div>
	{/if}

	{#if animCounter < 6}
		<div
			id="infoContainer"
			class={`${animCounter > 1 ? '' : 'unshow'} ${animCounter > 2 ? 'sized' : ''} ${animCounter > 4 ? 'fade' : ''}`}
		>
			<span id="seat">{seat}번 자리</span>
			<div>
				{#each students as student, i}
					<span class="students">{student}</span>
					{#if students.length - 1 != i}
						<span class="versus">&nbsp;vs&nbsp;</span>
					{/if}
				{/each}
			</div>
		</div>
		<div
			id="rouletteContainer"
			class={`${animCounter > 2 ? 'show' : ''} ${animCounter > 4 ? 'fade' : ''}`}
		>
			<div id="rouletteInnerContainer" class={animCounter > 3 ? '' : 'unshow'}>
				{#each random5Game as game, i}
					<div class={`games ${selectedDisplay == i ? 'selected' : ''}`}>{game.name}</div>
				{/each}
			</div>
		</div>
	{:else}
		<svelte:component this={gameComponent.default} />
	{/if}
</div>

<style>
	#gameContainer {
		backdrop-filter: blur(1vh);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 80vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.8);
		color: #fff;
		opacity: 0;
		transition: opacity 0.5s ease-in-out;
	}

	#gameContainer.show {
		opacity: 1;
	}

	#infoContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition-duration: 0.5s;
		font-size: 2vh;
	}

	#infoContainer.unshow {
		transform: scale(0.8) translateY(5vh);
		filter: blur(1vh);
		opacity: 0;
	}

	#infoContainer.sized {
		font-size: 1.5vh;
		transition-duration: 1s;
	}

	#infoContainer.fade {
		transition-duration: 0.5s;
		opacity: 0;
	}

	#seat {
		font-size: 1em;
		margin-bottom: 1vh;
	}

	.students {
		font-size: 2em;
		font-weight: 600;
	}

	.versus {
		font-size: 1.5em;
		font-weight: 300;
	}

	#rouletteContainer {
		width: 25vw;
		height: 0;
		margin-top: 7vh;
		margin-bottom: 8vh;
		transition-duration: 1s;
	}

	#rouletteContainer.show {
		height: 35vh;
	}

	#rouletteContainer.fade {
		transition-duration: 0.5s;
		opacity: 0;
	}

	#rouletteInnerContainer {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		transition-duration: 0.5s;
	}

	#rouletteInnerContainer.unshow {
		opacity: 0;
		transform: translateY(5vh);
		filter: blur(1vh);
	}

	.games {
		width: 100%;
		height: 5vh;
		margin-bottom: 2vh;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10vh;
		border: 1px solid rgba(255, 255, 255, 0.5);
		background-color: rgba(255, 255, 255, 0.1);
		font-size: 2vh;
	}

	.games.selected {
		background-color: rgba(255, 255, 255, 0.9);
		border: 1px solid rgba(255, 255, 255, 1);
		color: #000000;
	}

	#titleContainer {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		padding: 3vh 0 4vh 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 4vh;
		color: #ffffff;
		font-weight: 600;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
		border-radius: 0 0 5vh 5vh;
		transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
	}

	#titleContainer.unshow {
		transform: translateY(-12vh);
	}
</style>
