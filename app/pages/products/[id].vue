<template>
  <div class="product-page">
    <NuxtLink to="/" class="back-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Back to catalog
    </NuxtLink>

    <div v-if="product" class="product">
      <div class="product-hero">
        <img :src="product.image" :alt="product.name" class="product-image" />
      </div>

      <div class="product-info">
        <span class="product-category">{{ product.category }}</span>
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-price">{{ product.price.toLocaleString() }} ₽</p>
        <p class="product-desc">{{ product.description }}</p>

        <div class="product-actions">
          <button class="btn-buy">Add to cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
}

const route = useRoute()

const { data: product } = await useFetch<Product>('/api/products', {
  query: { id: route.params.id }
})


if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

.product-page {
  min-height: 100vh;
  background: #0d0d0f;
  color: #e8e6e1;
  font-family: 'Syne', sans-serif;
  padding: 48px 40px;
  max-width: 700px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 32px;
  transition: color 0.15s;
}

.back-link:hover {
  color: #f5c842;
}

.product {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.product-hero {
  background: #141416;
  border: 1px solid #222;
  border-radius: 16px;
  padding: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  max-width: 100%;
  max-height: 250px;
  object-fit: contain;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-category {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: #555;
  text-transform: uppercase;
}

.product-name {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  color: #fff;
}

.product-price {
  font-family: 'DM Mono', monospace;
  font-size: 24px;
  color: #f5c842;
  margin: 0;
}

.product-desc {
  font-size: 15px;
  line-height: 1.6;
  color: #888;
  margin: 8px 0 0;
}

.product-actions {
  margin-top: 24px;
}

.btn-buy {
  background: #f5c842;
  color: #0d0d0f;
  border: none;
  border-radius: 8px;
  padding: 14px 32px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-buy:hover {
  opacity: 0.85;
}
</style>
