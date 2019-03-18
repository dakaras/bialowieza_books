$(function(){
  console.log('book.js loaded..')
  listenForClicks()
  displayBook()
})

//turn JSON data into strings for the attributes by creating a Book object
class Book {
  constructor(obj){
    this.id = obj.id
    this.title = obj.title
    this.author = obj.author
    this.genre = obj.genre
    this.price = obj.price
    this.summary = obj.summary
  }
}

// Create html framework to display new book and append to DOM
Book.prototype.bookInfoTemplate = function(){
  return (`
    <img src="https://www.ioba.org/pages/wp-content/uploads/2011/12/alledgesgilt.jpg" alt= ${this.title} width="400" height="400" %><br><br>
    Title: <a href= "/books/${this.id}" data-id="${this.id}" class="show_book">${this.title}</a>
    <p> Author: <a href="/authors/${this.author.id}" class="show_author">${this.author.name}</a></p>
    <p> Price: $${this.price} </p>
    <input type="number" value="1" name="order_item[quantity]" id="order_item_quantity">
    <input type="submit" name="commit" value="Add to Cart" data-disable-with="Add to Cart"><br><br>
    `)
}

Book.prototype.bookShowTemplate = function(){
  return (`
    <p>Title: ${this.title} </p>
    <p> Author: ${this.author.name} </p>
    <p> Genre: ${this.genre} </p>
    <p> Price: $${this.price} </p>
    <p> Summary: ${this.summary} </p>
    <button class="prev_book" data-id="${this.id-1}">Prev Book</button><br><br>
    <button class="next_book" data-id="${this.id}">Next Book</button><br><br>
    `)
}

function listenForClicks(){
  $('#load_books').on('click', event => {
    event.preventDefault()
    history.pushState(null, null, "books")
    getBooks()
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

function prevBook(){
  $(document).on('click', ".prev_book", function(){
    let id = ($(this).data("id"))
    fetch(`books/${id-1}/next`)
    .then(res => res.json())
    .then(book => {
      $("#display_book").html("")
      book = new Book(book)
      let bookHtml = book.bookShowTemplate()
      $("#display_book").append(bookHtml)
      prevBook()
    })
    .catch(err => console.log(err))
  })
}

function nextBook(){
  $(document).on('click', '.next_book', function(){
    let id = ($(this).attr("data-id"))
    fetch(`books/${id}/next`)
    .then(res => res.json())
    .then(book => {
      $("#display_book").html("")
      book = new Book(book)
      let bookHtml = book.bookShowTemplate()
      $("#display_book").append(bookHtml)
      nextBook()
    })
    .catch(err => console.log(err))
  })
}

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
