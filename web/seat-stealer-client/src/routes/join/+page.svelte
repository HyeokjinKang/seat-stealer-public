<script lang="ts">
	import { room, data, screen, error } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let roomid = $page.url.searchParams.get('room');
	let name = '';

	onMount(() => {
		screen.set(0);
		if (roomid != null) {
			room.set(roomid);
		}
	});

	const submit = () => {
		data.set(name);
	};

	error.subscribe((err) => {
		if (err == '') return;
		if (err == 'room not exist') {
			roomid = null;
		}
	});
</script>

{#if roomid == null}
	<span>서버가 존재하지 않습니다.</span>
{:else}
	<div>
		<span>이름을 입력하세요.</span>
		<input type="text" bind:value={name} />
		<button on:click={submit}>진행 →</button>
	</div>
{/if}

<style>
	div {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	span {
		font-size: 1.1em;
		color: #000;
	}

	input {
		appearance: none;
		border: 1px solid #444;
		border-radius: 0.2em;
		font-size: 1.1em;
		padding: 0.3em 1em;
		width: 7em;
		text-align: center;
		margin-top: 0.5em;
		margin-bottom: 1.5em;
	}

	button {
		font-size: 1.1em;
		font-weight: 600;
	}
</style>
