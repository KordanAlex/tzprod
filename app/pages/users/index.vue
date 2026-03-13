<script setup>
    const userStore = useUserStore()
    await userStore.getUsers()
</script>

<template>
  <div class="users__wrapper">
    <div class="users" v-for="post in userStore.users">
        <h2>{{ post.id }}</h2>
        <h3>{{ post.name }}</h3>
        <h4>{{ post.age }}</h4>
        111111111
    </div>
  </div>
</template>

<style scoped>
.users {
    display: flex;
}
.users__wrapper {
    background-color: rgba(128, 128, 128, 0.050);
    width: 100%;

}
</style>