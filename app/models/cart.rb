class Cart < ApplicationRecord
  belongs_to :user
  has_many :order_items
  has_many :books, through: :order_items

  # Person
  #   .select('people.id, people.name, comments.text')
  #   .joins(:comments)
  #   .where('comments.created_at > ?', 1.week.ago)

  # Reports make for a good usage of class scopes, such as "Most Valuable Cart by Customer"
  # where the code would implement a Cart.most_valuable and Cart.by_customer which
  # could be combined as Cart.most_valuable.by_customer(@customer).

  def calculate_total
    self.order_items.collect { |oi| oi.book.price * oi.quantity }.sum
  end

  def self.total
    Cart.all.sort { |a, b| b.calculate_total <=> a.calculate_total }
  end

  def self.best_customers
    Cart.total.collect{ |cart| cart.calculate_total}
  end
end
