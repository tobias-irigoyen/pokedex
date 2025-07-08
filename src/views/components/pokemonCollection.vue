<template>
  <section id="pokemon-collection">
    <pokemonSearchbar
      :default-option-text="'All Types'"
      :options="pokemonTypes"
      :search="searchName"
      :selected-item="searchType"
      :search-placeholder="'Find your Pokemon...'"
      @update:search="(value: string) => (searchName = value)"
      @update:selectedItem="(value: string) => (searchType = value)"
      @clear-filters="clearFilters"
      :paginated-items="paginatedPokemons"
      :filtered-items="filteredPokemons"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-pokemons="filteredPokemons.length"
    />
    <div class="row">
      <div class="col-12">
        <div v-if="filteredPokemons.length > 0" class="pagination-container">
          <div class="pagination">
            <button
              @click="goToPage(1)"
              :disabled="currentPage === 1"
              class="pagination-btn first-last-btn"
              title="First page"
            >
              <i class="bi bi-chevron-double-left"></i>
            </button>

            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="pagination-btn prev-next-btn"
              title="Previous page"
            >
              <i class="bi bi-chevron-left"></i>
            </button>

            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(Number(page))"
                :class="['pagination-btn', 'page-number', { active: page === currentPage }]"
              >
                {{ page }}
              </button>
              <span v-else class="pagination-ellipsis">...</span>
            </template>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="pagination-btn prev-next-btn"
              title="Next page"
            >
              <i class="bi bi-chevron-right"></i>
            </button>

            <button
              @click="goToPage(totalPages)"
              :disabled="currentPage === totalPages"
              class="pagination-btn first-last-btn"
              title="Last page"
            >
              <i class="bi bi-chevron-double-right"></i>
            </button>
          </div>
          <div class="items-per-page">
            <label class="d-none">Items per page:</label>
            <select v-model="itemsPerPage" @change="handleItemsPerPageChange">
              <option :value="18">18</option>
              <option :value="36">36</option>
              <option :value="54">54</option>
              <option :value="72">72</option>
            </select>
            <span>from {{ totalPokemons }} Pokemon</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12" v-if="isLoading && !paginatedPokemons.length">
        <div class="pokeball-loader-container">
          <img src="../../assets/img/pokeball-bg.png" alt="pokeball" />
          <span>Loading Pokemon...</span>
        </div>
      </div>
      <div class="col-12 no-results" v-else-if="!paginatedPokemons.length && searchName">
        <p>No Pokemons found</p>
      </div>
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 pokemons-main-container"
        v-for="(pokemon, index) in paginatedPokemons"
        :key="index"
      >
        <div
          class="inner-pokemon-container"
          @click="() => openModal(pokemon)"
          :class="typeClass(pokemon.types[0])"
        >
          <span class="pokemon-number">#{{ (pokemon.originalIndex as number) + 1 }}</span>
          <img :src="pokeBall" alt="background pokeball" class="pokeball-image" />
          <img :src="pokeBall" alt="background pokeball" class="pokeball-image-2" />
          <div class="name-and-image">
            <img :src="pokemon.img as string" :alt="pokemon.name as string" class="pokemon-image" />
            <h2 class="pokemon-name">{{ pokemon.name as string }}</h2>
          </div>
          <div class="types-badges-container">
            <span class="badge" :class="badgeTypeClass(pokemon.types[0])">{{
              pokemon.types[0]
            }}</span>
            <span v-if="pokemon.types[1]" class="badge" :class="badgeTypeClass(pokemon.types[1])">{{
              pokemon.types[1]
            }}</span>
          </div>
          <div class="pokemon-info">
            <div class="pokemon-hp">
              <span class="hp-bar"></span>
              <span class="hp-points">{{ pokemon.hp_points }} / {{ pokemon.hp_points }} HP</span>
            </div>
            <div class="pokemon-stats">
              <div class="pokemon-height">
                <span>{{ pokemon.height }} M</span>
              </div>
              <div class="pokemon-height">
                <span>{{ pokemon.weight }} KG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--div v-if="filteredPokemons.length === 0 && pokemons.length > 0" class="no-results">
      <p>No Pokemons found</p>
    </div-->

    <teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" :class="typeClass(selectedPokemon.types[0])">
          <button class="modal-close" @click="showModal = false">×</button>
          <button class="nav-arrow nav-arrow-left" @click="prevPokemon" :disabled="!hasPrevPokemon">
            <i class="bi bi-chevron-left"></i>
          </button>

          <button
            class="nav-arrow nav-arrow-right"
            @click="nextPokemon"
            :disabled="!hasNextPokemon"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
          <div v-if="selectedPokemon">
            <div class="row modal-pokemon-row">
              <div
                class="col-10 col-sm-8 col-md-6 col-lg-6 col-xl-6 d-flex flex-column align-items-start justifiy-content-start pokemon-modal-stats"
              >
                <span class="modal-pokemon-number"
                  >#{{ (selectedPokemon.originalIndex as number) + 1 }}</span
                >
                <h2>{{ selectedPokemon.name }}</h2>
                <p>
                  <span class="stats-title">HP:</span><span> {{ selectedPokemon.hp_points }}</span>
                </p>
                <p>
                  <span class="stats-title">Height:</span
                  ><span> {{ selectedPokemon.height }} M</span>
                </p>
                <p>
                  <span class="stats-title">Weight:</span
                  ><span> {{ selectedPokemon.weight }} KG</span>
                </p>
                <p>
                  <span class="stats-title">Types:</span
                  ><span class="badge" :class="badgeTypeClass(selectedPokemon.types[0])">{{
                    selectedPokemon.types[0]
                  }}</span>
                  <span
                    v-if="selectedPokemon.types[1]"
                    class="badge"
                    :class="badgeTypeClass(selectedPokemon.types[1])"
                    >{{ selectedPokemon.types[1] }}</span
                  >
                </p>
                <p>
                  <span class="stats-title">Attacks:</span
                  ><span class="attacks-list"> {{ selectedPokemon.attacks.join(', ') }}</span>
                </p>
              </div>
              <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <img
                  :src="selectedPokemon.img"
                  :alt="selectedPokemon.name as string"
                  class="modal-pokemon-image"
                  :is-loading="isLoading"
                />
                <img :src="pokeBall" alt="background pokeball" class="modal-pokeball-image-1" />
                <img :src="pokeBall" alt="background pokeball" class="modal-pokeball-image-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted, computed, watch } from 'vue'
