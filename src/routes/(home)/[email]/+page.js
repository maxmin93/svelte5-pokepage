import { getPokemonList } from '$lib/pokemon-api.js';

/** @type { import('./$types').PageLoad } */
export const load = async ({ params, data }) => {
	// from +layout.server.js or +page.server.js
	console.log('PageLoad.data:', data);

	return {
		pokemonList: await getPokemonList(),
		myEmail: params.email,
	};
};
