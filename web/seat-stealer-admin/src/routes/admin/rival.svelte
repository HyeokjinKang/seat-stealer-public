<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let students: string[] = [];
	export let seat: string = '';

	const dispatch = createEventDispatcher();
	const selected = (name: string) => {
		dispatch('selected', {
			name,
			seat
		});
	};
</script>

<div id="rivalContainer">
	<div id="rivalInnerContainer">
		<span>{seat}번 자리</span>
		<div>
			{#each students as student, i}
				<button
					on:click={() => {
						selected(`${student}`);
					}}>{student}</button
				>
			{/each}
		</div>
		<span id="notice">*게임을 이긴 사람을 고르세요.</span>
	</div>
</div>

<style>
	#rivalContainer {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
	}

	#rivalInnerContainer {
		width: 100%;
		height: 90%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border: 3px solid transparent;
		border-image: linear-gradient(90deg, #fc4e82, #b234ff);
		border-image-slice: 1;
	}

	span {
		font-size: 3vh;
	}

	button {
		appearance: none;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 5vh;
		font-weight: 600;
		color: #000;
		margin: 0 0.1em;
	}

	button:hover {
		color: #fc4e82;
		text-decoration: underline;
	}

	#notice {
		font-size: 2vh;
		color: #999;
		position: absolute;
		bottom: 3.5vh;
		right: 1em;
	}
</style>
