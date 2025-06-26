<script lang="ts">
	import { data, screen, error } from '$lib/stores';
	import { onMount } from 'svelte';

	let seat = '';
	let rival = 0;
	let gameComponent: any;

	onMount(() => {
		screen.set(2);
	});

	const submit = () => {
		data.set(seat);
	};

	error.subscribe((err) => {
		if (err == '') return;
		seat = '';
		if (err == 'already voted') {
			alert('이미 투표했습니다.');
		} else if (err == 'seat already voted') {
			alert('이미 배치 완료된 자리입니다.');
		} else if (err == 'name not exist') {
			alert('등록되지 않은 학생입니다.');
		} else if (err == 'seat not exist') {
			alert('존재하지 않는 자리입니다.');
		}
		error.set('');
	});

	data.subscribe(async (data) => {
		if (data == '') return;
		if ($screen == 4) {
			rival = Number(data);
		} else if ($screen == 6) {
			gameComponent = await import(`./games/${data}.svelte`);
			screen.set(7);
		}
	});
</script>

<div>
	{#if $screen == 2}
		<span>원하는 자리의 번호를 입력하세요.</span>
		<input type="number" bind:value={seat} />
		<button on:click={submit}>투표 →</button>
	{:else if $screen == 3}
		<span>잠시만 기다려주세요.</span>
		<span>내가 투표한 자리 - <strong>{seat}</strong></span>
	{:else if $screen == 4}
		<span>승부를 기다리고 있습니다.</span>
		<span>{seat}번 자리 - <strong>{rival}명</strong>의 경쟁자</span>
	{:else if $screen == 5}
		<span>승부의 시간!</span>
		<span>vs <strong>{rival - 1}명</strong>의 경쟁자</span>
	{:else if $screen == 6}
		<span>게임을 불러오는 중..</span>
	{:else if $screen == 7}
		<svelte:component this={gameComponent} />
	{/if}
</div>

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

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	button {
		font-size: 1.1em;
		font-weight: 600;
	}
</style>
