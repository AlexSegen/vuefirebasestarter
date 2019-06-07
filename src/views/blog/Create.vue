<template>
  <div class="createPost">
    <Hero title="New post" subtitle="Create new Posts"/>
    <div class="container" style="margin-top:50px;">
      <div class="columns">
          <div class="column"></div>
          <div class="column">
              <h2>Add new Post</h2>
              <hr>
              <div class="card">
                  <div class="card-content">
                        <div class="field">
                            <label class="label">Title</label>
                            <div class="control">
                                <input class="input" type="text" placeholder="Post title" v-model="newItem.title">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Content</label>
                            <div class="control">
                                <editor api-key="k23wuss5ytfddyd77xj28bq76u9tt9u2ehwj7hbldi0xuerd" :init="{plugins: 'wordcount'}" v-model="newItem.content"></editor>

                                <!-- <textarea class="textarea" type="text" placeholder="Post content" v-model="newItem.content"></textarea> -->
                            </div>
                        </div>
                        <div class="field">
                            <button type="button" @click="addItem" class="button is-primary" :disabled="!validFields">Save post</button>
                        </div>
                  </div>
              </div>
          </div>
          <div class="column">
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import {sluglify} from '@/libs/sluglify'
import { mapGetters, mapActions } from 'vuex'
import notification from '@/libs/notifications'
import {database, firebase, auth} from '@/config/firebase.config'

const currentUser = auth.currentUser;

export default {
    name: 'newPost',
    data() {
        return {
            loading: false,
            newItem: {
                title: '',
                content: ""
            }
        }
    },
    firebase: {
        posts: database.ref().child(`posts`)
    },
    computed:{
        ...mapGetters('auth', ['user']),
        validFields(){
            return this.newItem.title.trim().length > 0 && this.newItem.content.trim().length > 0
        }
    },
    methods: {
        async addItem() {
            this.loading = true;
            try {
                let response = await this.$firebaseRefs.posts.push({
                    title: this.newItem.title,
                    slug: sluglify(this.newItem.title),
                    content: this.newItem.content,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
                    owner: this.user.uid,
                    author: this.user.displayName || "Anonymous",
                    updatedAt: null
                })

                console.log(response);
                this.newItem.title = '';
                this.newItem.content = '';
                this.loading = false;
                notification.success('New post added!');
            } catch (error) {
                notification.error(error.message);
                this.loading = false;
            }
        }
    }
}
</script>