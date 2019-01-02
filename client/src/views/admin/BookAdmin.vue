<template>
  <v-container>
    <v-toolbar color="white" class="elevation-1 costume-toolbar">
      <v-toolbar-title>Books</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn round color="info" @click="dialog = true">
        Add New
        <v-icon right>mdi-plus-circle</v-icon>
      </v-btn>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :loading="loading"
      :items="items.data"
      :pagination.sync="pagination"
      :rows-per-page-items="pagination.rowsPerPageItems"
      :total-items="pagination.totalItems"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.author }}</td>
        <td>{{ props.item.publisher }}</td>
        <td class="text-xs-center">
          <v-layout justify-center>
            <v-tooltip bottom>
              <v-btn
                icon
                outline
                color="green darken-3"
                slot="activator"
                @click="viewBook(props.item)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <span>View</span>
            </v-tooltip>

            <v-tooltip bottom>
              <v-btn
                icon
                outline
                color="primary"
                slot="activator"
                @click="editBook(props.item)"
              >
                <v-icon>mdi-circle-edit-outline</v-icon>
              </v-btn>
              <span>Edit</span>
            </v-tooltip>

            <v-tooltip bottom>
              <v-btn
                icon
                outline
                color="error"
                slot="activator"
                @click="deleteConfirm(props.item._id)"
              >
                <v-icon>mdi-delete-circle</v-icon>
              </v-btn>
              <span>Delete</span>
            </v-tooltip>
          </v-layout>
        </td>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination
        circle
        :length="pages"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        v-model="pagination.page"
      ></v-pagination>
    </div>

    <v-dialog
      persistent
      transition="slide-y-reverse-transition" 
      v-model="dialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <h3 class="title">{{ modalTitle }}</h3>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                label="Book Name"
                v-model="book.name"
                v-validate="'required'"
                data-vv-name="name"
                :error-messages="errors.collect('name')"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Author"
                v-model="book.author"
                v-validate="'required'"
                data-vv-name="author"
                :error-messages="errors.collect('author')"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Publisher"
                v-model="book.publisher"
                v-validate="'required'"
                data-vv-name="publisher"
                :error-messages="errors.collect('publisher')"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="Total Pages"
                v-model.number="book.page"
                v-validate="'required|numeric'"
                data-vv-name="page"
                :error-messages="errors.collect('page')"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                label="ISBN"
                v-model="book.isbn"
                v-validate="'required'"
                data-vv-name="isbn"
                :error-messages="errors.collect('isbn')"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            flat
            color="info"
            @click="validateForm()"
          >{{ modalBtnSave }}</v-btn>
          <v-btn
            flat
            @click="reset('noDelete')"
          >Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      persistent
      transition="slide-y-reverse-transition"
      v-model="dialogShow"
      max-width="500px"
    >
      <v-card>
        <v-card-title title>
          <h3>{{ book.name }}</h3>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <strong>Name of Book</strong>
          <p>{{ book.name }}</p>

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

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            flat
            @click="reset('noDelete')"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      persistent
      transition="slide-y-reverse-transition"
      v-model="dialogConfirm"
      max-width="300px"
    >
      <v-card>
        <v-card-title title>
          <h3>Delete Confirm</h3>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          Do You want to delete this book?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            flat
            color="info"
            @click="deleteProcess()"
          >Yes</v-btn>
          <v-btn
            flat
            @click="reset('delete')"
          >No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      top
      right
      :color="color"
      :timeout="2000"
      v-model="snackbar"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.costume-toolbar {
  border-top: 5px solid #2196f3 !important;
  border-radius: 10px 10px 0 0;
}
</style>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import io from 'socket.io-client';
import moment from 'moment';

@Component({
  metaInfo: {
    title: 'List of Books',
  },

  $_veeValidate: {
    validator: 'new',
  },

  filters: {
    moment: (date: any) => moment(date).format('LL'),
  },
})

