<script lang="ts">
	import Changelog from './changelog.svelte';
	import { goto } from '$app/navigation';

	const version = '1.1.2';
	let changelogContainer: HTMLDivElement;
	let isChangelogOpened = false;

	const verClick = () => {
		if (isChangelogOpened) {
			changelogContainer.style.opacity = '0';
			changelogContainer.style.pointerEvents = 'none';
			isChangelogOpened = false;
		} else {
			changelogContainer.style.opacity = '1';
			changelogContainer.style.pointerEvents = 'auto';
			isChangelogOpened = true;
		}
	};
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="app">
	<h1>Seat Stealer 관리자</h1>
	<span>온라인 자리배치 프로그램</span>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span id="ver" on:click={verClick}>v{version}</span>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="changelog" on:click={verClick} bind:this={changelogContainer}>
		<Changelog />
	</div>
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
		<a href="https://bento.me/coupy" target="_blank">
			<img src="/coupyworks_black_1x.svg" alt="Coupyworks" id="credit" />
		</a>
		<a href="https://forms.gle/bxGVUTNkPiTGuFap6">피드백 남기기</a>
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

	a {
		color: black;
	}

	#changelog {
		position: fixed;
		top: 15vh;
		display: flex;
		padding: 3vh 2vw;
		justify-content: center;
		align-items: flex-start;
		flex-direction: column;
		background-color: white;
		border: 1px solid #222;
		pointer-events: none;
		opacity: 0;
		cursor: pointer;
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
		cursor: pointer;
		text-decoration: underline;
	}

	#credit {
		height: 4vh;
	}
</style>
