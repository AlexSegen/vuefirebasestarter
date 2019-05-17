<template>
<div id="app">
  <Navbar/>

  <div class="main-container">
    <router-view/>
  </div>

</div>
</template>

<script>
import Navbar from '@/components/Navbar'
export default {
name: 'App',
components: {
  Navbar
}  
}
</script>