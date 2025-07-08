<template>
  <header class="header">
    <div class="container">
      <div class="row">
        <div class="col-12 logo-container text-center">
          <img :src="pokedexLogo" alt="pokedex logo" />
          <h1 class="sr-only">Pokedex</h1>
        </div>
        <div class="col-6 col-md-4 col-lg-4 col-xl-4 info-col">
          <h2>Try the Pokedex and find the Pokemon</h2>
          <p>
            Use our Pokedex by entering the Pokemon's name, number or type to see its image, type,
            weight, height, and much more!
          </p>
          <button @click="goToPokedex" class="primary-button">Try it!</button>
        </div>
        <div class="col-6 col-md-8 col-lg-8 col-xl-8 header-image-container">
          <img :src="pokedex" alt="pokedex" class="header-image" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import pokedex from '../../assets/img/pokedex-3d.png'
import pokedexLogo from '../../assets/img/pokedex-logo.png'

const goToPokedex = () => {
  const targetElement = document.getElementById('pokemon-collection')
  targetElement?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
.header {
  background-color: #ececec;
  margin-left: -12px;
  margin-right: -12px;
  padding-top: 24px;
  padding-bottom: 24px;
  .logo-container {
    img {
      max-width: 240px;
    }
  }
}
.header-image {
  height: 400px;
}
.primary-button {
  background-color: #d6020f;
  color: #fff;
  padding: 0.75rem 1.5rem;
  box-shadow: none;
  font-weight: 600;
  border-radius: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  &:hover {
    background-color: #bb000c;
  }
}
.header-image-container {
  display: flex;
  justify-content: flex-end;
}
.info-col,
.header-image-container {
  padding-top: 36px;
}

@media (max-width: 576px) {
  .header-image-container {
    align-items: center;
    .header-image {
      width: 145.66px;
      height: 165.83px;
    }
  }
}
@media (min-width: 576px) and (max-width: 768px) {
  .header-image-container {
    .header-image {
      width: 100%;
      height: auto;
    }
  }
}
</style>
