<script setup lang="ts">
interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
}

const { data: products } = await useFetch<Product[]>('/api/products', {
  default: () => []
})
</script>

<template>
  <div class="products-page">
    <header class="page-header">
      <div class="header-left">
        <span class="header-label">CATALOG</span>
        <h1 class="header-title">Products</h1>
      </div>
      <span class="total-badge">{{ products.length }} items</span>
    </header>

    <div v-if="!products.length" class="loading">Loading...</div>

    <div class="grid">
      <NuxtLink
        v-for="product in products"
        :key="product.id"
        :to="`/products/${product.id}`"
        class="card"
      >
        <div class="card-image">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div class="card-body">
          <span class="card-category">{{ product.category }}</span>
          <h3 class="card-name">{{ product.name }}</h3>
          <p class="card-price">{{ product.price.toLocaleString() }} ₽</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #0d0d0f;
  color: #e8e6e1;
  font-family: 'Syne', sans-serif;
  padding: 48px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;
  border-bottom: 1px solid #222;
  padding-bottom: 24px;
}

.header-label {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #f5c842;
  display: block;
  margin-bottom: 4px;
}

.header-title {
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  margin: 0;
  color: #fff;
}

.total-badge {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #666;
}

.loading {
  text-align: center;
  color: #555;
  padding: 48px;
  font-family: 'DM Mono', monospace;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.card {
  background: #141416;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  cursor: pointer;
}

.card:hover {
  border-color: #f5c842;
  transform: translateY(-4px);
}

.card-image {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.card-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-category {
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: #555;
  text-transform: uppercase;
}

.card-name {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #e8e6e1;
}

.card-price {
  font-family: 'DM Mono', monospace;
  font-size: 14px;
  color: #f5c842;
  margin: 0;
  margin-top: 4px;
}
</style>
