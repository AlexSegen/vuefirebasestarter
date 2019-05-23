<template>
  <div class="notfound">
    <Hero title="Error 404" subtitle="Page not found" />
    <div class="container" style="margin-top:50px;">
      <div class="columns">
          <div class="column">
            <p>This page has been deleted or does not exist.</p>
            <p><router-link to="/"><i class="fas fa-chevron-left"></i>  Home</router-link></p>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'notfound',
}
</script>