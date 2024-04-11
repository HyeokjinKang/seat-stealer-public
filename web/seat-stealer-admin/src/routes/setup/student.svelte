<script lang="ts">
	import { onMount } from 'svelte';

	export let config: Config;
	let text = '';
	let studentNum = config.seat.length - 1;
	let nowNum = 0;

	const parseData = () => {
		let output: Student[] = [];
		try {
			let dataArray = text.split('\n');
			for (let data of dataArray) {
				if (data == '') continue;
				let splitArray = data.split('/');
				if (splitArray.length < 2) throw new Error('Wrong data');
				if (splitArray[0] == '' || (splitArray[1] != '남' && splitArray[1] != '여'))
					throw new Error('empty data');
				output.push({
					name: splitArray[0],
					gender: splitArray[1]
				});
			}
			config.student = output;
			nowNum = output.length;
			for (const [student, seat] of Object.entries(config.pre.student)) {
				if (!config.student.find((data) => data.name == student)) {
					delete config.pre.student[student];
					delete config.pre.seat[seat];
				}
			}
		} catch (e) {
			console.log('ignoring..');
		}
	};

	onMount(() => {
		for (let data of config.student) text += `${data.name}/${data.gender}\n`;
		nowNum = config.student.length;
	});
</script>

<div id="container">
	<textarea
		bind:value={text}
		on:input={parseData}
		placeholder="김철수/남&#13;강민서/여&#13;이영희/여&#13;Alex/남&#13;..."
	></textarea>
	<span>{nowNum}명 / {studentNum}명</span>
</div>

<style>
	textarea {
		resize: none;
		width: 15em;
		height: 90%;
		box-sizing: border-box;
		border: 1px solid #555555;
		border-radius: 0.5em;
		font-size: 2vh;
		padding: 2vh 1vw;
		text-align: center;
	}

	textarea::placeholder {
		color: #aaa;
	}

	span {
		font-size: 1.7vh;
		margin-top: 1em;
	}

	#container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		width: 100%;
		height: 100%;
	}
</style>
