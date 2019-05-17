<template>
  <div class="about">
    <Hero title="About" subtitle="This is an about page"/>
    <div class="container" style="margin-top:50px;">
      <div class="columns">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem debitis dolor, enim, ratione iure perferendis alias, quod laudantium totam quibusdam temporibus cumque illo ipsum quaerat beatae reprehenderit iste? Magni, ab.</p>        
      </div>
    </div>
  </div>
</template>
<script>
import Hero from '@/components/HeroSection.vue'
export default {
    name: 'about',
    components: {
        Hero
    }
}
</script>