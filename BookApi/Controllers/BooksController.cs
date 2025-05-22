using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private static List<Book> books = new List<Book>();
    private static int nextId = 1;

    [HttpGet]
    public ActionResult<List<Book>> GetBooks() => books;

    [HttpGet("{id}")]
    public ActionResult<Book> GetBook(int id)
    {
        var book = books.FirstOrDefault(b => b.Id == id);
        if (book == null) return NotFound();
        return book;
    }

    [HttpPost]
    public ActionResult<Book> CreateBook(Book book)
    {
        book.Id = nextId++;
        books.Add(book);
        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateBook(int id, Book updatedBook)
    {
        var book = books.FirstOrDefault(b => b.Id == id);
        if (book == null) return NotFound();

        book.Title = updatedBook.Title;
        book.Author = updatedBook.Author;
        book.ISBN = updatedBook.ISBN;
        book.PublicationDate = updatedBook.PublicationDate;

        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteBook(int id)
    {
        var book = books.FirstOrDefault(b => b.Id == id);
        if (book == null) return NotFound();

        books.Remove(book);
        return NoContent();
    }
}
