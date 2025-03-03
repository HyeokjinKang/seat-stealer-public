<script lang="ts">
	import { goto } from '$app/navigation';
	const version = '1.1.0';
</script>

<div id="app">
	<h1>Seat Stealer 관리자</h1>
	<span>온라인 자리배치 프로그램</span>
	<span id="ver">v{version}</span>
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
		<button
			on:click={() => {
				goto('/offline');
			}}>오프라인 자리 배치</button
		>
	</div>
	<div id="footer">
		<img id="credit" src="/coupyworks_black_1x.svg" alt="Coupyworks" />
	</div>
</div>

<style>
	span {
		margin-top: 0.2em;
		font-size: 2vh;
		color: #888;
	}

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
		margin-top: 0.5em;
		font-size: 1.5vh;
		color: #888;
	}

	#credit {
		height: 4vh;
	}
</style>
