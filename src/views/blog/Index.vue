<template>
  <div class="posts">
    <Hero title="Blog" subtitle="Create and read Posts"/>
    <div class="container" style="margin-top:50px;">
      <div class="columns">
          <div class="column"></div>
          <div class="column">
              <h2>Last entries</h2>
              <hr>
              <div v-if="posts.length == 0">No entries yet</div>
                <div v-else class="card" v-for="item in posts" :key="item['.key']" style="margin-bottom: 10px;">
                    <div class="card-content">
                        <div class="content">
                        <p class="card-header-title has-text-white">
                            {{item.title}}
                        </p>
                        Created <time>{{ item.createdAt | formatDate }} <br> <span class="has-text-primary">by {{ item.author || "Anonymous" }}</span> </time>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <router-link :to="{ name: 'postDetails', params: {id: item['.key']} }" class="card-footer-item" type="button">More</router-link>
                        <template v-if="user && user.uid === item.owner">
                            <router-link :to="{ name: 'editPost', params: {id: item['.key']} }" class="card-footer-item" type="button">Edit</router-link>
                            <a href="javascript:void(0);" class="card-footer-item" @click="deleteItem(item['.key'])">Delete</a>
                        </template>
                    </footer>
                </div>
          </div>
          <div class="column"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {toastme} from 'toastmejs'
import utils from '@/libs/formaters'
import { mapGetters, mapActions } from 'vuex'
import notification from '@/libs/notifications'
import {database, firebase } from '@/config/firebase.config'

export default {
    name: 'Blog',
    data() {
        return {
            loading: false
        }
    },
    firebase: {
        posts: database.ref().child('posts')
    },
    filters: {
        formatDate(val) {
            return utils.formatFirebaseDate(val.seconds);
        }
    },
    computed: {
        ...mapGetters('auth', ['user'])
    },
    methods: {
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
                        _this.$firebaseRefs.posts.child(key).remove();
                        notification.warning('Post deleted!');
                        _this.loading = false;
                    } catch (error) {
                        notification.error(error.message);
                        _this.loading = false;
                    }
                }
            });
        }
    }
}
</script>