import { env } from '$env/dynamic/public';
const { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } = env;

export const ssr = false;

import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';
import { goto, invalidate } from '$app/navigation';

/** @type { import('./$types').LayoutLoad } */
export const load = async ({ fetch, data, depends }) => {
	console.log('SUPABASE_URL:', PUBLIC_SUPABASE_URL);
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			fetch,
		},
		cookies: {
			get(key) {
				if (!isBrowser()) {
					return JSON.stringify(data?.session);
				}
				const cookie = parse(document.cookie);
				return cookie[key];
			},
		},
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	supabase.auth.onAuthStateChange(async (event, session) => {
		console.log('event:', event);
		if (event === 'INITIAL_SESSION') {
			// handle initial session
		} else if (event === 'SIGNED_IN') {
			invalidate('supabase:auth');
		} else if (event === 'SIGNED_OUT') {
			invalidate('supabase:auth');
			setTimeout(() => goto('/'));
		}
	});

	return { supabase, session };
};
