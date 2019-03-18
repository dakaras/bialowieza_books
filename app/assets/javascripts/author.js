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

      <p> ${book.title}</p>
      <a href="/books/${this.id}" class="show_book">View Book</a>
      `)
  }).join("")
  return(`
    <h3>Published Books by <a href="/authors/${this.id}" class="show_author">${this.name}</a>: ${this.books.length}</h3>
    <p>${authorBooks}</p>
    `
  )

}

function listenForAuthors(){
  $('#load_authors').on('click', event => {
    event.preventDefault()
    history.pushState(null, null, "authors")
    getAuthors()
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
    })
  })
}
