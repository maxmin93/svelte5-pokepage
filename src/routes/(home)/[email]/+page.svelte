<script>
	import { onMount } from 'svelte';
	import { MyProfile } from './my-pokemons.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const { supabase, session, pokemonList, myEmail } = data;
	let myData = new MyProfile(supabase, session);

	/**
	 * @type {{user_id?: string, email: string, comment: string, pokemon_ids: number[]}}
	 */
	let myProfile = $state(myData.profile);
	/**
	 * @type {Promise<{id:string, name:string, type:string, imgSrc:string}>[]}
	 */
	let myPokemons = $state([]);
	/**
	 * Dialog 전체 리스트에서 선택시 사용될 pokemon_ids 복사본
	 * - Dialog open 될 때, 복사본 생성
	 * - Dialog close 될 때, myProfile 에 반영
	 * @type {number[]}
	 */
	let pickedIds = $state([]);

	onMount(async () => {
		if (!session) {
			// goto() 는 browser 상태에서만 사용 가능 (또는 onMount)
			// - 반면에 redirect() 는 server(백엔드) 에서 사용
			// https://github.com/sveltejs/kit/discussions/3245#discussioncomment-1931570
			setTimeout(() => goto('/'));
			return;
		}

		await myData.loadProfile();
		myProfile = myData.profile;
		console.log('1. myProfile:', myProfile);
		// myPokemons = await myData.getPokemonData(myProfile.pokemon_ids);
		// console.log('2. myPokemons:', myPokemons);
	});

	$effect(() => {
		(async () => {
			myPokemons = await myData.getPokemonData(myProfile.pokemon_ids);
			console.log('2. myPokemons:', myPokemons);
		})();
	});

	/**
	 * 사용자 pokemons 인 경우 테두리 강조 클래스 반환
	 * - includes 메소드를 인식하지 못해서 스크립트로 빼왔다.
	 * @param {number} id
	 * @returns {string}
	 */
	function pickedStyle(id) {
		if (pickedIds.includes(id)) {
			return ' border-2 border-blue-600';
		}
		return '';
	}

	/** @type { string } */
	let searchInput = $state('');
	/** @type { HTMLDialogElement | undefined } */
	let pokemonModal = $state(undefined);

	/**
	 * @param {Event} event
	 */
	function pickPokemon(event) {
		// event.target 은 child 를 반환하고, event.currentTarget 은 자신을 반환
		// 버튼 안쪽에 대한 onclick 이벤트를 무시하려면 'pointer-events: none;' 명시
		// https://stackoverflow.com/a/60666762/6811653
		if (event.currentTarget) {
			/** @type {HTMLButtonElement} buttonEl */
			// @ts-ignore
			const buttonEl = event.currentTarget;
			const id = Number(buttonEl.dataset.pokemonId);
			console.log('pokemon:', buttonEl.dataset);

			// make sure we never have more than 3 pokemon
			if (pickedIds.length >= 3 && !pickedIds.includes(id)) {
				alert('You can only have 3 pokemon maximum. Remove any pokemon!');
				return;
			}

			// if pokemonIDs has ID, remove it
			if (pickedIds.includes(id)) {
				let index = pickedIds.indexOf(id);
				pickedIds.splice(index, 1);
			} else {
				pickedIds.push(id);
			}

			// update
			// myProfile.pokemon_ids = pokemonIds;
		}
	}

	/**
	 * @param {Event} event
	 */
	function openEditDialog(event) {
		pickedIds = [...myProfile.pokemon_ids];
		pokemonModal?.showModal();
	}

	/**
	 * @param {Event} event
	 */
	function saveProfile(event) {
		myProfile.pokemon_ids = [...pickedIds];
		myData.saveProfile(myProfile);
		pokemonModal?.close();
	}
</script>

<div class="hero min-h-screen bg-base-300">
	<div class="hero-content pt-20">
		<div class="max-w-2xl text-center">
			{#if !myProfile.email}
				<!-- 로딩 전 대기화면 -->
				<h1 class="text-4xl font-bold text-neutral-content">Loading...</h1>
			{:else}
				<!-- profile 로딩 이후 화면 -->
				<h1 class="text-4xl font-bold text-neutral-content">{myProfile.email}'s Page</h1>
				<p class="mx-auto max-w-md py-3">{myProfile.comment}</p>
				<div class="grid grid-cols-3 pb-4">
					<!-- 포켓몬 카드 3장 출력 -->
					{#each myPokemons as data}
						<!-- Promise 데이터 처리를 위한 await 블록 -->
						{#await data then pokemon}
							<div class="bg-pokemoncard card m-4 shadow-lg shadow-blue-900">
								<div class="card-body">
									<div class="text-center">
										<img src={pokemon.imgSrc} alt="Pokemon" class="mx-auto h-32 w-32" />
										<h2 class="text-2xl font-bold text-white">{pokemon.name}</h2>
										<p class="text-info">{pokemon.type}</p>
									</div>
								</div>
							</div>
						{/await}
					{/each}
				</div>
				<!-- 로그인 사용자의 카드인 경우 edit 허용 -->
				{#if myProfile.email == myEmail}
					<!-- edit 버튼 -->
					<button class="btn btn-info" onclick={openEditDialog}>Edit Page</button>

					<!-- edit 를 위한 다이얼로그 박스 -->
					<dialog bind:this={pokemonModal} class="min-w-lg modal">
						<div class="modal-box">
							<h3>Your PokePage</h3>
							<p class="p-2 text-white">Edit your description</p>
							<!-- 프로파일의 사용자 코멘트 -->
							<textarea
								bind:value={myProfile.comment}
								class="textarea textarea-bordered textarea-lg h-[100px] w-full max-w-md"
							></textarea>
							<p class="p-2 text-white">Select your pokemon</p>
							<div class="m-3 grid max-h-[600px] grid-cols-3 overflow-y-scroll">
								<div class="col-span-3 pb-4">
									<input
										type="text"
										class="input input-bordered w-full"
										placeholder="Search for a pokemon!"
										bind:value={searchInput}
									/>
								</div>
								{#each pokemonList as pokemon}
									<!-- 문자열 검색 (없으면 전체 출력) -->
									<!-- "char" 입력시 "charmander", "charizard" 등만 출력 -->
									{#if pokemon.name.includes(searchInput)}
										<button
											onclick={pickPokemon}
											data-pokemon-id={pokemon.id}
											class={'card m-1 items-center justify-center bg-slate-700 p-1' +
												pickedStyle(pokemon.id)}
										>
											<h2 class="text-center text-sm text-white">
												{pokemon.name}
											</h2>
										</button>
									{/if}
								{/each}
							</div>
							<button class="btn btn-success text-success-content" onclick={saveProfile}
								>Save Edits</button
							>
						</div>
					</dialog>
				{/if}
			{/if}
		</div>
	</div>
</div>
