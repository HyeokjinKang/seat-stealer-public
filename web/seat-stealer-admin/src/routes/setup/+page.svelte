<script lang="ts">
	import { goto } from '$app/navigation';
	import Seat from './seat.svelte';
	import Assignment from './assignment.svelte';
	import Student from './student.svelte';
	import Final from './final.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let config: Config = {
		seat: [
			{
				name: '교탁',
				x: 32,
				y: 15,
				width: 16
			},
			{
				name: '1',
				x: 10,
				y: 25
			},
			{
				name: '2',
				x: 18,
				y: 25
			},
			{
				name: '3',
				x: 10,
				y: 32
			},
			{
				name: '4',
				x: 18,
				y: 32
			},
			{
				name: '5',
				x: 10,
				y: 39
			},
			{
				name: '6',
				x: 18,
				y: 39
			},
			{
				name: '7',
				x: 10,
				y: 46
			},
			{
				name: '8',
				x: 18,
				y: 46
			},
			{
				name: '9',
				x: 10,
				y: 53
			},
			{
				name: '10',
				x: 18,
				y: 53
			},
			{
				name: '11',
				x: 32,
				y: 25
			},
			{
				name: '12',
				x: 40,
				y: 25
			},
			{
				name: '13',
				x: 32,
				y: 32
			},
			{
				name: '14',
				x: 40,
				y: 32
			},
			{
				name: '15',
				x: 32,
				y: 39
			},
			{
				name: '16',
				x: 40,
				y: 39
			},
			{
				name: '17',
				x: 32,
				y: 46
			},
			{
				name: '18',
				x: 40,
				y: 46
			},
			{
				name: '19',
				x: 32,
				y: 53
			},
			{
				name: '20',
				x: 40,
				y: 53
			},
			{
				name: '21',
				x: 54,
				y: 25
			},
			{
				name: '22',
				x: 62,
				y: 25
			},
			{
				name: '23',
				x: 54,
				y: 32
			},
			{
				name: '24',
				x: 62,
				y: 32
			},
			{
				name: '25',
				x: 54,
				y: 39
			},
			{
				name: '26',
				x: 62,
				y: 39
			},
			{
				name: '27',
				x: 54,
				y: 46
			},
			{
				name: '28',
				x: 62,
				y: 46
			},
			{
				name: '29',
				x: 54,
				y: 53
			},
			{
				name: '30',
				x: 62,
				y: 53
			}
		],
		student: []
	};

	let input: HTMLInputElement;
	let edit = $page.url.searchParams.get('edit');
	let isFileDialogOpened = false;
	let loaded = false;

	const title = [
		'교실이 어떤 모습인가요?',
		'학생 정보를 입력해주세요.',
		'학생 미리 배정',
		'설정이 완료되었어요.'
	];
	const subtitle = [
		'교탁과 책상을 배치해 교실과 유사한 모습으로 만들어주세요.',
		'모든 데이터는 절대로 서버에 저장되지 않습니다.',
		'미리 배정 데이터는 "일괄 랜덤 자리 배치"에서만 적용됩니다.',
		'설정 데이터를 저장하여 잘 보관해주세요.'
	];

	let screen = 0;

	const back = () => {
		if (screen == 0) {
			goto('/');
		} else {
			if (screen == 3) screen--;
			screen--;
		}
	};

	const next = () => {
		if (screen == 1) {
			if (config.seat.length - 1 != config.student.length)
				return alert('학생 수와 자리 수가 일치하지 않습니다.');
			screen++;
		} else if (screen == 3) {
			const a = document.createElement('a');
			const file = new Blob([JSON.stringify(config)], { type: 'application/json' });
			a.href = URL.createObjectURL(file);
			a.download = `자리배치설정파일-${new Date().toLocaleDateString('ko-kr')}json`;
			a.click();
			return goto('/');
		}
		screen++;
	};

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

	onMount(() => {
		if (edit == 'true') {
			isFileDialogOpened = true;
			input.click();
		}
	});
</script>

<input type="file" id="jsonInput" accept=".json" on:change={dataLoaded} bind:this={input} />

<div id="app">
	<h1>{title[screen]}</h1>
	<h3>{subtitle[screen]}</h3>
	{#if screen == 0}
		<Seat bind:config />
	{:else if screen == 1}
		<Student bind:config />
	{:else if screen == 2}
		<Assignment bind:config />
	{:else if screen == 3}
		<Final bind:config bind:screen />
	{/if}
	<div id="buttonsContainer">
		<button on:click={back}>← 이전</button>
		<button on:click={next}>{screen == 3 ? '저장 & 설정 종료' : '다음 →'}</button>
	</div>
</div>

<style>
	#jsonInput {
		display: none;
	}

	button {
		font-size: 1.7vh;
		background-color: #fff;
		color: #888;
		border: none;
		cursor: pointer;
		transition-duration: 0.1s;
		margin: 0 0.5vw;
	}

	button:hover {
		color: #000;
	}

	#app {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 3vh 10vw;
		box-sizing: border-box;
	}

	#buttonsContainer {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
	}
</style>
