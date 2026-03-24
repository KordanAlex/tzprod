<template>
  <div class="not-found">
    <span class="nf-code">404</span>
    <h1 class="nf-title">Page not found</h1>
    <p class="nf-text">The page you're looking for doesn't exist or has been moved.</p>
    <NuxtLink to="/" class="nf-link">
      Back to catalog
    </NuxtLink>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

.not-found {
  min-height: 100vh;
  background: #0d0d0f;
  color: #e8e6e1;
  font-family: 'Syne', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
}

.nf-code {
  font-family: 'DM Mono', monospace;
  font-size: 120px;
  font-weight: 700;
  color: #1a1a1c;
  line-height: 1;
}

.nf-title {
  font-size: 28px;
  font-weight: 800;
  margin: 16px 0 0;
  color: #fff;
}

.nf-text {
  font-size: 15px;
  color: #555;
  margin: 12px 0 0;
}

.nf-link {
  margin-top: 32px;
  background: #f5c842;
  color: #0d0d0f;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  transition: opacity 0.15s;
}

.nf-link:hover {
  opacity: 0.85;
}
</style>
