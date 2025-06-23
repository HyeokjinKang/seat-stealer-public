<script lang="ts">
	import { screen, room } from '$lib/stores.ts';
	import { env } from '$lib/config.ts';
	import { v4 as uuidv4 } from 'uuid';
	import { io, Socket } from 'socket.io-client';
	import { goto } from '$app/navigation';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { Howl, Howler } from 'howler';
	import Rival from './rival.svelte';
	import Game from './game.svelte';

	export let config: Config;

	const dispatch = createEventDispatcher();
	const statusArr = ['red', 'yellow', 'green'];
	const rivalArr = ['init', 'show', 'hide'];
	let status = 0;
	let statusText = '서버와 연결이 끊어짐';
	let socket: Socket;
	let online: Online = {};
	let onlineID: OnlineID = {};
	let vote: Vote = {};
	let voted: string[] = [];
	let buttonDisabled: boolean = true;
	let SnackBar: Window['SnackBar'];
	let destroyed = false;
	let rival: string[] = [];
	let rivalSeat: string = '';
	let rivalStatus = 0;
	let imageSaved = false;
	let studentCopy: Config['student'] = [];
	let initializeGame: () => Promise<void>;
	let getMessage: (name: string, data: object) => void;
	let gameMode = 1; // 0: 간단, 1: 미니게임

	room.set(uuidv4());

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
			statusText = '서버에 연결하는 중';
			status = 1;
			socket = io(env.socket);

			socket.on('connect', () => {
				socket.emit('create', $room);
				screen.set(2);
			});

			socket.on('joined room', (roomid) => {
				if ($room == roomid) {
					screen.set(3);
				}
			});

			socket.on('name submit', (name, id) => {
				if (online[name]) {
					socket.emit('name submit result', id, 'same name client exist');
				} else {
					for (let student of config.student) {
						if (name == student.name) {
							SnackBar({
								status: 'success',
								message: `${name} 학생이 연결되었습니다.`,
								timeout: 2000,
								position: 'tr'
							});
							online[name] = id;
							onlineID[id] = name;
							socket.emit('name submit result', id);
							config.student = config.student;
							online = online;
							voted = voted;
							if ($screen == 6) {
								socket.emit('id screen set', 'vote', id);
								buttonDisabled = true;
							} else if ($screen == 5) {
								if (Object.keys(online).length > 0) {
									buttonDisabled = false;
								}
							}
							return;
						}
					}
					socket.emit('name submit result', id, 'name not exist');
				}
			});

			socket.on('seat submit', (seat: string, id: string) => {
				if (onlineID[id]) {
					if (voted.includes(id)) {
						socket.emit('seat submit result', id, 'already voted');
						return;
					}
					if (seat in config.last) {
						socket.emit('seat submit result', id, 'seat already voted');
						return;
					}
					for (let seatElement of config.seat) {
						if (seat == seatElement.name) {
							SnackBar({
								status: 'info',
								message: `${onlineID[id]} 학생이 투표했습니다.`,
								timeout: 2000,
								position: 'tr'
							});
							voted.push(id);
							voted = voted; //for update(dumb svelte)
							if (vote[seat] == undefined) vote[seat] = [onlineID[id]];
							else vote[seat].push(onlineID[id]);
							socket.emit('seat submit result', id);
							if (Object.keys(online).length == voted.length) {
								buttonDisabled = false;
							}
							return;
						}
					}
					socket.emit('seat submit result', id, 'seat not exist');
				} else {
					socket.emit('seat submit result', id, 'name not exist');
				}
			});

			socket.on('game', (data: object, id: string) => {
				if (onlineID[id]) {
					getMessage(onlineID[id], data);
				}
			});

			socket.on('disconnected', (id) => {
				let name = onlineID[id];
				if (name) {
					SnackBar({
						status: 'error',
						message: `${name} 학생의 연결이 끊어졌습니다.`,
						timeout: 4000,
						position: 'tr'
					});
					if (voted.includes(id)) {
						voted = voted.filter((value) => value != id);
						for (let seat in vote) {
							vote[seat] = vote[seat].filter((value) => value != onlineID[id]);
						}
					}
					delete onlineID[id];
					delete online[name];
					config.student = config.student;
					online = online;
					if ($screen == 5) {
						if (Object.keys(online).length == 0) {
							buttonDisabled = true;
						}
					} else if ($screen == 6) {
						if (Object.keys(online).length == voted.length) {
							buttonDisabled = false;
						}
					}
				}
			});

			socket.on('disconnect', (reason, details) => {
				if (!destroyed) alert('서버와의 연결이 끊어졌습니다. 프로그램을 종료합니다.');
				goto('/');
			});
		} else if (n == 2) {
			studentCopy = JSON.parse(JSON.stringify(config.student));
			statusText = '서버에 연결됨';
			status = 2;
		} else if (n == 5) {
			bgm4.play();
		} else if (n == 6) {
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
			if (bgm1.playing()) bgm1.stop();
			bgm2_1.fade(1, 0, 200);
			setTimeout(() => {
				bgm2_1.stop();
				bgm2_1.volume(1);
			}, 500);
			bgm1.play();
		}
	});

	const forceDisconnect = (name: string) => {
		if (online[name])
			if (confirm(`${name} 학생의 연결을 강제로 끊으시겠습니까?`))
				socket.emit('force disconnect', online[name]);
	};

	const reveal = () => {
		buttonDisabled = true;
		setTimeout(() => {
			let time = 0;
			for (let n in config.last) {
				setTimeout(() => {
					if (config.last[n].length == 1) {
						socket.emit('id screen set', 'congrats', online[config.last[n][0]], n);
						config.student = config.student.filter((student) => student.name != config.last[n][0]);
					} else {
						for (let name of config.last[n]) {
							socket.emit('id screen set', 'fight', online[name], config.last[n].length);
						}
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
			socket.emit('screen set', 'vote');
			screen.set(6);
		} else if ($screen == 6) {
			Object.assign(config.last, vote);
			reveal();
		} else if ($screen == 7) {
			if (Object.keys(online).length == 0) {
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
			socket.emit('screen set', 'vote');
			screen.set(6);
		}
	};

	const nextOpponent = (n: number) => {
		if (n < config.seat.length) {
			if (n in config.last && config.last[n].length > 1) {
				rival = config.last[n];
				rivalSeat = config.seat[n].name;
				if (gameMode == 0) {
					rivalStatus = 1;
					rival.forEach((name) => {
						socket.emit('id screen set', 'fightturn', online[name]);
					});
				} else {
					initializeGame();
				}
			} else {
				nextOpponent(n + 1);
			}
		} else {
			screen.set(9);
			buttonDisabled = false;
		}
	};

	const rivalSelected = (event: any) => {
		if (gameMode == 0) rivalStatus = 2;
		config.last[rivalSeat] = [event.detail.name];
		for (let name of rival) {
			if (name == event.detail.name) {
				socket.emit('id screen set', 'congrats', online[name], rivalSeat);
				config.student = config.student.filter((student) => student.name != name);
			} else {
				socket.emit('id screen set', 'wait', online[name]);
			}
		}
		setTimeout(() => {
			rivalStatus = 0;
			nextOpponent(Number(rivalSeat) + 1);
		}, 1000);
	};

	const sendMessage = (event: any) => {
		if (event.detail.name in online) {
			socket.emit(
				'id game message',
				event.detail.topic,
				online[event.detail.name],
				event.detail.data
			);
		}
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
		destroyed = true;
		if (socket) socket.disconnect();
	});
</script>

<div
	id="container"
	class={($screen == 10 ? 'hide,' : '') + ($screen == 8 && gameMode == 1 ? 'dark' : '')}
>
	<div id="rowContainer">
		<div class="row">
			<div id="status" class={statusArr[status]}></div>
			<span class="menuText">
				{#if $screen < 5}
					{statusText}
				{:else if $screen == 5 || $screen >= 7}
					접속자: {Object.keys(online).length}/{config.student.length}
				{:else if $screen == 6}
					접속자: {Object.keys(online).length}/{config.student.length}, 투표 참여: {voted.length}/{Object.keys(
						online
					).length}
				{/if}
			</span>
		</div>
		<button class="menuText {$screen == 10 ? '' : 'hide'}" on:click={capture}>이미지 저장</button>
		<button
			class="menuText {$screen == 10 ? (imageSaved ? '' : 'disabled') : 'hide'}"
			on:click={save}>데이터 저장 & 종료</button
		>
		<button class="menuText {$screen == 9 ? '' : 'hide'}" on:click={random}>나머지 랜덤</button>
		{#if $screen == 7 && Object.keys(online).length != 0}
			<button
				class="menuText"
				on:click={() => {
					gameMode = 0;
					next();
				}}>간단모드 →</button
			>
			<button
				class="menuText"
				on:click={() => {
					gameMode = 1;
					next();
				}}>게임모드 →</button
			>
		{:else}
			<button
				class="menuText {buttonDisabled ? 'disabled' : ''} {$screen == 10 ? 'hide' : ''}"
				on:click={next}>{buttonDisabled ? '대기' : '진행 →'}</button
			>
		{/if}
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
					class={student.name in online
						? $screen == 6 && voted.includes(online[student.name])
							? 'online voted'
							: 'online'
						: 'offline'}
					on:click={() => {
						forceDisconnect(student.name);
					}}>{student.name}</span
				>
			{/each}
		</div>
	{/if}
</div>

<Game
	students={rival}
	seat={rivalSeat}
	bind:init={initializeGame}
	bind:getMessage
	on:selected={rivalSelected}
	on:sendMessage={sendMessage}
/>

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

	#container {
		width: 100%;
		height: 20vh;
		border: none;
		border-top: 1px solid #888888;
		padding: 3vh 10vw;
		box-sizing: border-box;
		transition-duration: 1s;
	}

	#container:not(.dark) {
		background-color: #f5f5f5;
		--text-color: #000;
		--text-disabled-color: #aaa;
	}

	#container.dark {
		background-color: #222222;
		--text-color: #fff;
		--text-disabled-color: #555;
	}

	#container.hide {
		margin-top: 12vh;
	}

	.menuText {
		color: var(--text-color);
		font-size: 1.7vh;
		font-weight: 600;
		white-space: nowrap;
		margin-right: 0.5em;
	}

	.menuText.disabled {
		color: var(--text-disabled-color);
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

	.offline {
		color: var(--text-disabled-color);
	}

	.online {
		cursor: pointer;
	}

	.voted {
		color: #5073ed;
	}

	#students {
		color: var(--text-color);
		margin-left: calc(1.2vh + 0.3em);
		font-size: 1.7vh;
	}

	#rowContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5vh;
	}

	#status {
		width: 1.2vh;
		height: 1.2vh;
		border-radius: 1.2vh;
		margin-right: 0.3em;
	}

	#status.red {
		background-color: #f96161;
	}

	#status.yellow {
		background-color: #f9bc61;
	}

	#status.green {
		background-color: #5bce3e;
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
