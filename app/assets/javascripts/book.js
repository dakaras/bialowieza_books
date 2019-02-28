$(function(){
  console.log('book.js loaded..')
  listenForClick()
})

function listenForClick(){
  $('a.load_book').on('click', event => {
    event.preventDefault()
    getBook()
  })
}

function getBook(){
  //this .ajax block is the same as url.json
  $.ajax({
    url: this.href,
    method: 'get',
    dataType: 'json'
  }).done(response => {
    console.log(response)
    response.forEach(book => {
      document.querySelector('div#book_info').innerHTML = ""
      const newBook = new Book(book)
      const newBookTemplate = newBook.bookInfoTemplate()
      // append to the DOM
      document.querySelector('div#book_info').innerHTML = newBookTemplate
    })
  })
}

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
    <p> Title: ${this.title} </p>
    <p> Author: ${this.author.name} </p>
    <p> Genre: ${this.genre} </p>
    <p> Price: ${this.price} </p>
    <p> Summary: ${this.summary} </p>
    `)
}

// // clear the OL html (in case there were stale comments)
// var $ol = $("div.comments ol")
// $ol.html("") // emptied the OL
//
// // iterate over each comment within json
// json.forEach(function(comment){
//   // with each comment data, append an LI to the OL with the comment content
//   $ol.append("<li>" + comment.content + "</li>");
// })
