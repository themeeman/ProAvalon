<script>
	import Username from './forms/Username.svelte';
	import Email from './forms/Email.svelte';
	import Password from './forms/Password.svelte';
  import Slide from './animations/Slide.svelte';

	let registration = false;

	let username = '', validUsername = 0;
	let email = '', validEmail = 0;
	let password = '', validPassword = 0;

  let loggin = false;

  $: disabled = !username || !password || validUsername ||
                validPassword || (registration && !email) ||
                (registration && validEmail);

  async function login() {
    let payload = {
      username,
      password
    };

    const response = await fetch("http://localhost:3001/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log(response.json());
  }

  async function register() {
    let payload = {
      username,
      password,
      email
    }
    let url = "http://localhost:3001/auth/signup";
  }

  function submit() {
    if (registration)
      register().catch((error) => {
        console.error(error);
      });
    else
      login().catch((error) => {
        console.error(error);
      });
  }
</script>

<label>
	<input type="checkbox" bind:checked={registration}>
	Toggle Registration
</label>

<Username bind:username bind:valid={validUsername} />

<Slide open={registration}>
	<Email bind:email bind:valid={validEmail} />
</Slide>

<Password bind:password bind:valid={validPassword} />

<button {disabled} on:click={submit}>
	{#if registration}
    Register
  {:else}
    Play
  {/if}
</button>

{#if loggin}
  <div>Loggined</div>
{/if}