import pokeBall from '../../assets/img/pokeball-bg.png'
import pokemonSearchbar from './pokemonSearchbar.vue'

onMounted(() => {
  getPokemonData(currentPage.value)
})

interface Pokemon {
  originalIndex: number
  name: string
  img: string
  types: string[]
  hp_points: number
  height: number
  weight: number
  url: string
}

const totalPokemons = 151
const pokemons = ref<Pokemon[]>([])
const searchName = ref('')
const searchType = ref('')
const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(18)
const showModal = ref(false)
const selectedPokemon = ref<any | null>(null)
const currentPokemonIndex = ref(0)

const getPokemonData = async (page: number) => {
  isLoading.value = true
  try {
    if (searchType.value) {
      const allPokemons: Pokemon[] = []
      for (let i = 0; i < Math.ceil(totalPokemons / 100); i++) {
        const offset = i * 100
        const limit = Math.min(100, totalPokemons - offset)
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
        )
        const results = response.data.results
        const detailedData = await Promise.all(
          results.map(async (pokemon: Pokemon, originalIndex: number) => {
            const res = await axios.get(pokemon.url)
            const data = res.data
            return {
              name: data.name,
              img: data.sprites.other['official-artwork'].front_default,
              hp_points: data.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0,
              height: data.height,
              weight: data.weight,
              types: data.types.map((t: any) => t.type.name),
              attacks: data.moves.slice(0, 4).map((m: any) => m.move.name),
              originalIndex: offset + originalIndex,
            }
          }),
        )
        allPokemons.push(...detailedData)
      }
      pokemons.value = allPokemons
    } else {
      const totalToFetch = page === totalPages.value ? totalPokemons : page * itemsPerPage.value
      const allPokemons: Pokemon[] = []
      for (let i = 0; i < Math.ceil(totalToFetch / 100); i++) {
        const offset = i * 100
        const limit = Math.min(100, totalToFetch - offset)
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
        )
        const results = response.data.results
        const detailedData = await Promise.all(
          results.map(async (pokemon: Pokemon, originalIndex: number) => {
            const res = await axios.get(pokemon.url)
            const data = res.data
            return {
              name: data.name,
              img: data.sprites.other['official-artwork'].front_default,
              hp_points: data.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0,
              height: data.height,
              weight: data.weight,
              types: data.types.map((t: any) => t.type.name),
              attacks: data.moves.slice(0, 4).map((m: any) => m.move.name),
              originalIndex: offset + originalIndex,
            }
          }),
        )
        allPokemons.push(...detailedData)
      }
      pokemons.value = allPokemons
    }
  } catch (error) {
    console.error('Error fetching Pokémon data:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredPokemons = computed(() => {
  return pokemons.value.filter((pokemon) => {
    const searchTerm = searchName.value.toLowerCase()

    const matchesName = searchTerm ? pokemon.name.toLowerCase().includes(searchTerm) : true

    const matchesType = searchTerm
      ? pokemon.types.some((type) => type.toLowerCase().includes(searchTerm))
      : true

    const matchesId = searchTerm
      ? (pokemon.originalIndex + 1).toString().includes(searchTerm)
      : true

    const matchesSelectedType = searchType.value ? pokemon.types.includes(searchType.value) : true

    return (matchesName || matchesType || matchesId) && matchesSelectedType
  })
})

