// Helper functions (it makes it easier for us to use)
// to acces the Pokemon API

const POKEMON_API = 'https://pokeapi.co/api/v2/';

/**
 * https://pokeapi.co/api/v2/pokemon?limit=151&offset=0
 * @returns { Promise<any[]> }  (ex) [ { id, name, url } ... ]
 */
export async function getPokemonList() {
	const response = await fetch(POKEMON_API + 'pokemon?limit=151&offset=0');
	const data = await response.json();
	if (data.results instanceof Array) {
		// append 'id' property
		return data.results.map((x) => {
			return {
				id: Number(x.url.split('/').at(-2)),
				...x,
			};
		});
	}
	return [];
}

/**
 * getPokemonByName -> https://pokeapi.co/api/v2/pokemon/pikachu
 * @param {string} name
 * @returns {any}
 */
export async function getPokemonByName(name) {
	const response = await fetch(POKEMON_API + 'pokemon/' + name);
	const data = await response.json();
	return data;
}

/**
 * getPokemonById -> https://pokeapi.co/api/v2/pokemon/25
 * @param {number} id
 * @returns {any}
 */
export async function getPokemonById(id) {
	const response = await fetch(POKEMON_API + 'pokemon/' + id);
	const data = await response.json();
	return data;
}
