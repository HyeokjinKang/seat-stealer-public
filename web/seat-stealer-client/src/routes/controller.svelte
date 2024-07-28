<script lang="ts">
	import { io, Socket } from 'socket.io-client';
	import { env } from '$lib/config';
	import { room, data, screen, error } from '$lib/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const statusColorArr = ['red', 'yellow', 'green', 'gray'];
	const statusArr = ['연결 실패, 재시도 중', '서버에 연결 중', '연결됨', '연결 끊김'];
	let status = 1;
	let roomid = $page.url.searchParams.get('room');
	let socket: Socket = io(env.socket);
	let isRegistered = false;

	room.subscribe((id) => {
		if (id == '') return;
		socket.emit('join', id);
	});

	socket.on('connect', () => {
		status = 2;
	});

	socket.on('disconnect', (reason, details) => {
		if (reason == 'io server disconnect' || reason == 'io client disconnect') {
			status = 3;
			return;
		}
		status = 1;
	});

	socket.on('connect_error', (error) => {
		status = 0;
		if (!socket.active) {
			socket.connect();
		}
	});

	socket.on('error', (err) => {
		if (err == 'room not exist') {
			error.set(err);
			socket.disconnect();
		}
	});

	socket.on('name submit result', (err) => {
		if (err) {
			error.set(err);
		} else {
			isRegistered = true;
			screen.set(1);
		}
	});

	socket.on('seat submit result', (err) => {
		if (err) {
			error.set(err);
		} else {
			screen.set(3);
		}
	});

	socket.on('fatal', (err) => {
		socket.disconnect();
		goto('/');
	});

	socket.on('screen set', (name, d) => {
		switch (name) {
			case 'vote':
				goto(`/vote?room=${roomid}`);
				break;
			case 'congrats':
				socket.disconnect();
				goto(`/congrats?seat=${d}`);
				break;
			case 'wait':
				goto(`/wait?room=${roomid}`);
				break;
			case 'fight':
				screen.set(4);
				data.set(d);
				break;
			case 'fightturn':
				screen.set(5);
				break;
		}
	});

	data.subscribe((input) => {
		if (input == '') return;
		if ($screen == 0) {
			socket.emit('name submit', input);
		} else if ($screen == 2) {
			socket.emit('seat submit', input);
		}
		data.set('');
	});

	screen.subscribe((n) => {
		if (n != 0 && !isRegistered) {
			goto(`/join?room=${roomid}`);
		}
	});

	onMount(() => {
		if (roomid != null) {
			room.set(roomid);
		}
	});
</script>

<div id="container">
	<div id="status" class={statusColorArr[status]}></div>
	{statusArr[status]}
</div>

<style>
	#container {
		font-size: 0.8em;
		color: #000;
		font-weight: 600;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	#status {
		height: 0.6em;
		width: 0.6em;
		border-radius: 0.6em;
		margin-right: 0.2em;
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

	#status.gray {
		background-color: #888;
	}
</style>
