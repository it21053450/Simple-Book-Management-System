import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from './book.service';
import { Book } from './book';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  template: `
    <!-- Background Elements -->
    <div class="background-wrapper">
      <div class="floating-books">
        <div class="book book1"></div>
        <div class="book book2"></div>
        <div class="book book3"></div>
        <div class="book book4"></div>
        <div class="book book5"></div>
      </div>
      <div class="overlay"></div>
    </div>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="bi bi-book"></i> Book Management System
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container mt-4 content-wrapper">
      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card stats-card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Total Books</h6>
                  <h2 class="mb-0">{{books.length}}</h2>
                </div>
                <i class="bi bi-book fs-1"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card stats-card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Available Books</h6>
                  <h2 class="mb-0">{{books.length}}</h2>
                </div>
                <i class="bi bi-check-circle fs-1"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card stats-card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-title">Authors</h6>
                  <h2 class="mb-0">{{getUniqueAuthors()}}</h2>
                </div>
                <i class="bi bi-person fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Book Form -->
      <div class="card mb-4 glass-card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="bi bi-pencil-square"></i> 
            {{isEditing ? 'Edit Book' : 'Add New Book'}}
          </h5>
        </div>
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #bookForm="ngForm">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="title" class="form-label">Title</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-book"></i></span>
                  <input type="text" class="form-control" id="title" name="title" [(ngModel)]="newBook.title" required>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="author" class="form-label">Author</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input type="text" class="form-control" id="author" name="author" [(ngModel)]="newBook.author" required>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="isbn" class="form-label">ISBN</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-upc"></i></span>
                  <input type="text" class="form-control" id="isbn" name="isbn" [(ngModel)]="newBook.isbn" required>
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="publicationDate" class="form-label">Publication Date</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-calendar"></i></span>
                  <input type="date" class="form-control" id="publicationDate" name="publicationDate" [(ngModel)]="newBook.publicationDate" required>
                </div>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" [disabled]="!bookForm.form.valid">
                <i class="bi" [class.bi-plus-circle]="!isEditing" [class.bi-check-circle]="isEditing"></i>
                {{isEditing ? 'Update Book' : 'Add Book'}}
              </button>
              <button type="button" class="btn btn-secondary" *ngIf="isEditing" (click)="cancelEdit()">
                <i class="bi bi-x-circle"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Books List -->
      <div class="card glass-card">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="bi bi-list-ul"></i> Book Collection
          </h5>
        </div>
        <div class="card-body">
          <div *ngIf="books.length === 0" class="alert alert-info">
            <i class="bi bi-info-circle"></i> No books available. Add some books to get started!
          </div>
          <div *ngIf="books.length > 0" class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Publication Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let book of books">
                  <td>{{book.title}}</td>
                  <td>{{book.author}}</td>
                  <td><span class="badge bg-primary">{{book.isbn}}</span></td>
                  <td>{{book.publicationDate | date}}</td>
                  <td>
                    <div class="btn-group">
                      <button class="btn btn-sm btn-outline-primary" (click)="editBook(book)">
                        <i class="bi bi-pencil"></i> Edit
                      </button>
                      <button class="btn btn-sm btn-outline-danger" (click)="deleteBook(book.id)">
                        <i class="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      position: relative;
    }

    .background-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80') center/cover no-repeat;
      z-index: -2;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: -1;
    }

    .floating-books {
      position: fixed;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    }

    .book {
      position: absolute;
      width: 60px;
      height: 80px;
      background-size: cover;
      opacity: 0.6;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
    }

    

    @keyframes float {
      0% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(5deg);
      }
      100% {
        transform: translateY(0) rotate(0deg);
      }
    }

    .content-wrapper {
      position: relative;
      z-index: 1;
    }

    .navbar {
      background: rgba(0, 0, 0, 0.2) !important;
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }

    .stats-card {
      background: rgba(255, 255, 255, 0.1) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: transform 0.3s ease;
    }

    .stats-card:hover {
      transform: translateY(-5px);
    }

    .card {
      height: 100%;
      transition: all 0.3s ease;
    }

    .hover-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }

    .btn-outline-primary:hover {
      background-color: #0d6efd;
      color: white;
    }

    .btn-outline-danger:hover {
      background-color: #dc3545;
      color: white;
    }

    .card-header {
      background: rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    .input-group-text {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .form-control {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .form-control:focus {
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
    }

    .badge {
      font-size: 0.8rem;
      background: rgba(13, 110, 253, 0.9);
    }

    .alert {
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Add responsive adjustments */
    @media (max-width: 768px) {
      .book {
        width: 40px;
        height: 60px;
      }
    }

    .table {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      overflow: hidden;
    }

    .table thead th {
      background: rgba(0, 0, 0, 0.1);
      border-bottom: 2px solid rgba(0, 0, 0, 0.1);
      color: #333;
      font-weight: 600;
      padding: 1rem;
    }

    .table tbody td {
      padding: 1rem;
      vertical-align: middle;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .table tbody tr:hover {
      background: rgba(0, 0, 0, 0.02);
    }

    .table .badge {
      font-size: 0.8rem;
      padding: 0.5em 0.8em;
    }

    .table .btn-group {
      display: flex;
      gap: 0.5rem;
    }

    .table .btn-group .btn {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .table-responsive {
        margin: 0 -1rem;
      }
      
      .table thead {
        display: none;
      }

      .table tbody tr {
        display: block;
        margin-bottom: 1rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.95);
      }

      .table tbody td {
        display: block;
        text-align: right;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }

      .table tbody td:before {
        content: attr(data-label);
        float: left;
        font-weight: 600;
        color: #666;
      }

      .table tbody td:last-child {
        border-bottom: none;
      }

      .table .btn-group {
        justify-content: flex-end;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  books: Book[] = [];
  newBook: Book = {
    id: 0,
    title: '',
    author: '',
    isbn: '',
    publicationDate: new Date().toISOString().split('T')[0]
  };
  isEditing = false;

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
  }

  getUniqueAuthors(): number {
    return new Set(this.books.map(book => book.author)).size;
  }

  onSubmit() {
    if (this.isEditing) {
      this.bookService.updateBook(this.newBook).subscribe({
        next: () => {
          const index = this.books.findIndex(b => b.id === this.newBook.id);
          if (index !== -1) {
            this.books[index] = { ...this.newBook };
          }
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating book:', error);
        }
      });
    } else {
      this.bookService.addBook(this.newBook).subscribe({
        next: (book) => {
          this.books.push(book);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding book:', error);
        }
      });
    }
  }

  editBook(book: Book) {
    this.isEditing = true;
    this.newBook = { ...book };
  }

  deleteBook(id: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter(book => book.id !== id);
        },
        error: (error) => {
          console.error('Error deleting book:', error);
        }
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.resetForm();
  }

  private resetForm() {
    this.isEditing = false;
    this.newBook = {
      id: 0,
      title: '',
      author: '',
      isbn: '',
      publicationDate: new Date().toISOString().split('T')[0]
    };
  }
}
