class BooksController < ApplicationController
  before_action :authorize
  skip_before_action :verify_authenticity_token

  def index
    @order_item = current_user.cart.order_items.new
    if params[:author_id]
      @books = Book.all.where(author_id: params[:author_id])
    else
      @books = Book.all
    end
    respond_to do |f|
      f.html {render :index}
      f.json {render json: @books}
    end
  end


  def new
    @author = Author.find(params[:author_id])
    @book = Book.new
    @book.author = @author
  end

  def create
    @book = Book.new(book_params)
    @book.author = Author.find(params[:author_id])
    @book.save
    respond_to do |f|
      f.html {redirect_to author_path(@book.author)}
      f.json {render json: @book}
    end
  end

  def show
    @order_item = current_user.cart.order_items.new
    @book = Book.find_by(id: params[:id])
    @author = @book.author.name
    respond_to do |f|
      f.html {render :show}
      f.json {render json: @book}
    end
  end

  def prev
    @book = Book.find_by(id: params[:id])
    @prev_book = @book.previous
    render json: @prev_book
  end

  def next
    @book = Book.find_by(id: params[:id])
    @next_book = @book.next
    render json: @next_book
  end

  private
  def book_params
    params.require(:book).permit(:title, :author_id, :genre, :price)
  end
end
