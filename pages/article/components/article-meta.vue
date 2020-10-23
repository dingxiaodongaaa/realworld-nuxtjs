<template>
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
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>

    <template v-if="article.author.username != $store.state.user.username">
      <button
        class="btn btn-sm btn-outline-secondary"
        @click="onFollow"
        :disabled="isFollowDisabled"
      >
        <i class="ion-plus-round"></i>
        &nbsp; {{ isFollow ? 'un' : '' }}Follow {{ article.author.username }}
        <span class="counter"></span>
      </button>
      &nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited,
        }"
        @click="onFavorite"
        :disabled="favoriteDisabled"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>

    <template v-else>
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'editor',
          params: {
            slug: article.slug
          }
        }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>

      <button
        class="btn btn-outline-danger btn-sm"
        @click="delArticle"
        :disabled="delArticleDisabled"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import { 
  deleteArticle,
  follow,
  unfollow,
  addFavorite,
  deleteFavorite
} from "@/api/article"

export default {
  props: ["article"],
  data () {
    return {
      isFollow: false,
      isFollowDisabled: false,
      favoriteDisabled: false,
      delArticleDisabled: false
    }
  },
  created () {
    this.isFollow = this.article.author.following
  },
  methods: {
    async delArticle () {
      this.delArticleDisabled = true
      await deleteArticle(this.article.slug)
      this.$router.push('/')
    },
    async onFollow () {
      this.isFollowDisabled = true
      this.isFollow 
      ? await unfollow (this.article.author.username)
      : await follow (this.article.author.username)
      this.isFollow = !this.isFollow
      this.isFollowDisabled = false
    },
    async onFavorite () {
      const article = this.article
      this.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount --
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount ++
      }
      this.favoriteDisabled = false
    }
  }
};
</script>

<style></style>
