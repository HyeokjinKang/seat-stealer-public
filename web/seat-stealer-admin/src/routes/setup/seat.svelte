<script lang="ts">
	export let config: Config;
	let dragContents: HTMLDivElement;
	let gapX: number, gapY: number, id: number;
	let dragging = false;

	const dragStart = (e: any) => {
		dragging = true;
		let element: HTMLDivElement;
		if (e.target.localName != 'div') {
			element = e.target.offsetParent;
		} else {
			element = e.target;
		}
		gapX = e.clientX - element.offsetLeft;
		gapY = e.clientY - element.offsetTop;
		id = Number(element.id);
	};

	const drag = (e: MouseEvent) => {
		if (!dragging) return;
		let x = e.pageX - gapX - dragContents.offsetLeft;
		let y = e.pageY - gapY - dragContents.offsetTop;
		config.seat[id].x = Math.round((x / innerWidth) * 100);
		config.seat[id].y = Math.round((y / innerHeight) * 100);
	};

	const dragEnd = () => {
		dragging = false;
	};

	const delSeat = () => {
		if (config.seat.length <= 1) return;
		config.seat.pop();
		config = config;
	};

	const addSeat = () => {
		config.seat.push({
			name: config.seat.length.toString(),
			x: 0,
			y: 0
		});
		config = config;
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="dragContents" bind:this={dragContents} on:mousemove={drag} on:mouseup={dragEnd}>
	{#each config.seat as seat, i}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="seat"
			id={`${i}`}
			style="margin-left: {seat.x}vw; margin-top: {seat.y}vh; {seat.width
				? `width: ${seat.width}vw;`
				: ''}"
			on:mousedown={dragStart}
		>
			<span>{seat.name}</span>
		</div>
	{/each}
</div>

<div id="rowContainer">
	<button on:click={addSeat}>
		<img src="/plus.svg" alt="+" class="icon" />
	</button>
	<img src="/desk.svg" alt="책상" class="bigIcon" />
	<button on:click={delSeat}>
		<img src="/minus.svg" alt="-" class="icon" />
	</button>
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

	#dragContents {
		width: 100%;
		height: 100%;
	}

	@keyframes new {
		0% {
			background-color: #d0faff;
		}
		100% {
			background-color: #fff;
		}
	}

	.seat {
		cursor: move;
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
		animation-duration: 1s;
		animation-fill-mode: forwards;
		animation-iteration-count: 1;
		animation-name: new;
	}

	.seat:hover {
		border: 1px solid #000;
		background-color: #eee !important;
	}

	.seat > span {
		font-size: 2vh;
	}

	.bigIcon {
		height: 3.5vh;
	}

	.icon {
		height: 2.5vh;
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

	#rowContainer > button > img {
		opacity: 0.4;
		transition-duration: 0.1s;
	}

	#rowContainer > button:hover > img {
		opacity: 1;
	}
</style>
