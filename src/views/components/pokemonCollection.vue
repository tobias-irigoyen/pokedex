<template>
  <section id="pokemon-collection">
    <div class="search-section">
      <div class="search-container">
        <div class="search-input-group">
          <input 
            v-if="!isLoading"
            v-model="searchName" 
            type="text" 
            placeholder="Search by name..." 
            class="search-input search-by-name"
          />
          <div v-if="isLoading" class="skeleton w-100"></div>
        </div>
        <div class="search-input-group">
          <div v-if="isLoading" class="skeleton w-100"></div>
          <select v-if="!isLoading" v-model="searchType" class="search-select" >
            <option value="">All types</option>
            <option v-for="type, index in pokemonTypes" :value="type" :key="index">{{type}}</option>
          </select>
        </div>
        <div v-if="isLoading" class="skeleton button-skeleton"></div>
        <button v-if="!isLoading" @click="clearFilters" class="clear-button">Clean</button>
      </div>
      <div class="results-info">
        <div v-if="isLoading" class="skeleton"></div>
        <span v-if="!isLoading">
          Show {{ paginatedPokemons.length }} from {{ filteredPokemons.length }} Pokemon 
          (Page {{ currentPage }} of {{ totalPages }})
        </span>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div v-if="totalPages > 1" class="pagination-container">
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
            
            <template v-for="page, in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :class="['pagination-btn', 'page-number', { 'active': page === currentPage }]"
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
            <label>Items per page:</label>
            <select v-model="itemsPerPage" @change="handleItemsPerPageChange">
              <option :value="18">18</option>
              <option :value="36">36</option>
              <option :value="54">54</option>
              <option :value="72">72</option>
            </select>
          </div>
      </div>
    </div>
    </div>

    <div class="row">
      <div class="col-2" v-for="(pokemon, index) in paginatedPokemons" :key="index">
        <div
          class="inner-pokemon-container"
          :class="{
            'type-normal': pokemon.types[0] === 'normal',
            'type-fighting': pokemon.types[0] === 'fighting',
            'type-flying': pokemon.types[0] === 'flying',
            'type-poison': pokemon.types[0] === 'poison',
            'type-ground': pokemon.types[0] === 'ground',
            'type-rock': pokemon.types[0] === 'rock',
            'type-bug': pokemon.types[0] === 'bug',
            'type-ghost': pokemon.types[0] === 'ghost',
            'type-steel': pokemon.types[0] === 'steel',
            'type-fire': pokemon.types[0] === 'fire',
            'type-water': pokemon.types[0] === 'water',
            'type-grass': pokemon.types[0] === 'grass',
            'type-electric': pokemon.types[0] === 'electric',
            'type-psychic': pokemon.types[0] === 'psychic',
            'type-ice': pokemon.types[0] === 'ice',
            'type-dragon': pokemon.types[0] === 'dragon',
            'type-dark': pokemon.types[0] === 'dark',
            'type-fairy': pokemon.types[0] === 'fairy',
          }"
        >
          <span class="pokemon-number">#{{ pokemon.originalIndex + 1 }}</span>
          <img :src="pokeBall" alt="pokeball" class="pokeball-image" />
          <img :src="pokeBall" alt="pokeball" class="pokeball-image-2" />
          <div class="name-and-image">
            <img :src="pokemon.img" :alt="pokemon.name" class="pokemon-image" />
            <h2 class="pokemon-name">{{ pokemon.name }}</h2>
          </div>
          <div class="types-badges-container">
            <span
              class="badge"
              :class="{
                'badge-type-normal': pokemon.types[0] === 'normal',
                'badge-type-fighting': pokemon.types[0] === 'fighting',
                'badge-type-flying': pokemon.types[0] === 'flying',
                'badge-type-poison': pokemon.types[0] === 'poison',
                'badge-type-ground': pokemon.types[0] === 'ground',
                'badge-type-rock': pokemon.types[0] === 'rock',
                'badge-type-bug': pokemon.types[0] === 'bug',
                'badge-type-ghost': pokemon.types[0] === 'ghost',
                'badge-type-steel': pokemon.types[0] === 'steel',
                'badge-type-fire': pokemon.types[0] === 'fire',
                'badge-type-water': pokemon.types[0] === 'water',
                'badge-type-grass': pokemon.types[0] === 'grass',
                'badge-type-electric': pokemon.types[0] === 'electric',
                'badge-type-psychic': pokemon.types[0] === 'psychic',
                'badge-type-ice': pokemon.types[0] === 'ice',
                'badge-type-dragon': pokemon.types[0] === 'dragon',
                'badge-type-dark': pokemon.types[0] === 'dark',
                'badge-type-fairy': pokemon.types[0] === 'fairy',
              }"
              >{{ pokemon.types[0] }}</span
            >
            <span
              v-if="pokemon.types[1]"
              class="badge"
              :class="{
                'badge-type-normal': pokemon.types[1] === 'normal',
                'badge-type-fighting': pokemon.types[1] === 'fighting',
                'badge-type-flying': pokemon.types[1] === 'flying',
                'badge-type-poison': pokemon.types[1] === 'poison',
                'badge-type-ground': pokemon.types[1] === 'ground',
                'badge-type-rock': pokemon.types[1] === 'rock',
                'badge-type-bug': pokemon.types[1] === 'bug',
                'badge-type-ghost': pokemon.types[1] === 'ghost',
                'badge-type-steel': pokemon.types[1] === 'steel',
                'badge-type-fire': pokemon.types[1] === 'fire',
                'badge-type-water': pokemon.types[1] === 'water',
                'badge-type-grass': pokemon.types[1] === 'grass',
                'badge-type-electric': pokemon.types[1] === 'electric',
                'badge-type-psychic': pokemon.types[1] === 'psychic',
                'badge-type-ice': pokemon.types[1] === 'ice',
                'badge-type-dragon': pokemon.types[1] === 'dragon',
                'badge-type-dark': pokemon.types[1] === 'dark',
                'badge-type-fairy': pokemon.types[1] === 'fairy',
              }"
              >{{ pokemon.types[1] }}</span
            >
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
    <div class="row">
      <div class="col-12">
        <div v-if="totalPages > 1" class="pagination-container">
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
            
            <template v-for="page, in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :class="['pagination-btn', 'page-number', { 'active': page === currentPage }]"
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
            <label>Items per page:</label>
            <select v-model="itemsPerPage" @change="handleItemsPerPageChange">
              <option :value="18">18</option>
              <option :value="36">36</option>
              <option :value="54">54</option>
              <option :value="72">72</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredPokemons.length === 0 && pokemons.length > 0" class="no-results">
      <p>No Pokemons found</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted, computed, watch } from 'vue'
