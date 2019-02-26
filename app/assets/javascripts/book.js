$(function(){
  console.log('index.js loaded..')
  // getBooks()
})

class Book {
  constructor(obj){
    this.id = obj.id
    this.title = obj.title
    this.genre = obj.genre
    this.price = obj.price
    this.summary = obj.summary
    this.author_id = obj.author_id
  }
}


// Create html to display new book and append to dom
Book.prototype.bookInfoTemplate = function(){
  return (`
    <p> Title: ${this.title} </p>
    <p> Author: ${this.author.name} </p>
    <p> Genre: ${this.genre} </p>
    <p> Price: ${this.price} </p>
    <p> Summary: ${this.summary} </p>
    `)
}


// Book.success = function(json){
//   const book = new Book({id: json.data.id, title: json.data.attributes.title, genre: json.data.attributes.genre, price: json.data.attributes.price, summary: json.data.attributes.summary, authorId: json.data.attributes['author-id'] })
//   const bookHTML = book.bookHTML()
//   $('#author_show').append(bookHTML)
// }
//
// Book.fail = function(err){
//   console.error("Error:"err)
// }
//
//
// Book.prototype.bookHTML = function(){
//   return (`
//     <div>${this.title}</div>
//     `)
// }
//
// Dish.prototype.formatRestaurantDish = function() {
//   return `<li><strong><a href="/dishes/${this.id}">${this.name}</a></strong> | Added to 1 Dish-List</li><br><br>`
// }
//
// function getBooks(){
//   $.ajax({
//     url: 'http://localhost:3000/books',
//     method: 'get',
//     dataType: 'json'
//   }).done(function(response) {
//     console.log('response:' response)
//     let book = new Book(response[0])
//     let bookDisplay = book.bookHTML()
//     //append to the DOM
//   })
// }
