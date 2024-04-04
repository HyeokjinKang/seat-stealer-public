<script lang="ts">
	import { screen } from '$lib/stores.ts';

	export let config: Config;

	const statusArr = ['red', 'yellow', 'green'];
	let status = 0;
	let statusText = '서버와 연결이 끊어짐';
	let buttonText = '대기';

	screen.subscribe((screen) => {
		if (screen == 1) {
			statusText = '서버에 연결하는 중';
			status = 1;
		}
	});
</script>

<div id="container">
	<div id="rowContainer">
		<div class="row">
			<div id="status" class={statusArr[status]}></div>
			<span class="menuText">{statusText}</span>
		</div>
		<button class="menuText">{buttonText}</button>
	</div>
</div>

<style>
	button {
		appearance: none;
		border: none;
		background: none;
	}

	.menuText {
		font-size: 1.7vh;
	}

	.row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
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
