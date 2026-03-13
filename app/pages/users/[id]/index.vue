<script setup>

const route = useRoute()

const userStore = useUserStore()

await userStore.getUsers(route.params.id)

</script>

<template>
  <div>
    
  </div>
</template>

<style scoped>

</style>