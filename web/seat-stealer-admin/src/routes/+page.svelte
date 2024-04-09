<script lang="ts">
	import { goto } from '$app/navigation';
	const version = '1.0';
</script>

<div id="app">
	<h1>Seat Stealer 관리자</h1>
	<div id="buttonsContainer">
		<button
			on:click={() => {
				goto('/setup');
			}}>새로운 설정 생성</button
		>
		<button
			on:click={() => {
				goto('/setup?edit=true');
			}}>기존 설정 수정</button
		>
		<button
			on:click={() => {
				goto('/admin');
			}}>온라인 자리 배치</button
		>
	</div>
	<div id="footer">
		<span id="ver">v{version}</span>
		<span id="credit">ⓒCoupyworks, 2024.</span>
	</div>
</div>

<style>
	button {
		background-color: #fff;
		border: solid 1px #aaa;
		color: #888;
		font-size: 2.2vh;
		width: 30vw;
		height: 5vh;
		border-radius: 4vh;
		margin: 1vh 0;
		cursor: pointer;
		transition-duration: 0.1s;
	}

	button:hover {
		color: #555;
		border: solid 1px #555;
	}

	#app {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 3vh 0;
		box-sizing: border-box;
	}

	#buttonsContainer {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	#footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	#ver {
		font-size: 1.5vh;
		color: #888;
	}

	#credit {
		font-size: 1.7vh;
		color: #555;
	}
</style>
