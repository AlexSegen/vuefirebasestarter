
<template>
  <div class="products">
    <Hero title="Products" subtitle="Firebase CRUD example"/>
    <div class="container" style="margin-top:50px;">
      <div class="columns">
          <div class="column">
              <h2>Editing product</h2>
              <div class="card form">
                  <div class="card-content">
                        <div class="field">
                            <label class="label">Name</label>
                            <div class="control">
                                <input class="input" type="text" placeholder="Product name" v-model="newItem.name">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Price</label>
                            <div class="control">
                                <input class="input" type="number" placeholder="Product price" v-model="newItem.price">
                            </div>
                        </div>
                        <div class="field">
                            <button type="button" @click="updateItem" class="button is-primary">Save product</button>
                        </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import {database} from '@/config/firebase.config'

import Hero from '@/components/HeroSection.vue'
export default {
    name: 'EditProduct',
    components: {
        Hero
    },
    data() {
        return {
            newItem: {
            }
        }
    },
    created() {
        let item = this.itemsObj[this.$route.params.id]
        this.newItem = {
        name: item.name,
        price: item.price
        }
    },
    firebase: {
        products: database.ref('products'),
        itemsObj: {
            source: database.ref('products'),
            asObject: true
        }
    },
    methods: {
        updateItem() {
            this.$firebaseRefs.products.child(this.$route.params.id).set(this.newItem);
            this.$router.push('/products')
        }
    }
}
</script>