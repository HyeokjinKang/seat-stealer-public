<script lang="ts">
	export let config: Config;

	let changingSeat = 0;

	const change = (i: number) => {
		changingSeat = i;
	};

	const assignment = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		if (target.value == '') {
			delete config.pre.student[config.pre.seat[config.seat[changingSeat].name]];
			delete config.pre.seat[config.seat[changingSeat].name];
		} else {
			if (config.pre.student[target.value]) {
				alert('이미 다른 자리에 배정된 학생입니다.');
			} else {
				config.pre.seat[config.seat[changingSeat].name] = target.value;
				config.pre.student[target.value] = config.seat[changingSeat].name;
			}
		}
		changingSeat = 0;
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="dragContents">
	{#each config.seat as seat, i}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="seat"
			id={`${i}`}
			style="margin-left: {seat.x}vw; margin-top: {seat.y}vh; {seat.width
				? `width: ${seat.width}vw;`
				: ''}"
			on:click={() => {
				change(i);
			}}
		>
			{#if changingSeat == i && i > 0}
				<select on:change={assignment}>
					<option value="">--선택--</option>
					<option value="">취소</option>
					{#each config.student as student, j}
						<option>{student.name}</option>
					{/each}
				</select>
			{:else if config.pre.seat[seat.name]}
				<span>{config.pre.seat[seat.name]}</span>
			{:else}
				<span>{seat.name}</span>
			{/if}
		</div>
	{/each}
</div>

<style>
	select {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
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
		cursor: pointer;
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
