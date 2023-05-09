<script setup lang="ts">

</script>

<template>
  <span class="tag">
    <slot />
  </span>
</template>

<style scoped>
.tag {
  @apply min-w-50px inline-block rounded b hover-shadow-md pl-4px pr-4px;
  cursor: pointer;
}
</style>