import pokeBall from "../../assets/img/pokeball-bg.png";

const pokemons = ref([])
const searchName = ref('')
const searchType = ref('')
const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(18)

const getPokemonData = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151')
    const results = response.data.results
    const detailedData = await Promise.all(
      results.map(async (pokemon, originalIndex) => {
        const res = await axios.get(pokemon.url)
        const data = res.data
        const hp = data.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0
        const types = data.types.map((t) => t.type.name)
        const attacks = data.moves.slice(0, 4).map((m) => m.move.name)
        return {
          name: data.name,
          img: data.sprites.other['official-artwork'].front_default,
          hp_points: hp,
          height: data.height,
          weight: data.weight,
          types: types,
          attacks: attacks,
          originalIndex: originalIndex
        }
      })
    )
    pokemons.value = detailedData
  } catch (error) {
    console.error('Error fetching Pokémon data:', error)
  } finally {
    isLoading.value = false
  }
}

const filteredPokemons = computed(() => {
  return pokemons.value.filter(pokemon => {
    const matchesName = pokemon.name.toLowerCase().includes(searchName.value.toLowerCase())
    const matchesType = searchType.value === '' || pokemon.types.includes(searchType.value)
    return matchesName && matchesType
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredPokemons.value.length / itemsPerPage.value)
})

const paginatedPokemons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPokemons.value.slice(start, end)
})


const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
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
    
    const targetElement = document.getElementById('pokemon-collection')
    targetElement?.scrollIntoView({ behavior: 'smooth' })
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

watch([searchName, searchType], () => {
  currentPage.value = 1
})

onMounted(getPokemonData)

const pokemonTypes = ["normal","fighting","flying","poison","ground","rock","bug","ghost","steel","fire","water","grass","electric","psychic","ice","dragon","dark","fairy"]
</script>

<style lang="scss" scoped>
.search-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #d6020f 0%, #800e0e 100%);
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.search-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.search-input-group {
  flex: 1;
  min-width: 200px;
}

.search-input, .search-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  text-transform: capitalize;
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
  option {
    text-transform: capitalize;
  }
}

.search-by-name {
    text-transform: none;
}

.clear-button {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
}

.results-info {
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

.first-last-btn i, .prev-next-btn i{
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
  
  label {
    font-size: 0.9rem;
  }
  
  select {
    padding: 0.5rem;
    border: none;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.9);
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
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
        padding: .25rem .5rem;
        border-radius: .5rem;
        text-shadow: 1px 1px 1px #b0b0b0
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
  .pokeball-image {
    opacity: .15;
    position: absolute;
    width: 20%;
    right: 1rem;
  }
  .pokeball-image-2 {
    opacity: .05;
    position: absolute;
    width: 50%;
    left: -25%;
    bottom: 33%;
  }
}

.types-badges-container {
  display: flex;
  justify-content: center;
  gap: .5rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.pokemon-info {
    background-color: rgba(255, 255, 255, 0.03);
  box-shadow: 0 5px 5px #00000011;
    border-radius: .5rem;
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
            font-size: .925rem;
            margin-top: .25rem;
        }
    }
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
}

.skeleton {
  display: inline-block;
  border-radius: .5rem;
  background: linear-gradient(
    90deg,
    #e0e0e0 25%,
    #c0c0c0 50%,
    #e0e0e0 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite linear;
}

@keyframes skeleton-loading {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
}

.search-input-group .skeleton {
  height: 48px; 
}

.results-info .skeleton {
  height: 40px; 
  width: 254px;
}

.button-skeleton {
  width: 96px;
  height: 52px;
}
</style>