// profiles in Supabase which has columns for a description, pokemon_ids, email
// from this page, we can use the supabase object to then save to our database (grab data)

import { getPokemonById, getPokemonByName } from '$lib/pokemon-api.js';

export class MyProfile {
	#supabase;
	/**
	 * @type {{user_id?: string, email: string, comment: string, pokemon_ids: number[]}}
	 */
	profile;

	/**
	 * @param {import('@supabase/supabase-js').SupabaseClient<any, "public", any>} supabase
	 * @param {import('@supabase/supabase-js').Session | null} session
	 */
	constructor(supabase, session) {
		this.#supabase = supabase;
		this.profile = {
			user_id: session?.user.id,
			email: session?.user.email,
			comment: 'Type any comment about your pokemons',
			pokemon_ids: [],
		};

		// 생성자에서 async 함수 호출하기 (되도록 안쓰는게 좋다)
		// https://dev.to/somedood/the-proper-way-to-write-async-constructors-in-javascript-1o8c
		// return Promise.resolve(userEmail).then(email=>{
		//   this.#profile = await this.#loadProfile();
		//   return this;
		// });
	}

	/**
	 * email 로 pokemons 테이블 읽어오기
	 */
	async loadProfile() {
		const { data: profileData, error: profileError } = await this.#supabase
			.from('pokemons')
			.select('user_id, email, comment, pokemon_ids')
			.eq('email', this.profile.email);
		if (profileData?.length > 0) {
			this.profile = profileData[0];
		}
	}

	/**
	 * 변경된 profile 을 DB 에 저장하기
	 * @param {{user_id?: string, email: string, comment: string, pokemon_ids: number[]}} newProfile
	 */
	async saveProfile(newProfile) {
		// update profile
		this.profile = { ...this.profile, ...newProfile };

		// check for existence
		const { data: profileData, error: profileError } = await this.#supabase
			.from('pokemons')
			.select('*')
			.eq('email', this.profile.email);

		if (profileData?.length === 0) {
			// create a new row
			const { data, error } = await this.#supabase.from('pokemons').insert(this.profile);
			console.log('insert profile:', !error);
		} else {
			// update the profile row
			const { data, error } = await this.#supabase
				.from('pokemons')
				.update(this.profile)
				.eq('email', this.profile.email);
			console.log('update profile:', !error);
		}
	}

	/**
	 * 사용자가 선택한 pokemon_ids
	 * @returns {number[]}
	 */
	get pokemonIds() {
		return this.profile.pokemon_ids;
	}

	/**
	 * Promise Array 타입을 반환하기 때문에 수신측에서 await 처리를 해야 한다.
	 * @returns {Promise<{id:string, name:string, type:string, imgSrc:string}>[]}
	 */
	get pokemonData() {
		return this.profile.pokemon_ids
			.map(async (id) => {
				const data = await getPokemonById(id);
				if (data) {
					return {
						id,
						name: data.name,
						type: data.types[0].type.name,
						imgSrc: data.sprites.front_default,
					};
				}
			})
			.filter((p) => p);
	}

	/**
	 * pokemon_ids 에 해당하는 pokemonData 를 fetch 반환
	 * @param {number[]} pokemonIds
	 * @returns {Promise<{id:string, name:string, type:string, imgSrc:string}>[]}
	 */
	async getPokemonData(pokemonIds) {
		const data = pokemonIds
			.map(async (id) => {
				const data = await getPokemonById(id);
				if (data) {
					return {
						id,
						name: data.name,
						type: data.types[0].type.name,
						imgSrc: data.sprites.front_default,
					};
				}
			})
			.filter((p) => p);
		console.log('getPokemonData:', data);
		return data;
	}
}
