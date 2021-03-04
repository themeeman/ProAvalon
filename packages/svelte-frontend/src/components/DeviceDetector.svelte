<script>
  import UAParser from "ua-parser-js";
  import { stores } from "@sapper/app";
  import { onMount } from "svelte";


  const { preloading, page, session } = stores();
  const parser = new UAParser();

  parser.setUA($session['user-agent']);

  let mobile = parser.getResult().device['type'] == 'mobile';
</script>

{#if mobile}
  <slot name="mobile" />
{:else}
  <slot name="desktop" />
{/if}
