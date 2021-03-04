<script>
  import syncHeight from 'scripts/syncHeight';
  import getHeightSpring from 'scripts/getHeightSpring';

  export let open = true;

  let element;

  const { heightSpring, sync } = getHeightSpring();
  $: heightStore = syncHeight(element);
  $: sync(open, $heightStore);
</script>

<div style="overflow: hidden; height: {$heightSpring}px">
  <div bind:this={element}>
    <slot />
  </div>
</div>
