<script>
	export let username = '';
	export let valid = true;

	let focus = false;

	$: cleanUsername(username);
	$: usernameWarning = valid == 0 ? '' : '- Taken';
	$: active = username == '' ? false : true;

	function cleanUsername(dirtyUsername) {
		username = dirtyUsername.replace(/([^a-z0-9]+)/gi, '');
	}
</script>

<div class="form-wrapper">
	<label for="username" class:warn={valid} class:active class:focus class="label">
		Username {usernameWarning}
	</label>

	<input id="username"
				 class="form"
	       autocomplete="username"
				 placeholder="Username"
				 bind:value={username}
				 on:focusin={e => focus = true}
				 on:focusout={e => focus = false}>
</div>
