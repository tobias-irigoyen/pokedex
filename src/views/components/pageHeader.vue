<template>
<header class="header">
    <div class="container">
        <div class="row">
            <div class="col-12 logo-container text-center">
                <img :src="pokedexLogo" alt="pokemon logo" />
                <h1 class="sr-only">Pokemon</h1>
            </div>
            <div class="col-4 info-col">
                <h2>Use our Pokedex</h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                <button class="primary-button">Call to action</button>
            </div>
            <div class="col-8 header-image-container">
                <img :src="pokedex" alt="pikachu" class="header-image" />
            </div>
        </div>
    </div>
</header>

</template>

<script setup lang="ts">
import pikachuImage from "../../assets/img/pikachu.png"
import pokedex from "../../assets/img/pokedex-3d.png"
import pokedexLogo from "../../assets/img/pokedex-logo.png"

</script>

<style lang="scss" scoped>
.header {
    background-color: #fafafa;
    margin-left: -12px;
    margin-right: -12px;
    padding-top: 24px;
    .logo-container {
        img {
            max-width: 200px;
        }
    }
}
.header-image {
    height: 400px;
}
.primary-button {
    background: #4a4aff;
    color: #FFF;
    padding: 6px 50px;
    box-shadow: none;
    border: none;
    font-weight: 600;
}
.header-image-container {
    display: flex;
    justify-content: flex-end;
}
.info-col {
    padding-top: 36px;
}

</style>