<script>
	import DeviceDetector from '../components/DeviceDetector.svelte';
	import Nav from '../components/Nav.svelte';
	import MobileNav from '../components/MobileNav.svelte';

	export let segment;
</script>

<DeviceDetector>
	<span slot="mobile">
		<MobileNav {segment}/>
	</span>

	<span slot="desktop">
		<Nav {segment}/>
	</span>
</DeviceDetector>

<main>
	<slot />
</main>
