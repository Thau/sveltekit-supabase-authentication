<script context="module">
	import { authorizeOnLoad } from '$lib/authorizeOnLoad.js';
	export let openPaths;
	export let loginPath;

	export const load = authorizeOnLoad(openPaths, loginPath);
</script>

<script lang="ts">
	import { SupabaseClient } from '@supabase/supabase-js';
	import { onAuthStateChange } from './hooks';

	export let supabase: SupabaseClient;

	supabase.auth.onAuthStateChange(onAuthStateChange);
</script>

<slot />
