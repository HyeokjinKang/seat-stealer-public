<script lang="ts">
	import { screen, room } from '$lib/stores.ts';
	import { env } from '$lib/config.ts';
	import { v4 as uuidv4 } from 'uuid';
	import { io, Socket } from 'socket.io-client';
	import { goto } from '$app/navigation';

	export let config: Config;

	const statusArr = ['red', 'yellow', 'green'];
	let status = 0;
	let statusText = '서버와 연결이 끊어짐';
	let socket: Socket;
	let online: Online = {};
	let onlineID: OnlineID = {};
	let buttonDisabled: boolean = true;
	room.set(uuidv4());

	screen.subscribe((n) => {
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
							online[name] = id;
							onlineID[id] = name;
							socket.emit('name submit result', id);
							if (Object.keys(online).length == config.student.length) {
								buttonDisabled = false;
							}
							return;
						}
					}
					socket.emit('name submit result', id, 'name not exist');
				}
			});

			socket.on('disconnected', (id) => {
				let name = onlineID[id];
				if (name) {
					delete onlineID[id];
					delete online[name];
					config.student = config.student;
					online = online;
					if (Object.keys(online).length != config.student.length) {
						buttonDisabled = true;
					}
				}
			});

			socket.on('disconnect', (reason, details) => {
				alert('서버와의 연결이 끊어졌습니다. 프로그램을 종료합니다.');
				goto('/');
			});
		} else if (n == 2) {
			statusText = '서버에 연결됨';
			status = 2;
		}
	});
</script>

<div id="container">
	<div id="rowContainer">
		<div class="row">
			<div id="status" class={statusArr[status]}></div>
			<span class="menuText">
				{#if $screen < 5}
					{statusText}
				{:else if $screen == 5}
					접속자: {Object.keys(online).length}/{config.student.length}
				{/if}
			</span>
		</div>
		<button class="menuText {buttonDisabled ? 'disabled' : ''}"
			>{buttonDisabled ? '대기' : '진행 →'}</button
		>
	</div>
	{#if $screen >= 5}
		<span id="students">
			{#each config.student as student, i}
				{#if i > 0},
				{/if}
				<span class={student.name in online ? '' : 'offline'}>{student.name}</span>
			{/each}
		</span>
	{/if}
</div>

<style>
	button {
		appearance: none;
		border: none;
		background: none;
	}

	.menuText {
		font-size: 1.7vh;
		font-weight: 600;
	}

	.menuText.disabled {
		color: #888;
	}

	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.offline {
		color: #aaa;
	}

	#students {
		color: #000;
		margin-left: calc(1.2vh + 0.3em);
		font-size: 1.7vh;
	}

	#container {
		width: 100%;
		height: 20vh;
		border: none;
		border-top: 1px solid #888888;
		background-color: #f5f5f5;
		padding: 3vh 10vw;
		box-sizing: border-box;
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
</style>
