// use $(document).ready() to load the page before loading the annon. function
$(function(){
  console.log('author.js loaded..')
  listenForAuthors()
})

class Author {
  constructor(obj){
    this.id = obj.id
    this.name = obj.name
    this.books = obj.books
  }
}

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
  return (`
    <h3>Published Books by ${this.name}: ${this.books.length}</h3>
    <a href="/authors/${this.id}/books/new" class="new_book_form" data-id="${this.id}">Request a Book to be Ordered</a>
    <p>${authorBooks}</p>
    `
  )}


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
