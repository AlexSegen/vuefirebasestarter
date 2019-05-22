<template>
  <div class="Forbiden">
    <Hero title="Error 401" subtitle="Not authorized"/>
    <div class="container" style="margin-top:50px;">
      <div class="columns">
          <div class="column">
            <p>You don't have permission to see this page.</p>
            <p><router-link to="/"><i class="fas fa-chevron-left"></i>  Home</router-link></p>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    name: 'Forbiden'
}
</script>