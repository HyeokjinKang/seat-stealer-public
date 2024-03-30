<script lang="ts">
	import { onMount } from 'svelte';

	export let config: Config;
	let w = 0;
	let m = 0;
	onMount(() => {
		for (let data of config.student) {
			if (data.gender == '남') m++;
			else w++;
		}
	});
</script>

<div id="container">
	<span>데이터 생성 일시 : {new Date().toLocaleDateString('ko-kr')}</span>
	<span>총 학생 수 : {config.seat.length - 1}</span>
	<span>남학생 : {m}</span>
	<span>여학생 : {w}</span>
</div>

<style>
	span {
		font-size: 1.7vh;
		margin-top: 1em;
	}

	#container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
</style>
