// $(document).ready()
$(function(){
  console.log('book.js loaded..')
  listenForIndex()
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
    <img src="https://www.ioba.org/pages/wp-content/uploads/2011/12/alledgesgilt.jpg" alt= ${this.title} width="400" height="400"><br><br>
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
  $(document).on('click', ".prev_book", function(event){
    event.preventDefault()
    // event.stopPropagation()
    let id = ($(this).data("id"))
    fetch(`/books/${id-1}/next`)
    .then(res => res.json())
    .then(book => {
      $("#display_form").html("")
      book = new Book(book)
      let bookHtml = book.bookShowTemplate()
      $("#display_form").append(bookHtml)
      prevBook()
      // $('.load_form').remove()
    })
    .catch(err => console.log(err))
  })
}

// Displays next book show page, selected by book.id
function nextBook(){
  $(document).on('click', '.next_book', function(event){
    event.preventDefault()
    // event.stopPropagation()
    let id = ($(this).attr("data-id"))
    fetch(`/books/${id}/next`)
    .then(res => res.json())
    .then(book => {
      $("#display_form").html("")
      book = new Book(book)
      let bookHtml = book.bookShowTemplate()
      $("#display_form").append(bookHtml)
      nextBook()
      // $('.load_form').remove()
    })
    .catch(err => console.log(err))
  })
}



//Listens when book title link is clicked
$(document).on("click", ".show_book", function(event) {
  event.preventDefault()
  event.stopPropagation() //preventing any parent event handlers from being executed.
  let $id = ($(this).attr("data-id")) //retrieves data-id from bookShowTemplate() buttons
  const authorId = ($(this).data('author-id'))
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
        <div>Provide this author's book title and genre of the book that you want ordered.</div><br><br>
        <form class='new_form' action="/authors/${authorId}/books" data-id="${this.id}">
          Title: <input type='text' id='book_title' name='book[title]' placeholder="Request Book Title"><br><br>
          Genre: <input type='text' id=''book_genre' name='book[genre]' placeholder="Mystery, Biography"><br><br>
          <p><font color="red">All Requested Custom Orders are: $30</font></p>
          <input type='hidden' id='book_author' name='book[author]' data-id="${authorId}" value=${authorId}>
          <input type='hidden' id='book_price' name='book[price]' value='30'>
          <input type="submit" value="Submit Form"><br><br>
        </form>
    `)}

    const authorId = $(this).data("author-id")
    let newForm = newBookForm(authorId)
    $("button.load_form").remove()
    $("#display_form").html(newForm)

    // listener for submitting form
    $(document).on('submit', '.new_form', function(event){
      event.preventDefault()  // avoids actual submission of the form.
      const attributes = $(this).serialize()
      // author_books_path POST /authors/:author_id/books
      $.post(`localhost:3000/authors/${authorId}/books`, attributes)
      .done(function(data){
        console.log(data)
      })
    })
    // $('form.new_form').on('submit', function(event){
    //   event.preventDefault()
    //   const form = $(this)
    //   const action = form.attr('action')
    //   const params = form.serialize()
    //
    //   $.ajax({
    //     url: action,
    //     method: 'post',
    //     data: params,
    //     dataType: 'json'
    //   })
    //   .done(function(data){
    //     console.log(data)
    //   })
    // })
  })
}

// fetch('/api/v1/people.json', {
//   method: 'post',
//   body: JSON.stringify({first_name: "Ricky", last_name: "Bobby"}),
//   headers: {
//     'Content-Type': 'application/json',
//     'X-CSRF-Token': Rails.csrfToken()
//   },
//   credentials: 'same-origin'
// }).then(function(response) {
//   return response.json();
// }).then(function(data) {
//   console.log(data);
// });
