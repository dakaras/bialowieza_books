$(function(){
  console.log('index.js loaded..')
  getBooks()
})

//do this for showing a list(index), showing a single element(show), and has_many

//call a function
//in the function, do an ajax request

//take the response from the request and create a class object
//create a custom function on the class object prototype (show some html to put on the DOM)
//append the html to the DOM

function getBooks(){
  $.ajax({
    url: 'http://localhost:3000/books',
    method: 'get',
    dataType: 'json'
  }).done(function(response) {
    console.log('response:' response)
    let book = new Book(response[0])
    let bookDisplay = book.bookHTML()
    //append to the DOM 
  })
}

class Book {
  constructor(obj){
    this.title = obj.title
  }
}

Book.prototype.bookHTML = function(){
  return (`
    <div>${this.title}</div>
    `)
}
