class Book < ApplicationRecord
  belongs_to :author
  has_many :order_items
  has_many :carts, through: :order_items
  scope :most_expensive, -> {order(price: :desc).limit(3)}
  scope :cheapest, -> {order(price: :asc).limit(3)}
  scope :alphabetical, -> {order(title: :asc).limit(10)}
  before_save :make_title_case
  scope :most_valuable, -> {order("price DESC").select("title, price").limit(3)}

  def make_title_case
    self.genre = self.genre.titlecase
    self.title = self.title.titlecase
  end

  def previous_id  # => returns prev book book in database, not strictly by id number
    book = Book.where(["id < ?", id]).last
    if book
      return book.id
    else
      Book.last.id
    end
  end

   def next_id   # => returns next book book in database, not strictly by id number
    book = Book.where(["id > ?", id]).first   #whitelist variable to prevent SQL injection
    if book
      return book.id
    else
      Book.first.id
    end
  end
  # Person
  #   .select('people.id, people.name, comments.text')
  #   .joins(:comments)
  #   .where('comments.created_at > ?', 1.week.ago)

  # Reports make for a good usage of class scopes, such as "Most Valuable Cart by Customer"
  # where the code would implement a Cart.most_valuable and Cart.by_customer which
  # could be combined as Cart.most_valuable.by_customer(@customer).

end
