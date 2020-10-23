<template>
  <div class="article-comments">
    <form class="card comment-form" @submit.prevent="postComment">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="myComment"
          required
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="$store.state.user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" :disabled="postCommentDisabled">
          Post Comment
        </button>
      </div>
    </form>

    <div v-for="comment in comments" :key="comment.id" class="card">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link 
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }" 
          class="comment-author"
        >
          <img
            :src="comment.author.image"
            class="comment-author-img"
          />
        </nuxt-link>
        &nbsp;
        <nuxt-link 
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }" 
          class="comment-author"
        >{{ comment.author.username }}</nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
        <span 
          class="mod-options" 
          v-if="comment.author.username === $store.state.user.username"
          @click="deleteMyComment(comment.id)"
        >
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from '@/api/article'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      comments: [],
      myComment: '',
      postCommentDisabled: false
    }
  },
  created () {
    this.getCommentsList()
  },
  methods: {
    async postComment () {
      this.postCommentDisabled = true
      await addComment({
        comment: {
          body: this.myComment
        }
      }, this.article.slug)
      this.myComment = ''
      this.getCommentsList()
      this.postCommentDisabled = false
    },
    async getCommentsList () {
      const { data } = await getComments(this.article.slug)
      this.comments = data.comments
    },
    async deleteMyComment (id) {
      await deleteComment(this.article.slug, id)
      this.getCommentsList()
    }
  }
};
</script>

<style></style>
