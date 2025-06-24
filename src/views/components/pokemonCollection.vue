<template>
  <section id="pokemon-collection">
    <pokemonSearchbar
      :default-option-text="'All Types'"
      :options="pokemonTypes"
      :is-loading="isLoading"
      v-model:search="searchName"
      v-model:selected-item="searchType"
      :search-placeholder="'Find your Pokemon...'"
      @clear-filters="clearFilters"
      :paginated-items="paginatedPokemons"
      :filtered-items="filteredPokemons"
      :current-page="currentPage"
      :total-pages="totalPages"
    />
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
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" v-for="(pokemon, index) in paginatedPokemons" :key="index">
        <div
          class="inner-pokemon-container"
          @click="() => openModal(pokemon)"
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
          <img :src="pokeBall" alt="background pokeball" class="pokeball-image" />
          <img :src="pokeBall" alt="background pokeball" class="pokeball-image-2" />
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

    
    <teleport to="body">
  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal-content" 
          :class="{
            'type-normal': selectedPokemon.types[0] === 'normal',
            'type-fighting': selectedPokemon.types[0] === 'fighting',
            'type-flying': selectedPokemon.types[0] === 'flying',
            'type-poison': selectedPokemon.types[0] === 'poison',
            'type-ground': selectedPokemon.types[0] === 'ground',
            'type-rock': selectedPokemon.types[0] === 'rock',
            'type-bug': selectedPokemon.types[0] === 'bug',
            'type-ghost': selectedPokemon.types[0] === 'ghost',
            'type-steel': selectedPokemon.types[0] === 'steel',
            'type-fire': selectedPokemon.types[0] === 'fire',
            'type-water': selectedPokemon.types[0] === 'water',
            'type-grass': selectedPokemon.types[0] === 'grass',
            'type-electric': selectedPokemon.types[0] === 'electric',
            'type-psychic': selectedPokemon.types[0] === 'psychic',
            'type-ice': selectedPokemon.types[0] === 'ice',
            'type-dragon': selectedPokemon.types[0] === 'dragon',
            'type-dark': selectedPokemon.types[0] === 'dark',
            'type-fairy': selectedPokemon.types[0] === 'fairy',
          }">
      <button class="modal-close" @click="showModal = false">×</button>
      <div v-if="selectedPokemon">
        <div class="row">
          <div class="col-6 d-flex flex-column align-items-start justifiy-content-start pokemon-modal-stats">
            <h2 style="text-transform: capitalize;">{{ selectedPokemon.name }}</h2>
            <p><span class="stats-title">HP:</span><span> {{ selectedPokemon.hp_points }}</span></p>
            <p><span class="stats-title">Height:</span><span> {{ selectedPokemon.height }} M</span></p>
            <p><span class="stats-title">Weight:</span><span> {{ selectedPokemon.weight }} KG</span></p>
            <p><span class="stats-title">Types:</span><span
              class="badge"
              :class="{
                'badge-type-normal': selectedPokemon.types[0] === 'normal',
                'badge-type-fighting': selectedPokemon.types[0] === 'fighting',
                'badge-type-flying': selectedPokemon.types[0] === 'flying',
                'badge-type-poison': selectedPokemon.types[0] === 'poison',
                'badge-type-ground': selectedPokemon.types[0] === 'ground',
                'badge-type-rock': selectedPokemon.types[0] === 'rock',
                'badge-type-bug': selectedPokemon.types[0] === 'bug',
                'badge-type-ghost': selectedPokemon.types[0] === 'ghost',
                'badge-type-steel': selectedPokemon.types[0] === 'steel',
                'badge-type-fire': selectedPokemon.types[0] === 'fire',
                'badge-type-water': selectedPokemon.types[0] === 'water',
                'badge-type-grass': selectedPokemon.types[0] === 'grass',
                'badge-type-electric': selectedPokemon.types[0] === 'electric',
                'badge-type-psychic': selectedPokemon.types[0] === 'psychic',
                'badge-type-ice': selectedPokemon.types[0] === 'ice',
                'badge-type-dragon': selectedPokemon.types[0] === 'dragon',
                'badge-type-dark': selectedPokemon.types[0] === 'dark',
                'badge-type-fairy': selectedPokemon.types[0] === 'fairy',
              }"
              >{{ selectedPokemon.types[0] }}</span
            >
            <span
              v-if="selectedPokemon.types[1]"
              class="badge"
              :class="{
                'badge-type-normal': selectedPokemon.types[1] === 'normal',
                'badge-type-fighting': selectedPokemon.types[1] === 'fighting',
                'badge-type-flying': selectedPokemon.types[1] === 'flying',
                'badge-type-poison': selectedPokemon.types[1] === 'poison',
                'badge-type-ground': selectedPokemon.types[1] === 'ground',
                'badge-type-rock': selectedPokemon.types[1] === 'rock',
                'badge-type-bug': selectedPokemon.types[1] === 'bug',
                'badge-type-ghost': selectedPokemon.types[1] === 'ghost',
                'badge-type-steel': selectedPokemon.types[1] === 'steel',
                'badge-type-fire': selectedPokemon.types[1] === 'fire',
                'badge-type-water': selectedPokemon.types[1] === 'water',
                'badge-type-grass': selectedPokemon.types[1] === 'grass',
                'badge-type-electric': selectedPokemon.types[1] === 'electric',
                'badge-type-psychic': selectedPokemon.types[1] === 'psychic',
                'badge-type-ice': selectedPokemon.types[1] === 'ice',
                'badge-type-dragon': selectedPokemon.types[1] === 'dragon',
                'badge-type-dark': selectedPokemon.types[1] === 'dark',
                'badge-type-fairy': selectedPokemon.types[1] === 'fairy',
              }"
              >{{ selectedPokemon.types[1] }}</span
            ></p>
            <p><span class="stats-title">Attacks:</span><span class="attacks-list"> {{ selectedPokemon.attacks.join(', ') }}</span></p>
          </div>
          <div class="col-6">
            <img :src="selectedPokemon.img" :alt="selectedPokemon.name" class="modal-pokemon-image" />
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
import pokeBall from "../../assets/img/pokeball-bg.png";
import pokemonSearchbar from './pokemonSearchbar.vue';

const pokemons = ref([])
const searchName = ref('')
const searchType = ref('')
const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(18)
const showModal = ref(false)
const selectedPokemon = ref<any | null>(null)

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
    const matchesEnteredType = pokemon.types[0].toLowerCase().includes(searchName.value.toLowerCase())
    const matchesNumber = (pokemon.originalIndex + 1).toString().includes(searchName.value)
    const matchesType = searchType.value === '' || pokemon.types.includes(searchType.value)
    return (matchesName || matchesEnteredType || matchesNumber) && matchesType
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

const openModal = (pokemon: any) => {
  selectedPokemon.value = pokemon
  showModal.value = true
}

</script>

<style lang="scss" scoped>




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
  padding: 2rem;
  width: 750px;
  text-align: center;
  color: #333;
  position: relative;
  overflow: hidden;
  
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
      color: #FFF;
      font-size: 600;
      margin-bottom: 1rem;
    }
    p {
      color: #FFF;
      display: flex;
      span.stats-title {
        font-weight: 600;
        margin-right: 1rem;
        width: 100px;
        height: max-content;
        display: inline;
        text-align: left;
      }
    }
    .badge {
      margin-right: .5rem;
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
    opacity: .05;
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
    margin-left: 1rem;
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

</style>