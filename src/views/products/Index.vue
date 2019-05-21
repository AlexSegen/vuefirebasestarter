<template>
  <div class="products">
    <Hero title="Products" subtitle="Firebase CRUD example"/>
    <div class="container" style="margin-top:50px;">
      <div class="columns">
          <div class="column">
              <h2>Add new product</h2>
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
                            <button type="button" @click="addItem" class="button is-primary">Save product</button>
                        </div>
                  </div>
              </div>
          </div>
          <div class="column is-four-fifths">
              <h2>Product list</h2>
              <table class="table is-hoverable is-fullwidth">
                  <thead>
                      <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(item, index) in products" :key="item['.key']">
                          <td>{{index + 1}}</td>
                          <td>{{item.name}}</td>
                          <td>$ {{item.price}}</td>
                          <td>
                              <router-link :to="{ name: 'productDetails', params: {id: item['.key']} }" class="button is-default" type="button">Edit</router-link>
                              <button class="button is-default" type="button" @click="deleteItem(item['.key'])"><i class="fas fa-trash"></i></button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import firebaseApp from '@/config/firebase.config'

import Hero from '@/components/HeroSection.vue'
export default {
    name: 'Products',
    components: {
        Hero
    },
    data() {
        return {
            newItem: {
                name: '',
                price: ''
            }
        }
    },
    firebase: {
        products: firebaseApp.database().ref('products')
    },
    methods: {
        addItem() {
            this.$firebaseRefs.products.push({
                name: this.newItem.name,
                price: this.newItem.price
            });
            
            this.newItem.name = '';
            this.newItem.price = '';
            //this.$router.push('/index')
        },
        deleteItem(key) {
            this.$firebaseRefs.products.child(key).remove();
        }
    }
}
</script>