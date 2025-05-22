/*import { Component } from '@angular/core';

@Component({
  selector: 'app-book-form',
  imports: [],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent {

}*/

import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from '../book';
import { Router } from '@angular/router';
//import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { BookService } from '../book.service';
//import { Book } from '../book';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html'
})
export class BookFormComponent implements OnInit {
  book: Book = { title: '', author: '', isbn: '', publicationDate: '' };
  isEdit = false;

  constructor(private bookService: BookService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.bookService.getBook(+id).subscribe(b => this.book = b);
    }
  }

  saveBook() {
    if (this.isEdit) {
      this.bookService.updateBook(this.book).subscribe(() => this.router.navigate(['/']));
    } else {
      this.bookService.addBook(this.book).subscribe(() => this.router.navigate(['/']));
    }
  }
}

