<template>
  <div class="layout-admin">
    <nav class="admin-nav">
      <span class="admin-logo">ADMIN PANEL</span>
      <NuxtLink to="/" class="nav-link">Back to Shop</NuxtLink>
    </nav>
    <slot />
  </div>
</template>

<style scoped>
.layout-admin {
  background: #0d0d0f;
  min-height: 100vh;
}

.admin-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: #0d0d0f;
  border-bottom: 1px solid #1a1a1c;
}

.admin-logo {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  letter-spacing: 0.15em;
  color: #f55;
  font-weight: 700;
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

.nav-link:hover {
  border-color: #f5c842;
  color: #f5c842;
}
</style>
