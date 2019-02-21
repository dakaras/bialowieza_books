class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author_id, :genre, :summary, :price
  belongs_to :author
  has_many :order_items
  has_many :carts, through: :order_items
end