const totalPages = computed(() => {
  if (filteredPokemons.value.length === 0) return 1
  return Math.ceil(filteredPokemons.value.length / itemsPerPage.value)
})

const paginatedPokemons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end =
    currentPage.value === totalPages.value
      ? filteredPokemons.value.length
      : start + itemsPerPage.value
  return filteredPokemons.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    // If there are 7 or fewer pages, show all of them.
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // If there are more than 7 pages
    if (current <= 3) {
      // If we are on the first 3 pages
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      // If we are on the last 3 pages
      pages.push(1)
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // If we are in the middle
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleItemsPerPageChange = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  searchName.value = ''
  searchType.value = ''
  currentPage.value = 1
}

watch([searchName, searchType], async () => {
  currentPage.value = 1

  if (searchType.value) {
    await getPokemonData(1)
  } else if (searchName.value) {
    await getPokemonData(1)
  } else {
    if (pokemons.value.length !== totalPokemons) {
      await getPokemonData(1)
    }
  }
})

onMounted(getPokemonData)

const pokemonTypes = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
]

const openModal = (pokemon: any) => {
  selectedPokemon.value = pokemon
  currentPokemonIndex.value = filteredPokemons.value.findIndex(
    (p) => p.originalIndex === pokemon.originalIndex,
  )
  showModal.value = true
}

const hasPrevPokemon = computed(() => currentPokemonIndex.value > 0)
const hasNextPokemon = computed(() => currentPokemonIndex.value < filteredPokemons.value.length - 1)

const prevPokemon = () => {
  if (hasPrevPokemon.value) {
    currentPokemonIndex.value--
    selectedPokemon.value = filteredPokemons.value[currentPokemonIndex.value]
  }
}

const nextPokemon = () => {
  if (hasNextPokemon.value) {
    currentPokemonIndex.value++
    selectedPokemon.value = filteredPokemons.value[currentPokemonIndex.value]
  }
}

const badgeTypeClass = (type: string) => `badge-type-${type}`
const typeClass = (type: string) => `type-${type}`
</script>

<style lang="scss" scoped>
#pokemon-collection {
  padding-top: 24px;
  min-height: 1300px;
}
.no-results {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
  font-size: 1.2rem;

  p {
    margin: 0;
    font-weight: 500;
  }
}
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f7f7f7;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  flex-wrap: wrap;
  gap: 1rem;
}
.pagination-container:first-of-type {
  margin-top: 0;
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: #999;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  min-width: 40px;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &.active {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    font-weight: 700;
  }
}

.first-last-btn i,
.prev-next-btn i {
  font-size: 1.2rem;
  color: #444;
}

.page-number {
  min-width: 40px;
}

.pagination-ellipsis {
  color: #999;
  padding: 0 0.5rem;
  font-weight: 600;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #444;
  font-weight: 600;

  label,
  span,
  select {
    font-size: 0.9rem;
  }

  select {
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    color: #333;
    font-weight: 600;
    cursor: pointer;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }
  }
}

