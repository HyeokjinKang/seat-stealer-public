<script lang="ts">
	import { screen, room } from '$lib/stores.ts';
	import { env } from '$lib/config.ts';
	import { v4 as uuidv4 } from 'uuid';
	import { io, Socket } from 'socket.io-client';

	export let config: Config;

	const statusArr = ['red', 'yellow', 'green'];
	let status = 0;
	let statusText = '서버와 연결이 끊어짐';
	let buttonText = '대기';
	let socket: Socket;
	let online = {};
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
		<button class="menuText disabled">{buttonText}</button>
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
