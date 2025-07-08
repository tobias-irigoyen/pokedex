<template>
  <div class="search-section">
    <div class="search-container">
      <div class="search-input-group">
        <input
          v-if="!props.isLoading"
          v-model="searchModel"
          type="text"
          :placeholder="props.searchPlaceholder"
          class="search-input search-by-name"
        />
        <div v-if="props.isLoading" class="skeleton w-100"></div>
      </div>
      <div class="search-input-group">
        <div v-if="props.isLoading" class="skeleton w-100"></div>
        <select v-if="!props.isLoading" v-model="selectedItem" class="search-select">
          <option value="">{{ props.defaultOptionText }}</option>
          <option v-for="(item, index) in props.options" :value="item" :key="index">
            {{ item }}
          </option>
        </select>
      </div>
      <div v-if="props.isLoading" class="skeleton button-skeleton"></div>
      <button v-if="!props.isLoading" @click="handleClearFilters" class="clear-button">
        Clean
      </button>
    </div>
    <div class="results-info d-none">
      <div v-if="props.isLoading" class="skeleton"></div>
      <span v-if="!props.isLoading">
        Show {{ props.paginatedItems?.length }} from {{ props.totalPokemons }} Pokemon (Page
        {{ props.currentPage }} of {{ props.totalPages }})
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{
  defaultOptionText: string
  options: string[]
  isLoading?: boolean
  searchPlaceholder: string
  paginatedItems: any[]
  filteredItems: any[]
  currentPage: number
  totalPages: number
  totalPokemons: number
  search: string
  selectedItem: string
}>()

const searchModel = ref<string>('')
const selectedItem = ref<string>('')

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:selectedItem', value: string): void
  (e: 'clear-filters'): void
}>()

watch(
  () => props.search,
  (newValue) => {
    searchModel.value = newValue || ''
  },
  { immediate: true },
)

watch(searchModel, (newValue) => {
  emit('update:search', newValue)
})

watch(
  () => props.selectedItem,
  (newValue) => {
    selectedItem.value = newValue || ''
  },
  { immediate: true },
)

watch(selectedItem, (newValue) => {
  emit('update:selectedItem', newValue)
})

const handleClearFilters = () => {
  searchModel.value = ''
  selectedItem.value = ''
  emit('clear-filters')
}
</script>

<style lang="scss" scoped>
.search-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #d6020f;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
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

.search-input,
.search-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  text-transform: capitalize;
  background-color: #fff;

  &:focus {
    outline: none;
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
  font-size: 0.925rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

.skeleton {
  display: inline-block;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, #e0e0e0 25%, #c0c0c0 50%, #e0e0e0 75%);
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
</style>
