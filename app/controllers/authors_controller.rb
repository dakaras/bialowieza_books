class AuthorsController < ApplicationController
  before_action :authorize

  def index
    @authors = Author.all.most_published
    respond_to do |f|
      f.html {render :index}
      f.json {render json: @authors}
    end
  end

  def show
    @author = Author.find_by(id: params[:id])
    @books = @author.books
    @order_item = current_user.cart.order_items.new
    respond_to do |f|
        f.html {render :show}
        f.json {render json: @author}
      end
  end

  # def authors_list
  #   @authors = Author.all.most_published
  #   respond_to do |f|
  #     f.html { render :authors_list, layout: false }
  #     f.json {render json: @authors, layout: false}
  #   end
  # end

end