.inner-pokemon-container {
  box-shadow: 0 5px 5px #00000041;
  height: 420px;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }

  * {
    color: #fff;
  }
  .name-and-image {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .pokemon-name {
      font-size: 1.25rem;
      text-transform: capitalize;
    }
  }
  .pokemon-number {
    font-size: 1rem;
    background-color: rgba(117, 117, 117, 0.196);
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    text-shadow: 1px 1px 1px #b0b0b0;
  }
  .pokemon-image {
    height: 180px;
    width: 180px;
  }
  &.type-normal {
    background: linear-gradient(to bottom, #ebebeb, #8e8e8e);
  }
  &.type-fighting {
    background: linear-gradient(to bottom, #f2aa62, #8c5b29);
  }
  &.type-flying {
    background: linear-gradient(to bottom, #81a0e8, #475a86);
  }
  &.type-poison {
    background: linear-gradient(to bottom, #f1c8fc, #622a72);
  }
  &.type-ground {
    background: linear-gradient(to bottom, #fae85d, #b9a932);
  }
  &.type-rock {
    background: linear-gradient(to bottom, #ffd87e, #af9350);
  }
  &.type-bug {
    background: linear-gradient(to bottom, #a6fe70, #479c13);
  }
  &.type-ghost {
    background: linear-gradient(to bottom, #cc31ef, #711b85);
  }
  &.type-steel {
    background: linear-gradient(to bottom, #d4d4d4, #606060);
  }
  &.type-fire {
    background: linear-gradient(to bottom, #ffbf64, #ae501a);
  }
  &.type-water {
    background: linear-gradient(to bottom, #2980b9, #6dd5fa);
  }
  &.type-grass {
    background: linear-gradient(to bottom, #9dce82, #aadc37);
  }
  &.type-electric {
    background: linear-gradient(to bottom, #ffed25, #aea007);
  }
  &.type-psychic {
    background: linear-gradient(to bottom, #f364d4, #873876);
  }
  &.type-ice {
    background: linear-gradient(to bottom, #67e2de, #3e9895);
  }
  &.type-dragon {
    background: linear-gradient(to bottom, #abeff8, #398d98);
  }
  &.type-dark {
    background: linear-gradient(to bottom, #886025, #61451a);
  }
  &.type-fairy {
    background: linear-gradient(to bottom, #ffb9f9, #9f679a);
  }
  .pokeball-image {
    opacity: 0.15;
    position: absolute;
    width: 20%;
    right: 1rem;
  }
  .pokeball-image-2 {
    opacity: 0.05;
    position: absolute;
    width: 50%;
    left: -25%;
    bottom: 33%;
  }
}

.types-badges-container {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.pokemon-info {
  background-color: rgba(255, 255, 255, 0.03);
  box-shadow: 0 5px 5px #00000011;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
  .pokemon-stats {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    * {
      font-weight: 600;
    }
  }
  .pokemon-hp {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .hp-bar {
      width: 100%;
      max-width: 80%;
      height: 5px;
      background-color: rgb(26, 223, 190);
      display: flex;
    }
    .hp-points {
      font-size: 0.925rem;
      margin-top: 0.25rem;
    }
  }
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}
.badge-type-normal {
  background: #8e8e8e;
}
.badge-type-flying {
  background: #475a86;
}
.badge-type-poison {
  background: #622a72;
}
.badge-type-ground {
  background: #b9a932;
}
.badge-type-rock {
  background: #af9350;
}
.badge-type-bug {
  background: #5fd317;
}
.badge-type-ghost {
  background: #cc31ef;
}
.badge-type-steel {
  background: #d4d4d4;
}
.badge-type-fire {
  background: #ab1c1c;
}
.badge-type-water {
  background: #3763e8;
}
.badge-type-grass {
  background: green;
}
.badge-type-electric {
  background: #ffed25;
}
.badge-type-psychic {
  background: #f364d4;
}
.badge-type-ice {
  background: #3e9895;
}
.badge-type-dragon {
  background: #71c8d3;
}
.badge-type-dark {
  background: #886025;
}
.badge-type-fairy {
  background: #ffa7f8;
}
.badge-type-fighting {
  background: #8c5b29;
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
  }

  .search-input-group {
    min-width: 100%;
  }

  .clear-button {
    width: 100%;
  }

  .pagination-container {
    flex-direction: column;
    text-align: center;
  }

  .pagination {
    justify-content: center;
  }
  .modal-content {
    max-width: 90%;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
  width: 750px;
  text-align: center;
  color: #333;
  position: relative;
  overflow: hidden;

  .modal-pokemon-number {
    color: #fff;
    position: absolute;
    left: 2.5rem;
    top: 1rem;
  }

  .badge-type-normal {
    background: #8e8e8e;
  }
  .badge-type-flying {
    background: #475a86;
  }
  .badge-type-poison {
    background: #622a72;
  }
  .badge-type-ground {
    background: #b9a932;
  }
  .badge-type-rock {
    background: #af9350;
  }
  .badge-type-bug {
    background: #5fd317;
  }
  .badge-type-ghost {
    background: #cc31ef;
  }
  .badge-type-steel {
    background: #d4d4d4;
  }
  .badge-type-fire {
    background: #ab1c1c;
  }
  .badge-type-water {
    background: #3763e8;
  }
  .badge-type-grass {
    background: green;
  }
  .badge-type-electric {
    background: #ffed25;
  }
  .badge-type-psychic {
    background: #f364d4;
  }
  .badge-type-ice {
    background: #3e9895;
  }
  .badge-type-dragon {
    background: #71c8d3;
  }
  .badge-type-dark {
    background: #886025;
  }
  .badge-type-fairy {
    background: #ffa7f8;
  }
  .badge-type-fighting {
    background: #8c5b29;
  }
  .pokemon-modal-stats {
    h2 {
      color: #fff;
      font-size: 600;
      margin-bottom: 1rem;
      text-transform: capitalize;
    }
    p {
      color: #fff;
      display: flex;
      span.stats-title {
        font-weight: 600;
        margin-right: 1rem;
        width: 100px;
        min-width: 100px;
        height: max-content;
        display: inline;
        text-align: left;
      }
    }
    .badge {
      margin-right: 0.5rem;
    }
  }
  .modal-pokeball-image-1 {
    opacity: 0.1;
    position: absolute;
    width: 30%;
    right: -7rem;
    bottom: -2rem;
    pointer-events: none;
  }
  .modal-pokeball-image-2 {
    opacity: 0.05;
    position: absolute;
    width: 50%;
    left: -15%;
    bottom: 15%;
    pointer-events: none;
  }
  .modal-pokemon-image {
    z-index: 15;
    position: relative;
    width: 300px;
  }
  .attacks-list {
    text-align: left;
    text-transform: capitalize;
  }
}

.modal-content.type-normal {
  background: linear-gradient(to left, #ebebeb, #8e8e8e);
}
.modal-content.type-fighting {
  background: linear-gradient(to left, #f2aa62, #8c5b29);
}
.modal-content.type-flying {
  background: linear-gradient(to left, #81a0e8, #475a86);
}
.modal-content.type-poison {
  background: linear-gradient(to left, #f1c8fc, #622a72);
}
.modal-content.type-ground {
  background: linear-gradient(to left, #fae85d, #b9a932);
}
.modal-content.type-rock {
  background: linear-gradient(to left, #ffd87e, #af9350);
}
.modal-content.type-bug {
  background: linear-gradient(to left, #a6fe70, #479c13);
}
.modal-content.type-ghost {
  background: linear-gradient(to left, #cc31ef, #711b85);
}
.modal-content.type-steel {
  background: linear-gradient(to left, #d4d4d4, #606060);
}
.modal-content.type-fire {
  background: linear-gradient(to left, #ffbf64, #ae501a);
}
.modal-content.type-water {
  background: linear-gradient(to left, #2980b9, #6dd5fa);
}
.modal-content.type-grass {
  background: linear-gradient(to left, #9dce82, #aadc37);
}
.modal-content.type-electric {
  background: linear-gradient(to left, #ffed25, #aea007);
}
.modal-content.type-psychic {
  background: linear-gradient(to left, #f364d4, #873876);
}
.modal-content.type-ice {
  background: linear-gradient(to left, #67e2de, #3e9895);
}
.modal-content.type-dragon {
  background: linear-gradient(to left, #abeff8, #398d98);
}
.modal-content.type-dark {
  background: linear-gradient(to left, #886025, #61451a);
}
.modal-content.type-fairy {
  background: linear-gradient(to left, #ffb9f9, #9f679a);
}

.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  i {
    font-size: 1.5rem;
    color: #333;
  }
}

.nav-arrow-left {
  left: 5px;
}

.nav-arrow-right {
  right: 5px;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 80%;
    height: auto;
    padding: 0.5rem;
    .modal-pokemon-row {
      flex-direction: column-reverse;
      .col-sm-8,
      .col-12 {
        display: flex !important;
        align-items: flex-start !important;
        justify-content: center !important;
        margin-left: auto;
        margin-right: auto;
        h2 {
          margin-left: auto;
          margin-right: auto;
        }
      }
      .modal-pokemon-image {
        width: 300px;
      }
    }
  }
}
@media (max-width: 400px) {
  .modal-pokemon-image {
    width: 120px !important;
  }
}
.pokeball-loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  img {
    height: 100px;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }
}
</style>
