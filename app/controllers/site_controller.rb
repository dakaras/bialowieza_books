class SiteController < ApplicationController
  def index
    @books = Book.all
  end 
end
