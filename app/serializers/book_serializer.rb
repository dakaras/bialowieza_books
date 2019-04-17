class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author_id, :genre, :summary, :price, :previous_id, :next_id
  belongs_to :author
  has_many :order_items
  has_many :carts
end
