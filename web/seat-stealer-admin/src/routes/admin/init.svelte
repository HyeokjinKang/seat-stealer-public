<script lang="ts">
	import { screen } from '$lib/stores.ts';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let config: Config;

	let input: HTMLInputElement;
	let log = '설정을 불러오는 중.';
	let interval: number;
	let isFileDialogOpened = false;
	let loaded = false;

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
					clearInterval(interval);
					log += 'ok\n서버에 연결하는 중.';
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

<div id="logContainer">
	<span id="log">{log}</span>
</div>

<style>
	#jsonInput {
		display: none;
	}

	#logContainer {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	#log {
		text-align: center;
		white-space: pre-line;
		font-size: 2vh;
	}
</style>
