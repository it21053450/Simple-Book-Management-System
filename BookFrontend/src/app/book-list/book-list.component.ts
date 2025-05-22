/*import { Component } from '@angular/core';

@Component({
  selector: 'app-book-list',
  imports: [],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {

}*/

import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from '../book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(data => this.books = data);
  }

  deleteBook(id: number) {
    this.bookService.deleteBook(id).subscribe(() => this.loadBooks());
  }

  editBook(id: number) {
    this.router.navigate(['/edit', id]);
  }
}

