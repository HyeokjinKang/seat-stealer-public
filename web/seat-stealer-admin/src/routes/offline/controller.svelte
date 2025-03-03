<script lang="ts">
	import { screen, seat } from '$lib/stores.ts';
	import { goto } from '$app/navigation';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { Howl, Howler } from 'howler';
	import Rival from './rival.svelte';

	export let config: Config;

	const dispatch = createEventDispatcher();
	let vote: Vote = {};
	let voted: string[] = [];
	let buttonDisabled: boolean = true;
	let SnackBar: Window['SnackBar'];
	let rival: string[] = [];
	let rivalSeat: string = '';
	const rivalArr = ['init', 'show', 'hide'];
	let rivalStatus = 0;
	let imageSaved = false;
	let studentCopy: Config['student'] = [];
	let selectedStudent = -1;

	const bgm1 = new Howl({
		src: ['/music/1.mp3'],
		html5: true,
		loop: true
	});

	const bgm2 = new Howl({
		src: ['/music/2_1.mp3'],
		html5: true,
		loop: false,
		onend: () => {
			bgm2_1.play();
		}
	});

	const bgm2_1 = new Howl({
		src: ['/music/2_2.mp3'],
		html5: true,
		loop: true
	});

	const bgm3 = new Howl({
		src: ['/music/3.mp3'],
		html5: true,
		loop: false
	});

	const bgm4 = new Howl({
		src: ['/music/4.mp3'],
		html5: true,
		loop: true
	});

	const unsubscribe = screen.subscribe((n) => {
		if (n == 1) {
			screen.set(2);
		} else if (n == 2) {
			studentCopy = JSON.parse(JSON.stringify(config.student));
			screen.set(5);
		} else if (n == 5) {
			buttonDisabled = false;
			bgm4.play();
		} else if (n == 6) {
			selectedStudent = 0;
			seat.set('');
			if (bgm4.playing()) {
				bgm4.fade(1, 0, 200);
				setTimeout(() => {
					bgm4.stop();
					bgm4.volume(1);
				}, 500);
			} else {
				bgm1.fade(1, 0, 200);
				setTimeout(() => {
					bgm1.stop();
					bgm1.volume(1);
				}, 500);
			}
			bgm2.play();
		} else if (n == 7) {
			selectedStudent = -1;
			if (bgm1.playing()) bgm1.stop();
			bgm2_1.fade(1, 0, 200);
			setTimeout(() => {
				bgm2_1.stop();
				bgm2_1.volume(1);
			}, 500);
			bgm1.play();
		}
	});

	const unsubscribe2 = seat.subscribe((s) => {
		if (s == '') return;
		if (s in config.last || s == '0') {
			SnackBar({
				status: 'error',
				message: '투표할 수 없는 자리입니다.',
				timeout: 2000,
				position: 'tr'
			});
			seat.set('');
			return;
		}
		if (selectedStudent != -1) {
			if (vote[s] == undefined) vote[s] = [];
			if (voted.includes(config.student[selectedStudent].name)) {
				for (let i = 0; i < Object.keys(vote).length; i++) {
					const key = Object.keys(vote)[i];
					vote[key] = vote[key].filter((v) => v != config.student[selectedStudent].name);
					if (vote[key].length == 0) {
						delete vote[key];
					}
				}
			} else {
				voted.push(config.student[selectedStudent].name);
			}
			vote[s].push(config.student[selectedStudent].name);
			voted = voted;
			vote = vote;
			SnackBar({
				status: 'info',
				message: `${config.student[selectedStudent].name} 학생이 투표했습니다.`,
				timeout: 2000,
				position: 'tr'
			});
			if (voted.length == config.student.length) {
				buttonDisabled = false;
			}
			selectedStudent++;
			seat.set('');
		} else {
			SnackBar({
				status: 'error',
				message: '학생을 먼저 선택해주세요.',
				timeout: 2000,
				position: 'tr'
			});
			seat.set('');
		}
	});

	const studentSelected = (i: number) => {
		if ($screen == 6) {
			selectedStudent = i;
			seat.set('');
		}
	};

	const reveal = () => {
		buttonDisabled = true;
		setTimeout(() => {
			let time = 0;
			for (let n in config.last) {
				setTimeout(() => {
					if (config.last[n].length == 1) {
						config.student = config.student.filter((student) => student.name != config.last[n][0]);
					}
				}, time);
				time += 220;
			}
			setTimeout(() => {
				buttonDisabled = false;
			}, time);
		}, 500);
		screen.set(7);
	};

	const next = () => {
		if (buttonDisabled) return;
		if ($screen == 5) {
			buttonDisabled = true;
			screen.set(6);
		} else if ($screen == 6) {
			Object.assign(config.last, vote);
			reveal();
		} else if ($screen == 7) {
			if (config.student.length == 0) {
				screen.set(10);
				bgm1.fade(1, 0, 200);
				setTimeout(() => {
					bgm1.stop();
					bgm1.volume(1);
				}, 500);
				bgm3.play();
			} else {
				nextOpponent(1);
				buttonDisabled = true;
				screen.set(8);
			}
		} else if ($screen == 9) {
			vote = {};
			voted = [];
			buttonDisabled = true;
			screen.set(6);
		}
	};

	const nextOpponent = (n: number) => {
		if (n < config.seat.length) {
			if (n in config.last && config.last[n].length > 1) {
				rival = config.last[n];
				rivalSeat = config.seat[n].name;
				rivalStatus = 1;
			} else {
				nextOpponent(n + 1);
			}
		} else {
			screen.set(9);
			buttonDisabled = false;
		}
	};

	const rivalSelected = (event: any) => {
		rivalStatus = 2;
		config.last[rivalSeat] = [event.detail.name];
		for (let name of rival) {
			if (name == event.detail.name) {
				config.student = config.student.filter((student) => student.name != name);
			}
		}
		setTimeout(() => {
			rivalStatus = 0;
			nextOpponent(Number(rivalSeat) + 1);
		}, 1000);
	};

	const random = () => {
		let remainStudent = config.student;
		for (let i = 1; i < config.seat.length; i++) {
			if (i in config.last) continue;
			let random = Math.floor(Math.random() * remainStudent.length);
			config.last[i] = [remainStudent[random].name];
			remainStudent.splice(random, 1);
		}
		reveal();
	};

	const save = () => {
		if (!imageSaved) return;
		config.student = studentCopy;
		const a = document.createElement('a');
		const file = new Blob([JSON.stringify(config)], { type: 'application/json' });
		a.href = URL.createObjectURL(file);
		a.download = `자리배치설정파일-${new Date().toLocaleDateString('ko-kr')}json`;
		a.click();
		goto('/');
	};

	const capture = () => {
		dispatch('capture');
		imageSaved = true;
	};

	onMount(() => {
		Howler.volume(0.5);
		bgm1.stop();
		bgm2.stop();
		bgm2_1.stop();
		bgm3.stop();
		bgm4.stop();
		SnackBar = window.SnackBar;
	});

	onDestroy(() => {
		bgm1.stop();
		bgm2.stop();
		bgm2_1.stop();
		bgm3.stop();
		bgm4.stop();
		unsubscribe();
		unsubscribe2();
	});
