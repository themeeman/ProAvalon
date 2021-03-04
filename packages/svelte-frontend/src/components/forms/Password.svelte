<script>
	export let password = ""
	export let valid = 0;

	let visible = false, focus = false;

	$: passwordWarning = valid == 0 ? '' : '- Too Short';
	$: active = password == '' ? false : true;

	$: temp = visible ? 'e' : 'c';
</script>

<style>
	span {
		position: relative;
		left: -1.5em;
		z-index: 1;
	}
</style>

<div class="form-wrapper">
	<label for="password" class:warn={valid} class:focus class:active class="label">
		Password {passwordWarning}
	</label>

	<label>
		<input id="password"
					 class="form"
					 type={visible ? 'text' : 'password'}
					 autocomplete="current-password"
					 placeholder="Password"
					 on:input={e => password = e.target.value}
					 on:focusin={e => focus = true}
					 on:focusout={e => focus = false}
					 on:focusout={e => valid = password.length > 6 ? 0 : 1}>

		<span on:click={e => visible = !visible}>{temp}</span>
	</label>
</div>
