// use $(document).ready() to load the page before loading the annon. function
$(function(){
  console.log('author.js loaded..')
  listenForAuthors()
  // displayBook()
  // listenForNewBookForm()
})

class Author {
  constructor(obj){
    this.id = obj.id
    this.name = obj.name
    this.books = obj.books
  }


}
Author.prototype.newBookForm = function() {
    return `
      <p>Provide this author's book title and genre of the book that you want ordered.</p>
      <form class='new_form' action="/authors/${this.id}/books" data-id="${this.id}"
        Title: <input type='text' id='book_title' name='title' placeholder="Request Book Title">
        Genre: <input type='text' id=''book_genre' name='genre' placeholder="Mystery, Biography">
        <p><font color="red">All Requested Custom Orders are: $30</font></p>
        <input type='hidden' id='author' name='author' data-id="${this.id}" value=${this.id}>
        <input type='hidden' id='book_price' name='price' value='30'>
        <input type="submit" value="Submit Form">
      </form>
`}

Author.prototype.authorTemplate = function() {
  let authorBooks = this.books.map(book => {
    return (`
      <div id='display_form'>
      </div>
      <p> ${book.title}</p>
      <a href="/books/${book.id}" data-id="${book.id}" class="show_book">View Book</a>
      <div class="display_book"></div>
      `)
  }).join("") //.join("") removes commas from each author's array of books
  return(`
    <h3>Published Books by ${this.name}: ${this.books.length}</h3>
    <a href="/authors/${this.id}/books/new" class="new_book_form" data-id="${this.id}">Request a Book to be Ordered</a>
    <p>${authorBooks}</p>
    `
  )

}
 clearForm = () => {
  $('#book_title').val("")
  $('#book_genre').val("")
}

function listenForNewBookForm(){
  $(document).on('click', "a.new_book_form", function(event){
    event.preventDefault()
    let newBookForm = Author.newBookForm()
    $("a.new_book_form").remove()
    $("#display_form").append(newBookForm)
    listenForSubmit()
  })
}

function listenForSubmit(){
  $('.new_form').on('submit', function(event){
    event.preventDefault()  // avoids actual submission of the form.
    let url = $(this).attr("action")
    let id = $(this).data('id')
    let author_id = ($(this).attr("data-id"))
    debugger

    $.ajax({
           type: "POST",
           url: url,
           data: $(this).serialize(), // serializes the form's elements.
           success: function(data) {
            clearForm()
            $("div#display_book").val("")
            let $div = $("div#display_book")
            $div.append(data)
           }
         });
  })
}

function displayBook(){
  $(document).on("click", ".show_book", function(event) {
    event.preventDefault()
    let id = ($(this).attr("data-id"))
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
    })
  })
}
