<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{
  delay?: number;
}>(), {
  delay: 0,
});

const el = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!el.value) return;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  observer.observe(el.value);
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div ref="el" class="reveal" :style="delay ? { transitionDelay: `${delay}s` } : {}">
    <slot />
  </div>
</template>