export default class BookAdmin extends Vue {
  private socket = io.connect('http://localhost:8081');
  private bookId = '';
  private color = '';
  private snackbarText = '';
  private snackbar = false;
  private loading = false;
  private isEdit = false;
  private dialog = false;
  private dialogShow = false;
  private dialogConfirm = false;
  private book = {} as any;
  private pagination = {} as any;
  private items = [] as any;
  private headers = [
    {
      text: 'Name',
      value: 'name',
      width: '25%',
      sortable: false,
    },
    {
      text: 'Author',
      value: 'author',
      width: '25%',
      sortable: false,
    },
    {
      text: 'Publisher',
      value: 'publisher',
      width: '25%',
      sortable: false,
    },
    {
      text: 'Actions',
      width: '25%',
      align: 'center',
      sortable: false,
    },
  ];
  private dictionary = {
    custom: {
      name: {
        required: 'Book name can not be empty',
      },
      author: {
        required: 'Author can not be empty',
      },
      publisher: {
        required: 'Publisher can not be empty',
      },
      page: {
        required: 'Total page can not be empty',
        numeric: 'Only numeric characters',
      },
      isbn: {
        required: 'ISBN can not be empty',
      },
    },
  };

  @Watch('pagination.page')
  private onPaginationChanged() {
    this.loading = true;
    this.axios.get(`book?page=${this.pagination.page}`)
      .then((res) => {
        this.items = res.data;
        this.pagination.rowsPerPage = this.items.meta.perPage;
        this.pagination.totalItems = this.items.meta.total;
        this.loading = false;
      })
      .catch((err) => {
        // console.log(err);
      });
  }

  private get pages() {
    if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) {
      return 0;
    }

    return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
  }

  private get modalTitle() {
    return this.isEdit ? 'Edit Book' : 'Add New Book';
  }

  private get modalBtnSave() {
    return this.isEdit ? 'Update' : 'Save';
  }

  private mounted() {
    this.fetchBooks();
    this.$validator.localize('en', this.dictionary);
    this.socket.on('fetch-book', () => {
      this.fetchBooks();
    });
  }

  private viewBook(item: any) {
    this.book = Object.assign({}, item);
    this.dialogShow = true;
  }

  private fetchBooks() {
    this.axios.get('book')
      .then((res) => {
        this.items = res.data;
        this.pagination.rowsPerPage = this.items.meta.perPage;
        this.pagination.totalItems = this.items.meta.total;
        // console.log(res.data);
      })
      .catch((err) => {
        // console.log(err);
      });
  }

  private validateForm() {
    this.$validator.validateAll()
      .then((result) => {
        if (!result) {
          return;
        }

        this.saveProcess();
      });
  }

  private async saveProcess() {
    const book = this.book;

    const isIsbnAvailable = await this.axios.post('book/checkIsbn', { isbn: book.isbn });

    if (!isIsbnAvailable.data.success) {
      this.color = 'error';
      this.snackbarText = 'ISBN cannot be used';
      this.snackbar = true;

      return false;
    }

    if (!this.isEdit) {
      this.axios.post('book', book)
        .then((res) => {
          // console.log(res.data);
          this.reset('noDelete');
          this.socket.emit('fetch-book');
        })
        .catch((err) => {
          // console.log(err);
        });
    } else {
      this.axios.post('book/update', book)
        .then((res) => {
          // console.log(res.data);
          this.reset('noDelete');
          this.socket.emit('fetch-book');
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  }

  private deleteProcess() {
    const id = this.bookId;

    this.axios.post('book/delete', { id })
      .then((res) => {
        this.socket.emit('fetch-book');
        this.reset('delete');
      })
      .catch((err) => {
        // console.log(err);
      });
  }

  private deleteConfirm(id: string) {
    this.dialogConfirm = true;
    this.bookId = id;
  }

  private editBook(item: any) {
    this.isEdit = true;
    this.dialog = true;
    this.bookId = item._id;
    this.book = Object.assign({}, item);
  }

  private reset(status: string) {
    if (status === 'noDelete') {
      this.dialog = false;
      this.dialogShow = false;
      this.bookId = '';

      setTimeout(() => {
        this.book = {};
        this.isEdit = false;
        this.$validator.reset();
      }, 500);
    } else {
      this.dialogConfirm = false;
      this.bookId = '';
    }
  }
}
</script>
