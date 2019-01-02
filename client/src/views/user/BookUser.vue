<template>
  <v-container>
    <v-expansion-panel popout>
      <v-expansion-panel-content
        v-for="(book, index) in books.data"
        :key="index"
      >
        <div slot="header">{{ book.name }}</div>
        <v-card>
          <v-card-text>
            <strong>Author</strong>
            <p>{{ book.author }}</p>

            <strong>Publisher</strong>
            <p>{{ book.publisher }}</p>

            <strong>Total Pages</strong>
            <p>{{ book.page }}</p>

            <strong>ISBN</strong>
            <p>{{ book.isbn }}</p>

            <strong>Release</strong>
            <p>{{ book.date | moment }}</p>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-layout justify-center>
      <v-btn
        color="green darken-3 white--text"
        @click="fetchBooks(nextPage)"
        v-if="nextPage"
      >Load More</v-btn>
    </v-layout>

    <Loading v-if="isLoading" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Loading from '@/components/Loading.vue';
import moment from 'moment';

@Component({
  metaInfo: {
    title: 'List of Books',
  },

  filters: {
    moment: (date: any) => moment(date).format('LL'),
  },

  components: {
    Loading,
  },
})

export default class BookUser extends Vue {
  private books = {} as any;
  private nextPage = '';
  private isLoading = false;

  private mounted() {
    this.fetchBooks();
  }

  private fetchBooks(url?: string) {
    this.isLoading = true;

    this.axios.get(url ? url : 'book')
      .then((res) => {
        if (!this.books.data) {
          this.books = res.data;
          this.nextPage = res.data.links.next;
          this.isLoading = false;
        } else {
          this.books.data.push(...res.data.data);
          this.nextPage = res.data.links.next;
          this.isLoading = false;
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  }
}
</script>
