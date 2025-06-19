<template>
<section id="pokemon-collection">
    <div class="row">
        <div class="col-3"  v-for="pokemon in pokemons" :key="pokemon.puntos_vida">
            <div class="inner-pokemon-container"
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
                }">
                <h2>{{ pokemon.name }}</h2>
                <img :src="pokemon.img" :alt="pokemon.name" />
                <span>HP:</span> {{ pokemon.hp_points }}
                <span>Height:</span> {{ pokemon.height }}
                <span>Weight:</span> {{ pokemon.weight }}
                <span>Types:</span> {{ pokemon.types.join(', ') }}
                <span>Attacks:</span> {{ pokemon.attacks.join(', ') }}
            </div>
        </div>
    </div>
</section>

</template>

<script setup lang="ts">

import axios from 'axios';
import { ref, onMounted } from 'vue';

const pokemons = ref([])

const getPokemonData = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150')
  const results = response.data.results

  const detailedData = await Promise.all(
    results.map(async (pokemon) => {
      const res = await axios.get(pokemon.url)
      const data = res.data
      const hp = data.stats.find(s => s.stat.name === 'hp')?.base_stat || 0
      const types = data.types.map(t => t.type.name)
      const attacks = data.moves.slice(0, 4).map(m => m.move.name)

      console.log('data.types', data.types)

      return {
        name: data.name,
        img: data.sprites.front_default,
        hp_points: hp,
        height: data.height,
        weight: data.weight,
        types: types,
        attacks: attacks
      }
    })
  )

  pokemons.value = detailedData
}

onMounted(getPokemonData)
console.log(getPokemonData)
</script>

<style lang="scss" scoped>

</style>