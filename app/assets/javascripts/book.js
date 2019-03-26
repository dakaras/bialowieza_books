// $(document).ready()
$(function(){
  console.log('book.js loaded..')
  listenForIndex()
  listenForSubmit()
})

//turn JSON data into strings for the attributes by creating a Book object
class Book {
  constructor(obj){
    this.id = obj.id
    this.author_id = obj.author_id
    this.title = obj.title
    this.author = obj.author
    this.genre = obj.genre
    this.price = obj.price
    this.summary = obj.summary
    this.order_items = obj.order_items
    this.carts = obj.carts
  }
}

//Creates HTML framework to display Book index page when getBooks() is called
Book.prototype.bookInfoTemplate = function(){
  return (`
    <img src="https://www.ioba.org/pages/wp-content/uploads/2011/12/alledgesgilt.jpg" alt= ${this.title} width="400" height="400" %><br><br>
    Title: <a href= "/books/${this.id}" data-id="${this.id}" data-author-id='${this.author.id}' class="show_book">${this.title}</a>
    <p> Author: ${this.author.name}</p>
    <p> Price: $${this.price} </p>
    <form>
      <input type="hidden" id="book_id" name="book_id" value="book.id">
      <input type="number" value="1" name="order_item[quantity]" id="order_item_quantity">
      <input type="submit" name="commit" value="Add to Cart" data-disable-with="Add to Cart"><br><br>
    </form>
    `)
}
// formats how book details will look like in DOM Book Show page
Book.prototype.bookShowTemplate = function(){
   return (`

    <button data-author-id='${this.author.id}' class='load_form'>Request a Book Order by ${this.author.name}</button><br><br>
    <a href='/authors/${this.author.id}/books/new' data-author-id='${this.author.id}'

    <div id='display_form'>
    </div>

    <p>Title: ${this.title} </p>
    <p> Author: ${this.author.name} </p>

    <p> Genre: ${this.genre} </p>
    <p> Price: $${this.price} </p>
    <p> Summary: ${this.summary} </p>
    <button class="prev_book" data-id="${this.id-1}">Prev Book</button><br><br>
    <button class="next_book" data-id="${this.id}">Next Book</button><br><br>
  `)}

//Listens when 'Expand All Book Details' button is clicked
function listenForIndex(){
  $('#load_books').on('click', event => {
    event.preventDefault()
    history.pushState(null, null, "books") //updates url with /books resource
    getBooks()
    $('#load_books').remove() //expand book details button disappears
  })
}

//Displays all books when listenForIndex() is triggered
function getBooks(){
  //this .ajax block is the same as url.json
  $.ajax({
    url: this.href,
    method: 'get',
    dataType: 'json'
  }).done(response => {
    response.forEach(book => {
      const newBook = new Book(book)
      const newBookTemplate = newBook.bookInfoTemplate()
      // append to the DOM
      document.querySelector('div#books_info').innerHTML += newBookTemplate
    })
  })
}

// Displays previous book show page, selected by book.id
function prevBook(){
  $(document).on('click', ".prev_book", function(){
    let id = ($(this).data("id"))
    fetch(`books/${id-1}/next`)
    .then(res => res.json())
    .then(book => {
      $("#display_form").html("")
      book = new Book(book)
      let bookHtml = book.bookShowTemplate()
      $("#display_form").append(bookHtml)
      prevBook()
    })
    .catch(err => console.log(err))
  })
}

// Displays next book show page, selected by book.id
function nextBook(){
  $(document).on('click', '.next_book', function(){
    let id = ($(this).attr("data-id"))
    fetch(`books/${id}/next`)
    .then(res => res.json())
    .then(book => {
      $("#display_form").html("")
      book = new Book(book)
      let bookHtml = book.bookShowTemplate()
      $("#display_form").append(bookHtml)
      nextBook()
    })
    .catch(err => console.log(err))
  })
}

//html template for creating a new book




function listenForSubmit(){
  $('form').submit(function(event){
    event.preventDefault()
  })
}

//Listens when book title link is clicked
$(document).on("click", ".show_book", function(event) {
  event.preventDefault()
  event.stopPropagation()
  let $id = ($(this).attr("data-id")) //retrieves data-id from bookShowTemplate() buttons
  const $authorId = ($(this).data('author-id'))
  fetch(`/books/${$id}.json`)
  .then(res => res.json())
  .then(book => {
    $("#display_book").html("")
    book = new Book(book)
    let bookHtml = book.bookShowTemplate()

    listenForNewBookForm()

    //displays book show page
    $("#display_book").append(bookHtml)

    nextBook()
    prevBook()
  })
  .catch(err => console.log(err))
})

function listenForNewBookForm() {

  $(document).on("click", "button.load_form", function(event) {
    event.preventDefault()
    function newBookForm(authorId) {
        return (`
          <p>Provide this author's book title and genre of the book that you want ordered.</p>
          <form class='new_form' action="/authors/${authorId}/books" data-id="${this.id}"
            Title: <input type='text' id='book_title' name='book[title]' placeholder="Request Book Title" >
            Genre: <input type='text' id=''book_genre' name='book[genre]' placeholder="Mystery, Biography">
            <p><font color="red">All Requested Custom Orders are: $30</font></p>
            <input type='hidden' id='book_author' name='book[author]' data-id="${authorId}" value=${authorId}>
            <input type='hidden' id='book_price' name='book[price]' value='30'>
            <input type="submit" value="Submit Form">
          </form>
    `)}
    // event.stopPropagation()

    const authorId = $(this).data("author-id")
    debugger
    let newForm = newBookForm(authorId)
    $("button.load_form").remove()
    $("#display_form").html(newForm)
    listenForSubmit()
  })
}
//display show page when book title clicked
// function displayBook(){
//   $(document).on("click", ".show_book", function(event) {
//     event.preventDefault()
//     let id = ($(this).attr("data-id")) //retrieves data-id from bookShowTemplate() buttons
//     fetch(`/books/${id}.json`)
//     .then(res => res.json())
//     .then(book => {
//       $(".display_book").html("")
//       book = new Book(book)
//       let bookHtml = book.bookShowTemplate()
//       $(".display_book").append(bookHtml)
//
//       nextBook()
//       prevBook()
//     })
//     .catch(err => console.log(err))
//   })
// }
