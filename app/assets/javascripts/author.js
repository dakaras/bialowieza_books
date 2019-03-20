// use $(document).ready() to load the page before loading the annon. function
$(function(){
  console.log('author.js loaded..')
  listenForAuthors()
  displayBook()
  listenForNewBookForm()
})

class Author {
  constructor(obj){
    this.id = obj.id
    this.name = obj.name
    this.books = obj.books
  }
  static newBookForm(){
    return (`
      <p>Request a new book by ${this.name}</p>
        <form action="/authors/${this.id}/books/new" method='post'>
        Title: <input type='text' id='book_title' name='title' placeholder="Request Book Title">
        Genre: <input type='text' id=''book_genre' name='genre' placeholder="Mystery, Biography">
        <p>All Requested Custom Orders are: $30</p>
        <input type='hidden' id='book_price' name='price' value='30'>
        <input type="submit" value="Submit Form">
      </form>
      `)
  }
}

Author.prototype.authorTemplate = function() {
  let authorBooks = this.books.map(book => {
    return (`
      <p> ${book.title}</p>
      <a href="/books/${book.id}" data-id="${book.id}" class="show_book">View Book</a>
      <div class="display_book"></div>
      `)
  }).join("") //.join("") removes commas from each author's array of books
  return(`
    <h3>Published Books by ${this.name}: ${this.books.length}</h3>
    <a href="/authors/${this.id}/books/new" class="new_book_form">Request a Book to be Ordered</a>
    <p>${authorBooks}</p>
    `
  )

}

function listenForNewBookForm(){
  $("a.new_book_form").on('click', function(event){
    event.preventDefault()
    let newBookForm = Author.new_book_form()
    
  })
}


function displayBook(){
  $(document).on("click", ".show_book", function(event) {
    event.preventDefault()
    let id = ($(this).attr("data-id"))
    debugger
    fetch(`/books/${id}.json`)
    .then(res => res.json())
    .then(book => {
      $("#display_book").html("")
      book = new Book(book)
      let bookHtml = book.bookShowTemplate()
      $("#display_book").append(bookHtml)
      nextBook()
      prevBook()
    })
    .catch(err => console.log(err))
  })
}

function listenForAuthors(){
  $('#load_authors').on('click', event => {
    event.preventDefault()
    history.pushState(null, null, "authors")
    getAuthors()
    $('#load_authors').remove()
  })
}

function getAuthors(){
  //this .ajax block is the same as url.json
  $.ajax({
    url: this.href,
    method: 'get',
    dataType: 'json'
  }).done(response => {
    response.forEach(author => {
      const newAuthor = new Author(author)
      let newAuthorTemplate = ""
      newAuthorTemplate += newAuthor.authorTemplate()
      // append to the DOM
      document.querySelector('div#authors_info').innerHTML += newAuthorTemplate
      listenForNewBookForm()
      debugger
    })
  })
}
