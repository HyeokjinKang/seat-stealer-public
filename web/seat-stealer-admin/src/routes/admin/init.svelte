<script lang="ts">
	import { screen, room } from '$lib/stores.ts';
	import { goto } from '$app/navigation';
	import { env } from '$lib/config.ts';
	import { onDestroy, onMount } from 'svelte';
	import QRCode from 'qrcode';

	export let config: Config;

	let input: HTMLInputElement;
	let log = '설정을 불러오는 중.';
	let interval: NodeJS.Timeout;
	let isFileDialogOpened = false;
	let loaded = false;
	let qrCanvas: HTMLCanvasElement;

	onMount(() => {
		interval = setInterval(() => {
			log += '.';
		}, 500);
		isFileDialogOpened = true;
		input.click();
	});

	const dataLoaded = (event: Event) => {
		loaded = true;
		try {
			const target = event.target as HTMLInputElement;
			if (target.files == null) throw new Error('Target files not exist');
			let file = target.files[0];
			let reader = new FileReader();
			reader.onload = (e) => {
				try {
					if (e.target == null) throw new Error('Target not exist');
					if (typeof e.target.result != 'string') throw new Error('Wrong type error');
					config = JSON.parse(e.target.result);
					if (config.seat == undefined || config.student == undefined)
						throw new Error('Empty config error');
					if (config.seat.length == 0 || config.student.length == 0)
						throw new Error('Empty data error');
					config.last = {};
					clearInterval(interval);
					log += 'ok\n서버에 연결하는 중..';
					screen.set(1);
					interval = setInterval(() => {
						log += '.';
					}, 100);
				} catch {
					alert('설정파일이 올바르지 않습니다.');
					goto('/');
				}
			};
			reader.readAsText(file);
		} catch {
			alert('파일을 불러오지 못했습니다.');
			goto('/');
		}
	};

	const unsubscribe = screen.subscribe((n) => {
		if (n == 2) {
			log += 'ok\n새로운 방을 생성하는 중..';
		} else if (n == 3) {
			log += 'ok\nQR코드를 생성하는 중..';

			QRCode.toCanvas(
				qrCanvas,
				`${env.student}/join?room=${$room}`,
				{ margin: 0, width: Math.round((innerHeight / 100) * 30), errorCorrectionLevel: 'Q' },
				function (error) {
					if (error) console.error(error);
					log += 'ok';
					clearInterval(interval);
					screen.set(4);
					setTimeout(() => {
						screen.set(5);
					}, 2000);
				}
			);
			console.log(`${env.student}/join?room=${$room}`);
		}
	});

	onDestroy(() => {
		unsubscribe();
		clearInterval(interval);
	});

	window.addEventListener('focus', function (e) {
		if (isFileDialogOpened) {
			isFileDialogOpened = false;
			setTimeout(() => {
				if (!loaded) {
					alert('파일이 선택되지 않았습니다.');
					goto('/');
				}
			}, 500);
		}
	});
</script>

<input type="file" id="jsonInput" accept=".json" on:change={dataLoaded} bind:this={input} />

{#if $screen < 5}
	<div class={$screen == 4 ? 'fadeOut' : ''}>
		<span id="log">{log}</span>
	</div>
{/if}
<div id="qrContainer" class={$screen == 5 ? 'fadeIn' : ''}>
	<canvas bind:this={qrCanvas}></canvas>
	<span id="qrText">위 QR코드를 스캔하고 접속하세요.</span>
</div>

<style>
	#jsonInput {
		display: none;
	}

	#qrContainer {
		display: none;
		flex-direction: column;
	}

	#qrText {
		margin-top: 1em;
		font-size: 2vh;
		font-weight: 500;
	}

	div {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.fadeOut {
		animation-name: fadeOut;
		animation-duration: 2s;
		animation-fill-mode: forwards;
		animation-iteration-count: 1;
	}

	.fadeIn {
		animation-name: fadeIn;
		animation-duration: 2s;
		animation-fill-mode: forwards;
		animation-iteration-count: 1;
		display: flex !important;
	}

	@keyframes fadeOut {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	#log {
		text-align: center;
		white-space: pre-line;
		font-size: 2vh;
	}
</style>
