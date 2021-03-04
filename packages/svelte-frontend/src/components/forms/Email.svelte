<script>
	export let email = "";
	export let valid = true;

	let focus = false;

	$: emailWarning = valid == 0 ? '' : '- Invalid';
	$: active = email == '' ? false : true;

	function checkEmail(event) {
		valid = email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi) ? 0 : 1;
	}
</script>

<div class="form-wrapper">
	<label for="email" class:warn={valid} class:focus class:active class="label">
		Email {emailWarning}
	</label>

	<input id="email"
	       class="form"
				 autocomplete="email"
				 placeholder="Email"
				 bind:value={email}
				 on:focusin={e => focus = true}
				 on:focusout={e => focus = false}
				 on:focusout={checkEmail}>
</div>
