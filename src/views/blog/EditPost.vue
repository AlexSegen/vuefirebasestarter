
<template>
  <div class="post">
    <Hero title="Editing Post" subtitle="Firebase CRUD example"/>
    <div class="container" style="margin-top:50px;">
      <div class="columns">
          <div class="column">
              <h2>Editing Post</h2>
              <hr>
              <div class="card form">
                  <div class="card-content">
                        <div class="field">
                            <label class="label">Title</label>
                            <div class="control">
                                <input class="input" type="text" placeholder="Post title" v-model="newItem.title" :disabled="loading">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Content</label>
                            <div class="control">
                                <textarea class="textarea"  placeholder="Post content" v-model="newItem.content" :disabled="loading"></textarea>
                            </div>
                        </div>
                        <div class="field" v-if="newItem.updatedAt">
                             <p class="help is-success">Last update {{newItem.updatedAt | formatDate}}</p>
                        </div>
                        <div class="field">
                            <router-link to="/blog" class="button is-default"><i class="fas fa-chevron-left"></i> Go back</router-link>
                            <button type="button" @click="updateItem" class="button is-primary" :class="{'is-loading': loading}">Update post</button>
                        </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/libs/formaters'
import {sluglify} from '@/libs/sluglify'
import { mapGetters, mapActions } from 'vuex'
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
                updatedAt: ""
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
    },
    methods: {
        async updateItem() {
            this.loading = true;
            try {
                this.newItem.updatedAt = firebase.firestore.Timestamp.fromDate(new Date())
                this.newItem.slug = sluglify(this.newItem.title);
                
                const response = await this.$firebaseRefs.posts.child(this.$route.params.id).set(this.newItem);
                
                console.log(response)

                notification.info('Post updated!')

                this.loading = false;
            } catch (error) {
                notification.error(error.message)
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
