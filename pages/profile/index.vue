<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="user.image" class="user-img" />
            <h4>{{ user.username }}</h4>
            <p>
              {{ user.bio }}
            </p>
            <nuxt-link
              class="btn btn-sm btn-outline-secondary action-btn"
              :to="{
                name: 'settings',
              }"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{
                    active: isActive,
                  }"
                  @click.prevent="loadArticles(true)"
                  >My Articles</a
                >
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{
                    active: !isActive,
                  }"
                  @click.prevent="loadArticles(false)"
                  >Favorited Articles</a
                >
              </li>
            </ul>
          </div>
          <div class="article-preview" v-show="isLoading">
            Loading articles...
          </div>
          <div class="article-preview" v-show="!isLoading && articles.length === 0">
            No articles are here... yet.
          </div>
          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
            v-show="!isLoading"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{
                  article.updatedAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited,
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                  :key="tag"
                >
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles, addFavorite, deleteFavorite } from "@/api/article";
import { getProfile } from "@/api/user";

export default {
  middleware: ["authenticated"],
  name: "UserProfile",
  data() {
    return {
      user: {},
      isActive: true,
      articles: [],
      isLoading: true
    };
  },
  async created() {
    const { data } = await getProfile(this.$route.params.username);
    this.user = data.profile;
    this.loadArticles(true);
  },
  watch: {
    async $route (to, from) {
      const { data } = await getProfile(this.$route.params.username);
      this.user = data.profile;
      this.loadArticles(true);
    },
  },
  methods: {
    async loadArticles(isMyArticle) {
      this.isLoading = true
      this.isActive = isMyArticle;
      const params = isMyArticle
        ? { author: this.user.username }
        : { favorited: this.user.username };
      const { data } = await getArticles(params);
      this.isLoading = false
      this.articles = data.articles;
      this.articles.forEach((article) => (article.favoriteDisabled = false));
    },
    async onFavorite(article) {
      article.favoriteDisabled = true;
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount--;
        if (!this.isActive) {
          for (var i = 0; i < this.articles.length; i++) {
            if (this.articles[i] == article) {
              this.articles.splice(i, 1); //删除下标为i的元素
            }
          }
        }
      } else {
        // 添加点赞
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount++;
      }
      article.favoriteDisabled = false;
    },
  },
};
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
</style>
