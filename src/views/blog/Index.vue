<template>
  <div class="posts">
    <Hero title="Blog" subtitle="Create and read Posts" />
    <div class="container" style="margin-top:50px;">
      <div class="columns">
        <div class="column">
          <h2>Last entries</h2>
          <hr />
          <div v-if="posts.length == 0">No entries yet</div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-one-quarter" v-for="item in posts" :key="item['.key']">
          <div class="card" style="margin-bottom: 10px;">
            <div class="card-content">
              <p class="card-header-title has-text-white">{{item.title}}</p>Created
              <time>
                {{ item.createdAt | formatDate }}
                <br />
                <span class="has-text-primary">by {{ item.author || "Anonymous" }}</span>
              </time>
            </div>
            <footer class="card-footer">
              <router-link
                :to="{ name: 'postDetails', params: {id: item['.key'], slug: item.slug} }"
                class="card-footer-item"
                type="button"
              >More</router-link>
              <template v-if="user && user.uid === item.owner">
                <router-link
                  :to="{ name: 'editPost', params: {id: item['.key']} }"
                  class="card-footer-item"
                  type="button"
                >Edit</router-link>
                <a
                  href="javascript:void(0);"
                  class="card-footer-item"
                  @click="deleteItem(item['.key'])"
                >Delete</a>
              </template>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { toastme } from "toastmejs";
import utils from "@/libs/formaters";
import { mapGetters, mapActions } from "vuex";
import notification from "@/libs/notifications";
import { database, firebase } from "@/config/firebase.config";

export default {
  name: "Blog",
  data() {
    return {
      loading: false
    };
  },
  firebase: {
    posts: database.ref().child("posts")
  },
  filters: {
    formatDate(val) {
      return utils.formatFirebaseDate(val.seconds);
    }
  },
  computed: {
    ...mapGetters("auth", ["user"])
  },
  methods: {
    deleteItem(key) {
      var _this = this;
      toastme
        .yesNoDialog({
          title: "Hey!",
          text: "Do you want to delete this item?",
          textConfirm: "Confirm",
          textCancel: "Cancel",
          showCancel: true,
          type: "warning",
          dark: true
        })
        .then(function(value) {
          if (value) {
            _this.loading = true;
            _this.$firebaseRefs.posts
              .child(key)
              .remove()
              .then(() => {
                notification.warning("Post deleted!");
              })
              .catch(error => {
                if (error.message == "PERMISSION_DENIED: Permission denied")
                  return notification.error(
                    "You are not authorized to delete this Post."
                  );
                notification.error(error.message);
              })
              .finally(() => {
                _this.loading = false;
              });
          }
        });
    }
  }
};
</script>