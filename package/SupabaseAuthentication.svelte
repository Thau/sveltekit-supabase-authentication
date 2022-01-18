<script context="module">
	import { authorizeOnLoad } from './hooks';
	export let openPaths;
	export let loginPath;

	export const load = authorizeOnLoad(openPaths, loginPath);
</script>

<script >import '@supabase/supabase-js';
import { onAuthStateChange } from './hooks';
export let supabase;
supabase.auth.onAuthStateChange(onAuthStateChange);
</script>

<slot />
