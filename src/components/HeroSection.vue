<template>
<section class="hero hero-section">
    <div class="hero-body">
        <div class="container">
        <h1 class="title">
            {{title}}
        </h1>
        <h2 class="subtitle">
            {{ subtitle }}
        </h2>
        </div>
    </div>
</section>
</template>

<script>
export default {
    name:'heroSection',
    props:['title', 'subtitle']
}
</script>

<style>

</style>
