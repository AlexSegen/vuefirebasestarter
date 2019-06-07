<template>
  <div class="products">
    <Hero title="Products" subtitle="Firebase CRUD example"/>
    <div class="container" style="margin-top:50px;">
      <div class="columns">
          <div class="column">
              <h2>Add new product</h2>
              <hr>
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
                            <button type="button" @click="addItem" class="button is-primary" :disabled="!validFields">Save product</button>
                        </div>
                  </div>
              </div>
          </div>
          <div class="column is-four-fifths">
              <h2>Product list</h2>
              <hr>
              <table class="table is-hovereable is-fullwidth">
                  <thead>
                      <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Created At</th>
                          <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      <template v-if="products.length > 0"> 
                        <tr v-for="(item, index) in products" :key="item['.key']">
                            <td>{{index + 1}}</td>
                            <td>{{item.name}}</td>
                            <td>$ {{item.price}}</td>
                            <td>{{item.createdAt | formatDate}}</td>
                            <td>
                                <router-link :to="{ name: 'productDetails', params: {id: item['.key']} }" class="button is-default" type="button">Edit</router-link>
                                <button class="button is-default" type="button" @click="deleteItem(item['.key'])"><i class="fas fa-trash has-text-danger"></i></button>
                            </td>
                        </tr>
                      </template>
                      <tr v-else>
                          <td class="has-text-centered" colspan="5">Add some products</td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import {toastme} from 'toastmejs'
import notification from '@/libs/notifications'
import {database, firebase} from '@/config/firebase.config'
import utils from '@/libs/formaters'

export default {
    name: 'Products',
    data() {
        return {
            loading: false,
            newItem: {
                name: '',
                price: null
            }
        }
    },
    firebase: {
        products: database.ref().child('products')
    },
    computed:{
        validFields(){
            return this.newItem.name.trim().length > 0 && this.newItem.price
        }
    },
    filters: {
        formatDate(val) {
            return utils.formatDateAndTime(val);
        }
    },
    methods: {
        addItem() {
            this.loading = true;
            try {
                this.$firebaseRefs.products.push({
                    name: this.newItem.name,
                    price: this.newItem.price,
                    createdAt: new Date(),
                    updatedAt: null
                })
                this.newItem.name = '';
                this.newItem.price = '';
                notification.success('Product added!');
                this.loading = false;
            } catch (error) {
                notification.error(e.message);
                this.loading = false;
            }
        },
        deleteItem(key) {

            var _this = this;

            toastme.yesNoDialog({
                title: "Hey!",
                text: "Do you want to delete this item?",
                textConfirm: "Confirm",
                textCancel: "Cancel", 
                showCancel: true,
                type: "warning",
                dark: true
            }).then(function(value) {
                if (value) {
                    _this.loading = true;
                    try {
                        _this.$firebaseRefs.products.child(key).remove();
                        notification.warning('Product deleted!');
                        _this.loading = false;
                    } catch (error) {
                        notification.error(e.message);
                        _this.loading = false;
                    }
                }
            });
            

        }
    }
}
</script>