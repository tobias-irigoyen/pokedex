import { createRouter, createWebHistory } from 'vue-router'
import MainContent from '../views/home/mainContent.vue';
import PokemonDetail from '../views/pokemonDetail/pokemonDetail.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: MainContent
  },
  {
    path: '/pokemon-detail',
    name: 'pokemon-detail',
    component: PokemonDetail
  }
]

const router = createRouter({
  history: createWebHistory(), // o createWebHashHistory() si preferís con #
  routes
})

export default router