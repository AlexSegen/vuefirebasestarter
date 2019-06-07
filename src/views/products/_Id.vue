
<template>
  <div class="products">
    <Hero title="Products" subtitle="Firebase CRUD example"/>
    <div class="container" style="margin-top:50px;">
      <div class="columns">
          <div class="column">
              <h2>Editing product</h2>
              <hr>
              <div class="card form">
                  <div class="card-content">
                        <div class="field">
                            <label class="label">Name</label>
                            <div class="control">
                                <input class="input" type="text" placeholder="Product name" v-model="newItem.name" :disabled="loading">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Price</label>
                            <div class="control">
                                <input class="input" type="number" placeholder="Product price" v-model="newItem.price" :disabled="loading">
                            </div>
                        </div>
                        <div class="field" v-if="newItem.updatedAt">
                             <p class="help is-success">Last update {{newItem.updatedAt | formatDate}}</p>
                        </div>
                        <div class="field">
                            <router-link to="/products" class="button is-default"><i class="fas fa-chevron-left"></i> Go back</router-link>
                            <button type="button" @click="updateItem" class="button is-primary" :class="{'is-loading': loading}">Save product</button>
                        </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import notification from '@/libs/notifications'
import utils from '@/libs/formaters'
import {database, firebase} from '@/config/firebase.config'

export default {
    name: 'EditProduct',
    data() {
        return {
            loading: false,
            newItem: {
                name: "",
                price: "",
                createdAt: "",
                updatedAt: ""
            }
        }
    },
    created() {
        let item = this.itemsObj[this.$route.params.id]
        this.newItem = {
            name: item.name,
            price: item.price,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }
    },
    firebase: {
        products: database.ref('products'),
        itemsObj: {
            source: database.ref('products'),
            asObject: true
        }
    },
    filters: {
        formatDate(val) {
            return utils.formatDateAndTime(val);
        }
    },
    methods: {
        updateItem() {
            this.loading = true;
            try {
                this.newItem.updatedAt = new Date();
                this.$firebaseRefs.products.child(this.$route.params.id).set(this.newItem);
                notification.info('Product updated!')
                this.loading = false;
            } catch (error) {
                notification.error(e.message)
                this.loading = false;
            }
            
        }
    }
}
</script>

<style scoped>
.card.form{
    max-width: 350px;
    margin: 10px auto;
}
</style>