</script>

<div id="container" class={$screen == 10 ? 'hide' : ''}>
	<div id="rowContainer">
		<div class="row">
			<span class="menuText">
				{#if $screen <= 5}
					'진행 →'을 눌러 계속하세요.
				{:else if $screen >= 7}
					남은 인원: {config.student.length}명
				{:else if $screen == 6}
					남은 인원: {config.student.length}명, 투표 참여: {voted.length}명
				{/if}
			</span>
		</div>
		<button class="menuText {$screen == 10 ? '' : 'hide'}" on:click={capture}>이미지 저장</button>
		<button
			class="menuText {$screen == 10 ? (imageSaved ? '' : 'disabled') : 'hide'}"
			on:click={save}>데이터 저장 & 종료</button
		>
		<button class="menuText {$screen == 9 ? '' : 'hide'}" on:click={random}>나머지 랜덤</button>
		<button
			class="menuText {buttonDisabled ? 'disabled' : ''} {$screen == 10 ? 'hide' : ''}"
			on:click={next}>{buttonDisabled ? '대기' : '진행 →'}</button
		>
	</div>
	{#if $screen >= 5}
		<div id="students">
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			{#each config.student as student, i}
				{#if i > 0},
				{/if}
				<!-- svelte-ignore missing-declaration -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span
					class={selectedStudent == i ? 'selected' : voted.includes(student.name) ? 'voted' : ''}
					on:click={() => {
						studentSelected(i);
					}}>{student.name}</span
				>
			{/each}
		</div>
	{/if}
</div>

<div id="rival" class={rivalArr[rivalStatus]}>
	<Rival students={rival} seat={rivalSeat} on:selected={rivalSelected} />
</div>

<style>
	button {
		appearance: none;
		border: none;
		background: none;
		cursor: pointer;
	}

	button.disabled {
		cursor: default;
	}

	.menuText {
		font-size: 1.7vh;
		font-weight: 600;
		white-space: nowrap;
		margin-right: 0.5em;
	}

	.menuText.disabled {
		color: #888;
	}

	.menuText.hide {
		display: none;
	}

	.row {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.selected {
		color: #5073ed;
		text-decoration: underline;
	}

	.voted {
		color: #3b9b66;
	}

	#students {
		color: #aaa;
		font-size: 1.7vh;
		cursor: pointer;
	}

	#container {
		width: 100%;
		height: 20vh;
		border: none;
		border-top: 1px solid #888888;
		background-color: #f5f5f5;
		padding: 3vh 10vw;
		box-sizing: border-box;
		transition-duration: 1s;
	}

	#container.hide {
		margin-top: 12vh;
	}

	#rowContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5vh;
	}

	#rival {
		width: 100vw;
		height: 50vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		top: 15vh;
	}

	#rival.init {
		left: 105vw;
	}

	#rival.show {
		transition-duration: 1s;
		left: 0;
	}

	#rival.hide {
		transition-duration: 1s;
		left: -105vw;
	}
</style>
