<script lang="ts">
	export let config: Config;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="seats">
	{#each config.seat as seat, i}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="seat"
			id={`${i}`}
			style="margin-left: {seat.x}vw; margin-top: {seat.y}vh; {seat.width
				? `width: ${seat.width}vw;`
				: ''}"
		>
			<span>{seat.name}</span>
		</div>
	{/each}
</div>

<style>
	#seats {
		width: 100%;
		height: 100%;
	}

	.seat {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid #888;
		color: #000;
		background-color: #fff;
		position: absolute;
		width: 8vw;
		height: 4vh;
		transition-duration: 0.1s;
	}

	.seat > span {
		font-size: 2vh;
	}

	#rowContainer {
		position: fixed;
		bottom: 0;
		height: 8vh;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
</style>
