<script lang="ts">
	import { goto } from '$app/navigation';
	import Seat from './seat.svelte';
	import Student from './student.svelte';
	import Final from './final.svelte';

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

	let nextText = '다음 →';

	const title = ['교실이 어떤 모습인가요?', '학생 정보를 입력해주세요.', '설정이 완료되었어요.'];
	const subtitle = [
		'교탁과 책상을 배치해 교실과 유사한 모습으로 만들어주세요.',
		'모든 데이터는 절대로 서버에 저장되지 않습니다.',
		'설정 데이터를 저장하여 잘 보관해주세요.'
	];

	let screen = 0;

	const back = () => {
		if (screen == 0) {
			goto('/');
		} else {
			if (screen == 2) nextText = '다음 →';
			screen--;
		}
	};

	const next = () => {
		if (screen == 1) {
			if (config.seat.length - 1 != config.student.length)
				return alert('학생 수와 자리 수가 일치하지 않습니다.');
			nextText = '저장 & 설정 종료';
		}
		if (screen == 2) {
			const a = document.createElement('a');
			const file = new Blob([JSON.stringify(config)], { type: 'application/json' });
			a.href = URL.createObjectURL(file);
			a.download = `자리배치설정파일-${new Date().toLocaleDateString('ko-kr')}json`;
			a.click();
			return goto('/');
		}
		screen++;
	};
</script>

<div id="app">
	<h1>{title[screen]}</h1>
	<h3>{subtitle[screen]}</h3>
	{#if screen == 0}
		<Seat {config} />
	{:else if screen == 1}
		<Student {config} />
	{:else if screen == 2}
		<Final {config} />
	{/if}
	<div id="buttonsContainer">
		<button on:click={back}>← 이전</button>
		<button on:click={next}>{nextText}</button>
	</div>
</div>

<style>
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
