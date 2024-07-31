<script lang="ts">
	import Init from './init.svelte';
	import Seat from './seat.svelte';
	import Controller from './controller.svelte';
	import { screen, room } from '$lib/stores.ts';
	import { env } from '$lib/config.ts';
	import { onDestroy } from 'svelte';
	import QRCode from 'qrcode';

	let capture: () => void;
	let qrCanvas: HTMLCanvasElement;
	let qrCanvasBig: HTMLCanvasElement;
	let title = 'Online Seat Stealer';
	let count = 0;
	let config: Config = {
		seat: [],
		student: [],
		pre: {
			seat: {},
			student: {}
		},
		last: {}
	};

	const unsubscribe = screen.subscribe((num) => {
		switch (num) {
			case 3:
				QRCode.toCanvas(
					qrCanvas,
					`${env.student}/join?room=${$room}`,
					{ margin: 0, width: Math.round((innerHeight / 100) * 5), errorCorrectionLevel: 'L' },
					function (error) {
						if (error) console.error(error);
					}
				);
				QRCode.toCanvas(
					qrCanvasBig,
					`${env.student}/join?room=${$room}`,
					{ margin: 0, width: Math.round((innerHeight / 100) * 30), errorCorrectionLevel: 'Q' },
					function (error) {
						if (error) console.error(error);
					}
				);
				break;
			case 6:
				title = '원하는 자리에 투표해주세요.';
				break;
			case 7:
				title = '투표 결과';
				break;
			case 8:
				title = '승부의 시간!';
				break;
			case 9:
				count++;
				title = `${count}차 배치 결과`;
				break;
			case 10:
				title = '최종 결과';
				break;
		}
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div id="app">
	<canvas bind:this={qrCanvas} id="qrCanvas"></canvas>
	<div id="qrOverlay">
		<canvas bind:this={qrCanvasBig}></canvas>
	</div>
	<h1>{title}</h1>
	{#if $screen < 6}
		<Init bind:config />
	{:else}
		<Seat bind:config bind:capture />
	{/if}
</div>
<Controller bind:config on:capture={capture} />

<style>
	#app {
		display: flex;
		width: 100%;
		height: 80vh;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 3vh 10vw;
		box-sizing: border-box;
	}

	#qrCanvas {
		position: fixed;
		top: 1vw;
		left: 1vw;
	}

	#qrCanvas:hover + #qrOverlay {
		display: flex;
	}

	#qrOverlay {
		display: none;
		align-items: center;
		justify-content: center;
		position: fixed;
		width: 50vw;
		height: 50vh;
		top: 15vh;
		left: 25vw;
		background: rgba(255, 255, 255, 0.8);
		border: 1px solid #eee;
		border-radius: 1vh;
		z-index: 10;
	}
</style>
