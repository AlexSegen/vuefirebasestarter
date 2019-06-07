
<template>
  <div class="post">
    <Hero :title="newItem.title" :subtitle="'Author: ' + newItem.author"/>
    <div class="container" style="margin-top:50px;">
      <div class="columns">
          <div class="column">
              <router-link :to="{ name: 'blog'}">Go back</router-link>
              <hr>
              <div class="card card-content post content" v-html="newItem.content">

              </div>
              <hr>
              Created {{newItem.createdAt | formatDate}}
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/libs/formaters'
import notification from '@/libs/notifications'
import {database, firebase} from '@/config/firebase.config'

export default {
    name: 'EditPost',
    data() {
        return {
            loading: false,
            newItem: {
                title: "",
                content: "",
                createdAt: "",
                author: {
                    displayName: ""
                }
            }
        }
    },
    created() {
        let item = this.itemsObj[this.$route.params.id]
        this.newItem = {
            title: item.title,
            content: item.content,
            createdAt: item.createdAt,
            author: item.author,
            owner: item.owner,
            slug: item.slug
        }
    },
    firebase: {
        posts: database.ref('posts'),
        itemsObj: {
            source: database.ref('posts'),
            asObject: true
        }
    },
    filters: {
        formatDate(val) {
            return utils.formatFirebaseDate(val.seconds);
        }
    }
}
</script>

<style scoped>

.card.card-content.post {
    color: #737373;
    background-color:  #fff;
}
</style>
