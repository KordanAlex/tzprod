<template>
  <div class="layout-shop">
    <nav class="shop-nav">
      <NuxtLink to="/" class="shop-logo">MyProductsShop</NuxtLink>

      <div class="nav-search">
        <input
          v-model="searchQuery"
          @input="onSearch"
          @focus="showResults = true"
          @blur="showResults = false"
          class="search-input"
          placeholder="Search products..."
        />
        <ul v-if="showResults && searchResults.length" class="search-results">
          <li
            v-for="product in searchResults"
            :key="product.id"
            class="search-item"
            @mousedown.prevent
            @click="goToProduct(product.id)"
          >
            <img :src="product.image" :alt="product.name" class="search-img" />
            <div>
              <div class="search-name">{{ product.name }}</div>
              <div class="search-price">{{ product.price.toLocaleString() }} ₽</div>
            </div>
          </li>
        </ul>
        <div v-else-if="showResults && searchQuery.length > 0 && !searchResults.length" class="search-empty">
          Nothing found
        </div>
      </div>

      <div class="nav-right">
        <NuxtLink to="/danger-zone-666" class="nav-link danger">НЕ НАЖИМАТЬ, А ТО УБЬЕТ!</NuxtLink>
        <NuxtLink to="/users" class="nav-link">Admin Users</NuxtLink>
      </div>
    </nav>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number
  name: string
  price: number
  image: string
}

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref<Product[]>([])
const showResults = ref(false)
let timeout: ReturnType<typeof setTimeout>

const onSearch = () => {
  clearTimeout(timeout)
  timeout = setTimeout(async () => {
    if (searchQuery.value.trim()) {
      searchResults.value = await $fetch<Product[]>('/api/products', {
        query: { search: searchQuery.value }
      })
    } else {
      searchResults.value = []
    }
  }, 300)
}

const goToProduct = (id: number) => {
  showResults.value = false
  searchQuery.value = ''
  searchResults.value = []
  router.push(`/products/${id}`)
}
</script>

<style scoped>
.layout-shop {
  background: #0d0d0f;
  min-height: 100vh;
}

.shop-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: #0d0d0f;
  border-bottom: 1px solid #1a1a1c;
}

.shop-logo {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #f5c842;
  text-decoration: none;
}

.nav-link {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #e8e6e1;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #222;
  border-radius: 6px;
  transition: all 0.15s;
}

/* Search */
.nav-search {
  position: relative;
  flex: 1;
  max-width: 320px;
  margin: 0 24px;
}

.search-input {
  width: 100%;
  height: 38px;
  padding: 0 14px;
  background: #1a1a1c;
  border: 1px solid #2a2a2e;
  border-radius: 8px;
  color: #e8e6e1;
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  line-height: 38px;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #f5c842;
}

.search-input::placeholder {
  color: #444;
}

.search-results {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: #141416;
  border: 1px solid #2a2a2e;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 200;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s;
}

.search-item:hover {
  background: #1e1e22;
}

.search-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}

.search-name {
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #e8e6e1;
}

.search-price {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #f5c842;
  margin-top: 2px;
}

.search-empty {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  padding: 12px;
  text-align: center;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #444;
  background: #141416;
  border: 1px solid #2a2a2e;
  border-radius: 8px;
  z-index: 200;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-link:hover {
  border-color: #f5c842;
  color: #f5c842;
}

.nav-link.danger {
  color: #f55;
  border-color: #6b1a1a;
  animation: pulse 1.5s ease infinite;
}

.nav-link.danger:hover {
  background: #f55;
  color: #fff;
  border-color: #f55;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>